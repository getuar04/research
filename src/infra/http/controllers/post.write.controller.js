import { asyncHandler } from "../../../utils/asyncHandler.js";
import {
  createPostUseCase,
  updatePostUseCase,
  deletePostUseCase,
} from "../../../di.js";

export const createPost = asyncHandler(async (req, res) => {
  const post = await createPostUseCase({
    title: req.body.title,
    content: req.body.content,
    user: req.user,
  });

  return res.status(201).json({
    success: true,
    data: post,
  });
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await updatePostUseCase({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    user: req.user,
  });

  return res.status(200).json({
    success: true,
    data: post,
  });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await deletePostUseCase({
    id: req.params.id,
    user: req.user,
  });

  return res.status(200).json({
    success: true,
    data: post,
  });
});
