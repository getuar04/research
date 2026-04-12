import { Router } from "express";
import { getAllActivityLogs } from "../controllers/activityLog.controller.js";

const router = Router();

router.get("/", getAllActivityLogs);

export default router;
