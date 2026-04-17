import { describe, test, expect, jest } from "@jest/globals";

jest.unstable_mockModule("../repositories/post.repository.js", () => ({
  createPostRepo: jest.fn(),
  getAllPostsRepo: jest.fn(),
  getMyPostsRepo: jest.fn(),
  getPostByIdRepo: jest.fn(),
  updatePostRepo: jest.fn(),
  deletePostRepo: jest.fn(),
}));

jest.unstable_mockModule("../kafka/producer.js", () => ({
  sendEvent: jest.fn(),
  publishPostEvent: jest.fn(),
}));

jest.unstable_mockModule("../db/redis.js", () => ({
  redisClient: {
    set: jest.fn(),
    get: jest.fn().mockResolvedValue(null),
    del: jest.fn(),
  },
}));

jest.unstable_mockModule("../repositories/auth.repository.js", () => ({
  getUserByIdRepo: jest.fn().mockResolvedValue({
    id: 1,
    name: "Test User",
    email: "test@test.com",
  }),
}));
const { createPostService, getAllPostsService, deletePostService } =
  await import("../services/post.service.js");

const { createPostRepo, getAllPostsRepo, getPostByIdRepo, deletePostRepo } =
  await import("../repositories/post.repository.js");

const { sendEvent } = await import("../kafka/producer.js");

describe("Post Service", () => {
  describe("createPostService", () => {
    test("duhet të krijojë post me sukses", async () => {
      createPostRepo.mockResolvedValue({
        id: 1,
        title: "Test Post",
        content: "Test Content",
        user_id: 1,
      });
      sendEvent.mockResolvedValue();

      const result = await createPostService(1, "Test Post", "Test Content");
      expect(result.title).toBe("Test Post");
      expect(createPostRepo).toHaveBeenCalled();
    });

    test("duhet të hedhë error nëse mungon userId", async () => {
      await expect(
        createPostService(null, "Title", "Content"),
      ).rejects.toThrow();
    });
  });

  describe("getAllPostsService", () => {
    test("duhet të kthejë listën e posteve", async () => {
      getAllPostsRepo.mockResolvedValue([
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" },
      ]);

      const result = await getAllPostsService();
      expect(result).toHaveLength(2);
    });
  });

  describe("deletePostService", () => {
    test("duhet të hedhë error nëse post nuk ekziston", async () => {
      getPostByIdRepo.mockResolvedValue(null);

      await expect(deletePostService(1, 99, "user")).rejects.toThrow();
    });

    test("duhet të hedhë error nëse user nuk është owner", async () => {
      getPostByIdRepo.mockResolvedValue({ id: 1, user_id: 2 });

      await expect(deletePostService(1, 1, "user")).rejects.toThrow();
    });
  });
});
