import {
  getAllPostsRepo,
  getPostByIdRepo,
  createPostRepo,
  updatePostRepo,
  deletePostRepo,
} from "../repositories/post.repository.js";
import { getUserByIdRepo } from "../repositories/user.repository.js";
import { publishPostEvent } from "../kafka/producer.js";

export const getAllPostsService = async () => {
  return await getAllPostsRepo();
};

export const getPostByIdService = async (id) => {
  if (!id || Number.isNaN(id)) {
    throw new Error("Valid post id is required");
  }

  const post = await getPostByIdRepo(id);

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};

export const createPostService = async (title, content, userId) => {
  if (!title || !userId) {
    throw new Error("Title and userId are required");
  }

  const user = await getUserByIdRepo(userId);

  if (!user) {
    throw new Error("User does not exist");
  }

  const post = await createPostRepo(title, content, userId);

  await publishPostEvent("POST_CREATED", {
    postId: post.id,
    userId,
    userName: user.name,
    title: post.title,
  });

  return post;
};

export const updatePostService = async (id, title, content, userId) => {
  if (!id || Number.isNaN(id)) {
    throw new Error("Valid post id is required");
  }

  if (!title || !userId) {
    throw new Error("Title and userId are required");
  }

  const user = await getUserByIdRepo(userId);

  if (!user) {
    throw new Error("User does not exist");
  }

  const updatedPost = await updatePostRepo(id, title, content, userId);

  if (!updatedPost) {
    throw new Error("Post not found");
  }

  await publishPostEvent("POST_UPDATED", {
    postId: updatedPost.id,
    userId,
    userName: user.name,
    title: updatedPost.title,
  });

  return updatedPost;
};

export const deletePostService = async (id) => {
  if (!id || Number.isNaN(id)) {
    throw new Error("Valid post id is required");
  }

  const deletedPost = await deletePostRepo(id);

  if (!deletedPost) {
    throw new Error("Post not found");
  }

  await publishPostEvent("POST_DELETED", {
    postId: deletedPost.id,
    userId: deletedPost.user_id,
    title: deletedPost.title,
  });

  return deletedPost;
};
