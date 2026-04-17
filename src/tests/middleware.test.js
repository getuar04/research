import { describe, test, expect, jest } from "@jest/globals";

jest.unstable_mockModule("../utils/jwt.js", () => ({
  verifyAccessToken: jest.fn(),
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
  generateResetToken: jest.fn(),
}));

const { authMiddleware } = await import("../middleware/auth.middleware.js");
const { roleMiddleware } = await import("../middleware/role.middleware.js");
const { errorMiddleware } = await import("../middleware/error.middleware.js");
const { verifyAccessToken } = await import("../utils/jwt.js");

describe("Middleware Tests", () => {
  describe("authMiddleware", () => {
    test("duhet të hedhë 401 nëse nuk ka token", async () => {
      const req = { headers: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test("duhet të hedhë 401 nëse token është invalid", async () => {
      verifyAccessToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const req = { headers: { authorization: "Bearer invalid-token" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    test("duhet të kalojë nëse token është valid", async () => {
      verifyAccessToken.mockReturnValue({
        id: 1,
        email: "test@test.com",
        role: "user",
      });

      const req = { headers: { authorization: "Bearer valid-token" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await authMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
    });
  });

  describe("roleMiddleware", () => {
    test("duhet të kalojë nëse user ka rolin e duhur", () => {
      const middleware = roleMiddleware("admin");
      const req = { user: { role: "admin" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test("duhet të hedhë 403 nëse user nuk ka rolin e duhur", () => {
      const middleware = roleMiddleware("admin");
      const req = { user: { role: "user" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("errorMiddleware", () => {
    test("duhet të kthejë 400 për error të panjohur", () => {
      const err = new Error("Something went wrong");
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      errorMiddleware(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("duhet të kthejë 404 për User not found", () => {
      const err = new Error("User not found");
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      errorMiddleware(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
