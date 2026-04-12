import { pool } from "../db/postgres.js";

export const getAllPostsRepo = async () => {
  const result = await pool.query(`
    SELECT
      posts.id,
      posts.title,
      posts.content,
      posts.user_id,
      posts.created_at,
      users.name AS user_name,
      users.email AS user_email
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.id ASC
  `);

  return result.rows;
};

export const getPostByIdRepo = async (id) => {
  const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
  return result.rows[0];
};

export const createPostRepo = async (title, content, userId) => {
  const result = await pool.query(
    "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, content, userId],
  );
  return result.rows[0];
};

export const updatePostRepo = async (id, title, content, userId) => {
  const result = await pool.query(
    "UPDATE posts SET title = $1, content = $2, user_id = $3 WHERE id = $4 RETURNING *",
    [title, content, userId, id],
  );
  return result.rows[0];
};

export const deletePostRepo = async (id) => {
  const result = await pool.query(
    "DELETE FROM posts WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};
