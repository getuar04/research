import {
  getAllPostsService,
  getMyPostsService,
  getPostByIdService,
  createPostService,
  updatePostService,
  deletePostService,
} from "../services/post.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await getAllPostsService();

  return res.status(200).json({
    success: true,
    data: posts,
  });
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await getPostByIdService(Number(req.params.id));

  return res.status(200).json({
    success: true,
    data: post,
  });
});

export const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  const post = await createPostService(title, content, userId);

  return res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: post,
  });
});

export const updatePost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  const role = req.user.role;

  const post = await updatePostService(
    Number(req.params.id),
    title,
    content,
    userId,
    role,
  );

  return res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: post,
  });
});

export const deletePost = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  const post = await deletePostService(Number(req.params.id), userId, role);

  return res.status(200).json({
    success: true,
    message: "Post deleted successfully",
    data: post,
  });
});

export const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await getMyPostsService(req.user.id);

  return res.status(200).json({
    success: true,
    data: posts,
  });
});
