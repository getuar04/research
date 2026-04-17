import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import activityLogRoutes from "./routes/activityLog.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

import passport from "./config/passport.js";

const app = express();

app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/activity-logs", activityLogRoutes);

app.use(errorMiddleware);

export default app;
