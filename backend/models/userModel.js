import pool from "../config/db.js";

// Get user by ID
export const findUserById = async (userId) => {
  const query = `SELECT id, username, email, password FROM users WHERE id = $1`;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

// Update password
export const updateUserPassword = async (userId, newHashedPassword) => {
  const query = `UPDATE users SET password = $1 WHERE id = $2`;
  await pool.query(query, [newHashedPassword, userId]);
  return true;
};
