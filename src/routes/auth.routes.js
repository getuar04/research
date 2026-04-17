import { Router } from "express";
import {
  register,
  login,
  verifyTwoFa,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
  me,
  updateProfile,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  verifyTwoFaSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "../validators/auth.validator.js";

import passport from "../config/passport.js";
import { googleCallback } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/verify-2fa", validate(verifyTwoFaSchema), verifyTwoFa);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failed",
    session: false,
  }),
  googleCallback,
);

router.get("/google/failed", (req, res) => {
  return res.status(401).json({
    success: false,
    message: "Google authentication failed",
  });
});

router.get("/me", authMiddleware, me);
router.put(
  "/profile",
  authMiddleware,
  validate(updateProfileSchema),
  updateProfile,
);
router.post("/logout", authMiddleware, logout);

export default router;
