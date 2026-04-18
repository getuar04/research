import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  getMyPosts,
} from "../infra/http/controllers/post.read.controller.js";
import {
  createPost,
  updatePost,
  deletePost,
} from "../infra/http/controllers/post.write.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createPostSchema,
  updatePostSchema,
  postIdParamSchema,
} from "../validators/post.validator.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/my-posts", authMiddleware, getMyPosts);
router.get("/:id", getPostById);

router.post("/", authMiddleware, validate(createPostSchema), createPost);
router.put("/:id", authMiddleware, validate(updatePostSchema), updatePost);
router.delete("/:id", authMiddleware, validate(postIdParamSchema), deletePost);

export default router;
