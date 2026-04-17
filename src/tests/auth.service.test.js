import { describe, test, expect, jest } from "@jest/globals";

// Mock të gjitha varësitë
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

jest.unstable_mockModule("../config/env.js", () => ({
  env: {
    twoFaExpiresSeconds: 300,
    resetPasswordExpiresSeconds: 600,
    frontendOrigin: "http://localhost:3000",
  },
}));

const { registerService, loginService, logoutService } =
  await import("../services/auth.service.js");
const { getUserByEmailRepo, createAuthUserRepo, getUserByIdWithPasswordRepo } =
  await import("../repositories/auth.repository.js");
const { redisClient } = await import("../db/redis.js");
const { sendEvent } = await import("../kafka/producer.js");

describe("Auth Service", () => {
  describe("registerService", () => {
    test("duhet të regjistrojë user me sukses", async () => {
      getUserByEmailRepo.mockResolvedValue(null);
      createAuthUserRepo.mockResolvedValue({
        id: 1,
        name: "Test User",
        email: "test@test.com",
        role: "user",
      });
      sendEvent.mockResolvedValue();

      const result = await registerService(
        "Test User",
        "test@test.com",
        "password123",
      );

      expect(result.email).toBe("test@test.com");
      expect(createAuthUserRepo).toHaveBeenCalled();
    });

    test("duhet të hedhë error nëse user ekziston", async () => {
      getUserByEmailRepo.mockResolvedValue({ id: 1, email: "test@test.com" });

      await expect(
        registerService("Test User", "test@test.com", "password123"),
      ).rejects.toThrow("User with this email already exists");
    });

    test("duhet të hedhë error nëse mungojnë fushat", async () => {
      await expect(registerService("", "", "")).rejects.toThrow(
        "Name, email and password are required",
      );
    });
  });

  describe("logoutService", () => {
    test("duhet të logout me sukses", async () => {
      getUserByIdWithPasswordRepo.mockResolvedValue({
        id: 1,
        email: "test@test.com",
      });
      redisClient.del.mockResolvedValue();
      sendEvent.mockResolvedValue();

      const result = await logoutService(1);
      expect(result.message).toBe("Logged out successfully");
    });

    test("duhet të hedhë error nëse nuk ka userId", async () => {
      await expect(logoutService(null)).rejects.toThrow("User id is required");
    });
  });
});
