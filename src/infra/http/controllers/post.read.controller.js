import { asyncHandler } from "../../../utils/asyncHandler.js";
import {
  getAllPostsUseCase,
  getPostByIdUseCase,
  getMyPostsUseCase,
} from "../../../di.js";

export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await getAllPostsUseCase();

  return res.status(200).json({
    success: true,
    data: posts,
  });
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await getPostByIdUseCase(req.params.id);

  return res.status(200).json({
    success: true,
    data: post,
  });
});

export const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await getMyPostsUseCase(req.user.id);

  return res.status(200).json({
    success: true,
    data: posts,
  });
});
