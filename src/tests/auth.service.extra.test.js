import { describe, test, expect, jest } from "@jest/globals";

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: jest.fn().mockResolvedValue("hashedpassword"),
    compare: jest.fn().mockResolvedValue(true),
  },
  hash: jest.fn().mockResolvedValue("hashedpassword"),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.unstable_mockModule("../repositories/auth.repository.js", () => ({
  getUserByEmailRepo: jest.fn(),
  createAuthUserRepo: jest.fn(),
  markUserVerifiedRepo: jest.fn(),
  updateUserPasswordRepo: jest.fn(),
  getUserByIdWithPasswordRepo: jest.fn(),
  updateProfileRepo: jest.fn(),
  findOrCreateGoogleUserRepo: jest.fn(),
}));

jest.unstable_mockModule("../db/redis.js", () => ({
  redisClient: {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  },
}));

jest.unstable_mockModule("../utils/mail.js", () => ({
  sendMail: jest.fn(),
}));

jest.unstable_mockModule("../kafka/producer.js", () => ({
  sendEvent: jest.fn(),
}));

jest.unstable_mockModule("../utils/jwt.js", () => ({
  generateAccessToken: jest.fn().mockReturnValue("access-token"),
  generateRefreshToken: jest.fn().mockReturnValue("refresh-token"),
  verifyRefreshToken: jest.fn(),
  generateResetToken: jest.fn().mockReturnValue("reset-token-123"),
}));

jest.unstable_mockModule("../config/env.js", () => ({
  env: {
    twoFaExpiresSeconds: 300,
    resetPasswordExpiresSeconds: 600,
    frontendOrigin: "http://localhost:3000",
  },
}));

const {
  loginService,
  verifyTwoFaService,
  forgotPasswordService,
  resetPasswordService,
  meService,
  updateProfileService,
  refreshTokenService,
} = await import("../services/auth.service.js");

const {
  getUserByEmailRepo,
  markUserVerifiedRepo,
  updateUserPasswordRepo,
  getUserByIdWithPasswordRepo,
  updateProfileRepo,
} = await import("../repositories/auth.repository.js");

const { redisClient } = await import("../db/redis.js");
const { sendMail } = await import("../utils/mail.js");
const { sendEvent } = await import("../kafka/producer.js");
const { verifyRefreshToken } = await import("../utils/jwt.js");

