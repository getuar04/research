import bcrypt from "bcrypt";
import { redisClient } from "../db/redis.js";
import { env } from "../config/env.js";
import {
  getUserByEmailRepo,
  createAuthUserRepo,
  markUserVerifiedRepo,
  updateUserPasswordRepo,
  getUserByIdWithPasswordRepo,
  updateProfileRepo,
} from "../repositories/auth.repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
} from "../utils/jwt.js";
import { sendMail } from "../utils/mail.js";
import { sendEvent } from "../kafka/producer.js";

const generateSixDigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const registerService = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }

  const existingUser = await getUserByEmailRepo(email);

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createAuthUserRepo(name, email, hashedPassword, "user");

  await sendEvent("post-events", {
    action: "USER_REGISTERED",
    userId: user.id,
    email: user.email,
    message: `User ${user.email} registered`,
    createdAt: new Date().toISOString(),
  });

  return user;
};

export const loginService = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await getUserByEmailRepo(email);

  if (!user) {
    await sendEvent("post-events", {
      action: "LOGIN_FAILED",
      email,
      message: `Failed login attempt for ${email}`,
      createdAt: new Date().toISOString(),
    });

    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    await sendEvent("post-events", {
      action: "LOGIN_FAILED",
      email,
      userId: user.id,
      message: `Failed login attempt for ${email}`,
      createdAt: new Date().toISOString(),
    });

    throw new Error("Invalid email or password");
  }

  const code = generateSixDigitCode();

  await redisClient.set(`2fa:${email}`, code, {
    EX: env.twoFaExpiresSeconds,
  });

  await sendMail({
    to: email,
    subject: "Your 2FA Code",
    text: `Your 2FA code is: ${code}`,
  });

  await sendEvent("post-events", {
    action: "LOGIN_2FA_SENT",
    userId: user.id,
    email,
    message: `2FA code sent to ${email}`,
    createdAt: new Date().toISOString(),
  });

  return {
    message: "2FA code sent successfully",
    email,
  };
};

export const verifyTwoFaService = async (email, code) => {
  if (!email || !code) {
    throw new Error("Email and code are required");
  }

  const storedCode = await redisClient.get(`2fa:${email}`);

  if (!storedCode) {
    throw new Error("2FA code expired or not found");
  }

  if (storedCode !== code) {
    throw new Error("Invalid 2FA code");
  }

  await redisClient.del(`2fa:${email}`);

  const user = await getUserByEmailRepo(email);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.is_verified) {
    await markUserVerifiedRepo(email);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await redisClient.set(`refresh:${user.id}`, refreshToken, {
    EX: 60 * 60 * 24 * 7,
  });

  await sendEvent("post-events", {
    action: "USER_LOGGED_IN",
    userId: user.id,
    email: user.email,
    message: `User ${user.email} logged in successfully`,
    createdAt: new Date().toISOString(),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: true,
    },
  };
};

export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const decoded = verifyRefreshToken(refreshToken);

  const storedRefreshToken = await redisClient.get(`refresh:${decoded.id}`);

  if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const user = await getUserByIdWithPasswordRepo(decoded.id);

  if (!user) {
    throw new Error("User not found");
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  await redisClient.set(`refresh:${user.id}`, newRefreshToken, {
    EX: 60 * 60 * 24 * 7,
  });

  await sendEvent("post-events", {
    action: "TOKEN_REFRESHED",
    userId: user.id,
    email: user.email,
    message: `Access token refreshed for ${user.email}`,
    createdAt: new Date().toISOString(),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const forgotPasswordService = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await getUserByEmailRepo(email);

  if (!user) {
    throw new Error("User with this email does not exist");
  }

  const resetToken = generateResetToken();

  await redisClient.set(`reset:${resetToken}`, email, {
    EX: env.resetPasswordExpiresSeconds,
  });

  const resetLink = `${env.frontendOrigin}/reset-password?token=${resetToken}`;

  await sendMail({
    to: email,
    subject: "Reset Password",
    text: `Use this link to reset your password: ${resetLink}`,
  });

  await sendEvent("post-events", {
    action: "PASSWORD_RESET_REQUESTED",
    userId: user.id,
    email,
    message: `Password reset requested for ${email}`,
    createdAt: new Date().toISOString(),
  });

  return {
    message: "Password reset link sent successfully",
  };
};

export const resetPasswordService = async (token, newPassword) => {
  if (!token || !newPassword) {
    throw new Error("Token and newPassword are required");
  }

  const email = await redisClient.get(`reset:${token}`);

  if (!email) {
    throw new Error("Reset token expired or invalid");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedUser = await updateUserPasswordRepo(email, hashedPassword);

  if (!updatedUser) {
    throw new Error("User not found");
  }

  await redisClient.del(`reset:${token}`);

  await sendEvent("post-events", {
    action: "PASSWORD_RESET_COMPLETED",
    userId: updatedUser.id,
    email,
    message: `Password reset completed for ${email}`,
    createdAt: new Date().toISOString(),
  });

  return {
    message: "Password reset successfully",
  };
};

export const logoutService = async (userId) => {
  if (!userId) {
    throw new Error("User id is required");
  }

  const user = await getUserByIdWithPasswordRepo(userId);

  await redisClient.del(`refresh:${userId}`);

  await sendEvent("post-events", {
    action: "USER_LOGGED_OUT",
    userId,
    email: user?.email || null,
    message: `User logged out`,
    createdAt: new Date().toISOString(),
  });

  return {
    message: "Logged out successfully",
  };
};

export const meService = async (userId) => {
  const user = await getUserByIdWithPasswordRepo(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    is_verified: user.is_verified,
    created_at: user.created_at,
  };
};

export const updateProfileService = async (userId, name) => {
  if (!userId) {
    throw new Error("User id is required");
  }

  if (!name) {
    throw new Error("Name is required");
  }

  const user = await updateProfileRepo(userId, name);

  if (!user) {
    throw new Error("User not found");
  }

  await sendEvent("post-events", {
    action: "PROFILE_UPDATED",
    userId: user.id,
    email: user.email,
    message: `Profile updated for ${user.email}`,
    createdAt: new Date().toISOString(),
  });

  return user;
};
