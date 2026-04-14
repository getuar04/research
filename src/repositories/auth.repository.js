import { pool } from "../db/postgres.js";

export const getUserByEmailRepo = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  return result.rows[0];
};

export const createAuthUserRepo = async (
  name,
  email,
  password,
  role = "user",
) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, is_verified)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, role, is_verified, created_at`,
    [name, email, password, role, false],
  );

  return result.rows[0];
};

export const markUserVerifiedRepo = async (email) => {
  const result = await pool.query(
    `UPDATE users
     SET is_verified = true
     WHERE email = $1
     RETURNING id, name, email, role, is_verified, created_at`,
    [email],
  );

  return result.rows[0];
};

export const updateUserPasswordRepo = async (email, hashedPassword) => {
  const result = await pool.query(
    `UPDATE users
     SET password = $1
     WHERE email = $2
     RETURNING id, name, email, role, is_verified, created_at`,
    [hashedPassword, email],
  );

  return result.rows[0];
};

export const getUserByIdWithPasswordRepo = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

  return result.rows[0];
};

export const updateProfileRepo = async (userId, name) => {
  const result = await pool.query(
    `UPDATE users
     SET name = $1
     WHERE id = $2
     RETURNING id, name, email, role, is_verified, created_at`,
    [name, userId],
  );

  return result.rows[0];
};

export const getUserByIdRepo = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

  return result.rows[0];
};

