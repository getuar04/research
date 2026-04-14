import { z } from "zod";

export const createPostSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(2, "Title must be at least 2 characters long")
      .max(200, "Title must be at most 200 characters long"),
    content: z
      .string()
      .max(5000, "Content is too long")
      .optional()
      .or(z.literal("")),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(2, "Title must be at least 2 characters long")
      .max(200, "Title must be at most 200 characters long"),
    content: z
      .string()
      .max(5000, "Content is too long")
      .optional()
      .or(z.literal("")),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, "Valid post id is required"),
  }),
  query: z.object({}).optional(),
});

export const postIdParamSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().regex(/^\d+$/, "Valid post id is required"),
  }),
  query: z.object({}).optional(),
});
