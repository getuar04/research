import { Router } from "express";
import { getAllActivityLogs } from "../infra/http/controllers/activityLog.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware("admin"), getAllActivityLogs);

export default router;
