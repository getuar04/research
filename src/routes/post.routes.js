import { Router } from "express";
import {
  getAllPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createPostSchema,
  updatePostSchema,
  postIdParamSchema,
} from "../validators/post.validator.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/my-posts", authMiddleware, getMyPosts);
router.get("/:id", validate(postIdParamSchema), getPostById);

router.post("/", authMiddleware, validate(createPostSchema), createPost);
router.put("/:id", authMiddleware, validate(updatePostSchema), updatePost);
router.delete("/:id", authMiddleware, validate(postIdParamSchema), deletePost);

export default router;
