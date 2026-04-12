import {
  getAllUsersRepo,
  getUserByIdRepo,
  createUserRepo,
  updateUserRepo,
  deleteUserRepo,
} from "../repositories/user.repository.js";

export const getAllUsersService = async () => {
  return await getAllUsersRepo();
};

export const getUserByIdService = async (id) => {
  if (!id || Number.isNaN(id)) {
    throw new Error("Valid user id is required");
  }

  const user = await getUserByIdRepo(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const createUserService = async (name, email) => {
  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  return await createUserRepo(name, email);
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

  return deletedUser;
};
