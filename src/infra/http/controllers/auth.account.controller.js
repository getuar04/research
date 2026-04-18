import { asyncHandler } from "../../../utils/asyncHandler.js";
import {
  getMeUseCase,
  updateProfileUseCase,
  logoutUseCase,
} from "../../../di.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const me = asyncHandler(async (req, res) => {
  const user = await getMeUseCase(req.user.id);

  return res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateProfileUseCase({
    userId: req.user.id,
    name: req.body.name,
  });

  return res.status(200).json({
    success: true,
    data: user,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const result = await logoutUseCase(req.user.id);

  res.clearCookie("refreshToken", refreshCookieOptions);

  return res.status(200).json({
    success: true,
    ...result,
  });
});
