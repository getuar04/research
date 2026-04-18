import {
  getUserByIdRepo,
  getUserByIdWithPasswordRepo,
  updateProfileRepo,
} from "../../../repositories/auth.repository.js";

export const postgresAuthRepository = {
  getById: async (userId) => {
    return await getUserByIdRepo(userId);
  },

  getByIdWithPassword: async (userId) => {
    return await getUserByIdWithPasswordRepo(userId);
  },

  updateProfile: async (userId, name) => {
    return await updateProfileRepo(userId, name);
  },
};
