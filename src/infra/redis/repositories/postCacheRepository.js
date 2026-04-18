import { redisClient } from "../../../db/redis.js";

const POSTS_ALL_CACHE_KEY = "posts:all";
const POSTS_ALL_CACHE_TTL_SECONDS = 60;
const POSTS_BY_ID_CACHE_TTL_SECONDS = 60;
const POSTS_BY_USER_CACHE_TTL_SECONDS = 60;

const getPostByIdCacheKey = (id) => `posts:${id}`;
const getPostsByUserIdCacheKey = (userId) => `posts:user:${userId}`;

export const redisPostCacheRepository = {
  getAll: async () => {
    const cached = await redisClient.get(POSTS_ALL_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  },

  setAll: async (posts) => {
    await redisClient.setEx(
      POSTS_ALL_CACHE_KEY,
      POSTS_ALL_CACHE_TTL_SECONDS,
      JSON.stringify(posts),
    );
  },

  getById: async (id) => {
    const cached = await redisClient.get(getPostByIdCacheKey(id));
    return cached ? JSON.parse(cached) : null;
  },

  setById: async (id, post) => {
    await redisClient.setEx(
      getPostByIdCacheKey(id),
      POSTS_BY_ID_CACHE_TTL_SECONDS,
      JSON.stringify(post),
    );
  },

  getByUserId: async (userId) => {
    const cached = await redisClient.get(getPostsByUserIdCacheKey(userId));
    return cached ? JSON.parse(cached) : null;
  },

  setByUserId: async (userId, posts) => {
    await redisClient.setEx(
      getPostsByUserIdCacheKey(userId),
      POSTS_BY_USER_CACHE_TTL_SECONDS,
      JSON.stringify(posts),
    );
  },

  invalidateAll: async () => {
    await redisClient.del(POSTS_ALL_CACHE_KEY);
  },

  invalidateById: async (id) => {
    await redisClient.del(getPostByIdCacheKey(id));
  },

  invalidateByUserId: async (userId) => {
    await redisClient.del(getPostsByUserIdCacheKey(userId));
  },
};
