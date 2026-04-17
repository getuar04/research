import {
  registerService,
  loginService,
  verifyTwoFaService,
  refreshTokenService,
  forgotPasswordService,
  resetPasswordService,
  logoutService,
  meService,
  updateProfileService,
  googleLoginService,
} from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await registerService(name, email, password);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await loginService(email, password);

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {
      email: result.email,
    },
  });
});

export const verifyTwoFa = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const result = await verifyTwoFaService(email, code);

  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  return res.status(200).json({
    success: true,
    message: "2FA verified successfully",
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshTokenFromCookie = req.cookies.refreshToken;

  const result = await refreshTokenService(refreshTokenFromCookie);

  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  return res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      accessToken: result.accessToken,
    },
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await forgotPasswordService(email);

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const result = await resetPasswordService(token, newPassword);

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const result = await logoutService(req.user.id);

  res.clearCookie("refreshToken");

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await meService(req.user.id);

  return res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const user = await updateProfileService(req.user.id, name);

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});

export const googleCallback = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = req.user;

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logged in with Google successfully",
    data: {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
      },
    },
  });
});