describe("Auth Service - Extra Tests", () => {
  describe("loginService", () => {
    test("duhet të dërgojë 2FA code me sukses", async () => {
      getUserByEmailRepo.mockResolvedValue({
        id: 1,
        email: "test@test.com",
        password: "hashedpassword",
      });
      redisClient.set.mockResolvedValue();
      sendMail.mockResolvedValue();
      sendEvent.mockResolvedValue();

      const result = await loginService("test@test.com", "password123");
      expect(result.message).toBe("2FA code sent successfully");
      expect(result.email).toBe("test@test.com");
    });

    test("duhet të hedhë error nëse email ose password mungon", async () => {
      await expect(loginService("", "")).rejects.toThrow(
        "Email and password are required",
      );
    });

    test("duhet të hedhë error nëse user nuk ekziston", async () => {
      getUserByEmailRepo.mockResolvedValue(null);
      await expect(
        loginService("nouser@test.com", "password123"),
      ).rejects.toThrow("Invalid email or password");
    });
  });

  describe("verifyTwoFaService", () => {
    test("duhet të hedhë error nëse code është i skaduar", async () => {
      redisClient.get.mockResolvedValue(null);
      await expect(
        verifyTwoFaService("test@test.com", "123456"),
      ).rejects.toThrow("2FA code expired or not found");
    });

    test("duhet të hedhë error nëse code është i gabuar", async () => {
      redisClient.get.mockResolvedValue("654321");
      await expect(
        verifyTwoFaService("test@test.com", "123456"),
      ).rejects.toThrow("Invalid 2FA code");
    });

    test("duhet të hedhë error nëse email ose code mungon", async () => {
      await expect(verifyTwoFaService("", "")).rejects.toThrow(
        "Email and code are required",
      );
    });
  });

  describe("forgotPasswordService", () => {
    test("duhet të dërgojë reset link me sukses", async () => {
      getUserByEmailRepo.mockResolvedValue({
        id: 1,
        email: "test@test.com",
      });
      redisClient.set.mockResolvedValue();
      sendMail.mockResolvedValue();
      sendEvent.mockResolvedValue();

      const result = await forgotPasswordService("test@test.com");
      expect(result.message).toBe("Password reset link sent successfully");
    });

    test("duhet të hedhë error nëse email mungon", async () => {
      await expect(forgotPasswordService("")).rejects.toThrow(
        "Email is required",
      );
    });

    test("duhet të hedhë error nëse user nuk ekziston", async () => {
      getUserByEmailRepo.mockResolvedValue(null);
      await expect(forgotPasswordService("nouser@test.com")).rejects.toThrow(
        "User with this email does not exist",
      );
    });
  });

  describe("resetPasswordService", () => {
    test("duhet të resetojë password me sukses", async () => {
      redisClient.get.mockResolvedValue("test@test.com");
      updateUserPasswordRepo.mockResolvedValue({
        id: 1,
        email: "test@test.com",
      });
      redisClient.del.mockResolvedValue();
      sendEvent.mockResolvedValue();

      const result = await resetPasswordService(
        "reset-token-123",
        "newpassword",
      );
      expect(result.message).toBe("Password reset successfully");
    });

    test("duhet të hedhë error nëse token është i skaduar", async () => {
      redisClient.get.mockResolvedValue(null);
      await expect(
        resetPasswordService("expired-token", "newpassword"),
      ).rejects.toThrow("Reset token expired or invalid");
    });

    test("duhet të hedhë error nëse token ose password mungon", async () => {
      await expect(resetPasswordService("", "")).rejects.toThrow(
        "Token and newPassword are required",
      );
    });
  });

  describe("meService", () => {
    test("duhet të kthejë user me sukses", async () => {
      getUserByIdWithPasswordRepo.mockResolvedValue({
        id: 1,
        name: "Test User",
        email: "test@test.com",
        role: "user",
        is_verified: true,
        created_at: new Date(),
      });

      const result = await meService(1);
      expect(result.email).toBe("test@test.com");
      expect(result.id).toBe(1);
    });

    test("duhet të hedhë error nëse user nuk ekziston", async () => {
      getUserByIdWithPasswordRepo.mockResolvedValue(null);
      await expect(meService(99)).rejects.toThrow("User not found");
    });
  });

  describe("updateProfileService", () => {
    test("duhet të përditësojë profilin me sukses", async () => {
      updateProfileRepo.mockResolvedValue({
        id: 1,
        name: "New Name",
        email: "test@test.com",
      });
      sendEvent.mockResolvedValue();

      const result = await updateProfileService(1, "New Name");
      expect(result.name).toBe("New Name");
    });

    test("duhet të hedhë error nëse name mungon", async () => {
      await expect(updateProfileService(1, "")).rejects.toThrow(
        "Name is required",
      );
    });

    test("duhet të hedhë error nëse userId mungon", async () => {
      await expect(updateProfileService(null, "Name")).rejects.toThrow(
        "User id is required",
      );
    });
  });

  describe("refreshTokenService", () => {
    test("duhet të hedhë error nëse refresh token mungon", async () => {
      await expect(refreshTokenService(null)).rejects.toThrow(
        "Refresh token is required",
      );
    });

    test("duhet të hedhë error nëse token është invalid", async () => {
      verifyRefreshToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });
      await expect(refreshTokenService("invalid-token")).rejects.toThrow(
        "Invalid token",
      );
    });
  });
});
