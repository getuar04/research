import { pool } from "../db/postgres.js";

export const getAllUsersRepo = async () => {
  const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
  return result.rows;
};

export const getUserByIdRepo = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

export const createUserRepo = async (name, email) => {
  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email],
  );
  return result.rows[0];
};

export const updateUserRepo = async (id, name, email) => {
  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id],
  );
  return result.rows[0];
};

export const deleteUserRepo = async (id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};
