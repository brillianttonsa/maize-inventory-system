import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const updateProfile = async (userId, { name, email }) => {
  const result = await pool.query(
    `UPDATE users 
     SET name = $1, email = $2 
     WHERE id = $3 
     RETURNING id, name, email`,
    [name, email, userId]
  );

  return result.rows[0];
};

export const changePassword = async (userId, { oldPassword, newPassword }) => {
  const result = await pool.query(
    "SELECT password FROM users WHERE id=$1",
    [userId]
  );

  if (result.rows.length === 0) throw new Error("User not found");

  const valid = await bcrypt.compare(oldPassword, result.rows[0].password);
  if (!valid) throw new Error("Old password is incorrect");

  const hash = await bcrypt.hash(newPassword, 10);

  await pool.query(
    "UPDATE users SET password=$1 WHERE id=$2",
    [hash, userId]
  );

  return true;
};
