import {
  getAllPostsRepo,
  getPostByIdRepo,
  getMyPostsRepo,
  createPostRepo,
  updatePostRepo,
  deletePostRepo,
} from "../../../repositories/post.repository.js";

export const postgresPostRepository = {
  getAll: async () => {
    return await getAllPostsRepo();
  },

  getById: async (id) => {
    return await getPostByIdRepo(id);
  },

  getByUserId: async (userId) => {
    return await getMyPostsRepo(userId);
  },

  create: async ({ title, content, userId }) => {
    return await createPostRepo(title, content, userId);
  },

  update: async ({ id, title, content }) => {
    return await updatePostRepo(id, title, content);
  },

  delete: async (id) => {
    return await deletePostRepo(id);
  },
};
