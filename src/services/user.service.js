import {
  getAllUsersRepo,
  getUserByIdRepo,
  createUserRepo,
  updateUserRepo,
  deleteUserRepo,
} from "../repositories/user.repository.js";
import { redisClient } from "../db/redis.js";

export const getAllUsersService = async () => {
  const cachedUsers = await redisClient.get("users:all");

  if (cachedUsers) {
    return JSON.parse(cachedUsers);
  }

  const users = await getAllUsersRepo();

  await redisClient.set("users:all", JSON.stringify(users), {
    EX: 60,
  });

  return users;
};

export const getUserByIdService = async (id) => {
  if (!id || Number.isNaN(id)) {
    throw new Error("Valid user id is required");
  }

  const cacheKey = `users:${id}`;
  const cachedUser = await redisClient.get(cacheKey);

  if (cachedUser) {
    return JSON.parse(cachedUser);
  }

  const user = await getUserByIdRepo(id);

  if (!user) {
    throw new Error("User not found");
  }

  await redisClient.set(cacheKey, JSON.stringify(user), {
    EX: 60,
  });

  return user;
};

export const createUserService = async (name, email) => {
  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  const user = await createUserRepo(name, email);

  await redisClient.del("users:all");

  return user;
};

export const updateUserService = async (id, name, email) => {
  if (!id || Number.isNaN(id)) {
    throw new Error("Valid user id is required");
  }

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  const updatedUser = await updateUserRepo(id, name, email);

  if (!updatedUser) {
    throw new Error("User not found");
  }

  await redisClient.del("users:all");
  await redisClient.del(`users:${id}`);

  return updatedUser;
};

export const deleteUserService = async (id) => {
  if (!id || Number.isNaN(id)) {
    throw new Error("Valid user id is required");
  }

  const deletedUser = await deleteUserRepo(id);

  if (!deletedUser) {
    throw new Error("User not found");
  }

  await redisClient.del("users:all");
  await redisClient.del(`users:${id}`);

  return deletedUser;
};
