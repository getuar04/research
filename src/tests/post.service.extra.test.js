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

const { updatePostService, getMyPostsService, getPostByIdService } =
  await import("../services/post.service.js");

const { getPostByIdRepo, updatePostRepo, getMyPostsRepo } =
  await import("../repositories/post.repository.js");

const { publishPostEvent } = await import("../kafka/producer.js");

describe("Post Service - Extra Tests", () => {
  describe("getPostByIdService", () => {
    test("duhet të kthejë post me sukses", async () => {
      getPostByIdRepo.mockResolvedValue({
        id: 1,
        title: "Test Post",
        content: "Test Content",
        user_id: 1,
      });

      const result = await getPostByIdService(1);
      expect(result.id).toBe(1);
      expect(result.title).toBe("Test Post");
    });

    test("duhet të hedhë error nëse post nuk ekziston", async () => {
      getPostByIdRepo.mockResolvedValue(null);
      await expect(getPostByIdService(99)).rejects.toThrow();
    });
  });

  describe("getMyPostsService", () => {
    test("duhet të kthejë postet e userit", async () => {
      getMyPostsRepo.mockResolvedValue([
        { id: 1, title: "My Post", user_id: 1 },
      ]);

      const result = await getMyPostsService(1);
      expect(result).toHaveLength(1);
    });
  });

  describe("updatePostService", () => {
    test("duhet të përditësojë post me sukses si owner", async () => {
      getPostByIdRepo.mockResolvedValue({ id: 1, user_id: 1 });
      updatePostRepo.mockResolvedValue({
        id: 1,
        title: "Updated Title",
        content: "Updated Content",
      });
      publishPostEvent.mockResolvedValue();

      const result = await updatePostService(
        1,
        "Updated Title",
        "Updated Content",
        1,
        "user",
      );
      expect(result.title).toBe("Updated Title");
    });

    test("duhet të hedhë error nëse post nuk ekziston", async () => {
      getPostByIdRepo.mockResolvedValue(null);
      await expect(
        updatePostService(99, "Title", "Content", 1, "user"),
      ).rejects.toThrow();
    });

    test("duhet të hedhë error nëse user nuk është owner", async () => {
      getPostByIdRepo.mockResolvedValue({ id: 1, user_id: 2 });
      await expect(
        updatePostService(1, "Title", "Content", 1, "user"),
      ).rejects.toThrow();
    });

    test("duhet të lejojë admin të përditësojë çdo post", async () => {
      getPostByIdRepo.mockResolvedValue({ id: 1, user_id: 2 });
      updatePostRepo.mockResolvedValue({
        id: 1,
        title: "Admin Updated",
        content: "Content",
      });
      publishPostEvent.mockResolvedValue();

      const result = await updatePostService(
        1,
        "Admin Updated",
        "Content",
        1,
        "admin",
      );
      expect(result.title).toBe("Admin Updated");
    });
  });
});
