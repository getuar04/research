import { describe, test, expect, jest } from "@jest/globals";

jest.unstable_mockModule("../config/env.js", () => ({
  env: {
    jwtAccessSecret: "test-access-secret",
    jwtAccessExpiresIn: "15m",
    jwtRefreshSecret: "test-refresh-secret",
    jwtRefreshExpiresIn: "7d",
  },
}));

const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateResetToken,
} = await import("../utils/jwt.js");

describe("JWT Utils", () => {
  const mockUser = { id: 1, email: "test@test.com", role: "user" };

  describe("generateAccessToken", () => {
    test("duhet të gjenerojë access token", () => {
      const token = generateAccessToken(mockUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });
  });

  describe("generateRefreshToken", () => {
    test("duhet të gjenerojë refresh token", () => {
      const token = generateRefreshToken(mockUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });
  });

  describe("verifyAccessToken", () => {
    test("duhet të verifikojë access token valid", () => {
      const token = generateAccessToken(mockUser);
      const decoded = verifyAccessToken(token);
      expect(decoded.id).toBe(1);
      expect(decoded.email).toBe("test@test.com");
    });

    test("duhet të hedhë error nëse token është invalid", () => {
      expect(() => verifyAccessToken("invalid-token")).toThrow();
    });
  });

  describe("verifyRefreshToken", () => {
    test("duhet të verifikojë refresh token valid", () => {
      const token = generateRefreshToken(mockUser);
      const decoded = verifyRefreshToken(token);
      expect(decoded.id).toBe(1);
    });

    test("duhet të hedhë error nëse token është invalid", () => {
      expect(() => verifyRefreshToken("invalid-token")).toThrow();
    });
  });

  describe("generateResetToken", () => {
    test("duhet të gjenerojë reset token unik", () => {
      const token1 = generateResetToken();
      const token2 = generateResetToken();
      expect(token1).toBeDefined();
      expect(token1).not.toBe(token2);
    });
  });
});
