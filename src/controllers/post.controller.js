import {
  getAllPostsService,
  getPostByIdService,
  createPostService,
  updatePostService,
  deletePostService,
} from "../services/post.service.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await getAllPostsService();

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await getPostByIdService(Number(req.params.id));

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    const status = error.message === "Post not found" ? 404 : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    const post = await createPostService(title, content, userId);

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    const post = await updatePostService(
      Number(req.params.id),
      title,
      content,
      userId,
    );

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    const status =
      error.message === "Post not found" ||
      error.message === "User does not exist"
        ? 404
        : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await deletePostService(Number(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: post,
    });
  } catch (error) {
    const status = error.message === "Post not found" ? 404 : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};
