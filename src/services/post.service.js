import {
  getAllPostsRepo,
  getPostByIdRepo,
  createPostRepo,
  updatePostRepo,
  deletePostRepo,
} from "../repositories/post.repository.js";
import { getUserByIdRepo } from "../repositories/auth.repository.js";
import { publishPostEvent } from "../kafka/producer.js";
import { redisClient } from "../db/redis.js";

export const getAllPostsService = async () => {
  const cachedPosts = await redisClient.get("posts:all");

  if (cachedPosts) {
    return JSON.parse(cachedPosts);
  }

  const posts = await getAllPostsRepo();

  await redisClient.set("posts:all", JSON.stringify(posts), {
    EX: 60,
  });

  return posts;
};

export const getPostByIdService = async (id) => {
  if (!id || Number.isNaN(id)) {
    throw new Error("Valid post id is required");
  }

  const cacheKey = `posts:${id}`;
  const cachedPost = await redisClient.get(cacheKey);

  if (cachedPost) {
    return JSON.parse(cachedPost);
  }

  const post = await getPostByIdRepo(id);

  if (!post) {
    throw new Error("Post not found");
  }

  await redisClient.set(cacheKey, JSON.stringify(post), {
    EX: 60,
  });

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

  await redisClient.del("posts:all");

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

  await redisClient.del("posts:all");
  await redisClient.del(`posts:${id}`);

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

  await redisClient.del("posts:all");
  await redisClient.del(`posts:${id}`);

  await publishPostEvent("POST_DELETED", {
    postId: deletedPost.id,
    userId: deletedPost.user_id,
    title: deletedPost.title,
  });

  return deletedPost;
};
