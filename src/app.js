import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

export default app;
