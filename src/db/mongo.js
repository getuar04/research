import mongoose from "mongoose";
import { env } from "../config/env.js";

export const connectMongo = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
