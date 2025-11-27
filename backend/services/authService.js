// backend/services/authService.js

import bcrypt from "bcrypt";
import pool from "../config/db.js";
import crypto from "crypto";

export const registerUser = async ({ name, username, email, password }) => {
  // Check if email already exists
  const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (emailCheck.rows.length > 0) {
    throw new Error("Email already registered");
  }

  // Check if username already exists
  const usernameCheck = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  if (usernameCheck.rows.length > 0) {
    throw new Error("Username already taken");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert new user into DB
  const result = await pool.query(
    `INSERT INTO users (name, username, email, password)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, username, email`,
    [name, username, email, hashedPassword]
  );

  return result.rows[0]; // Return the created user (without password)
};


export const loginUser = async ({ username, password }) => {
    // Find user by username
    const res = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  
    if (res.rows.length === 0) {
      throw new Error("User not found");
    }
  
    const user = res.rows[0];
  
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
  
    // Return user info without password
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    };
  };


  ///
  
export const createPasswordResetToken = async (email) => {
  // Find user by email
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])

  if (result.rows.length === 0) {
    throw new Error("No user found with that email address")
  }

  const user = result.rows[0]

  // Create password_reset_tokens table if it doesn't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(255) UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Generate secure random token
  const resetToken = crypto.randomBytes(32).toString("hex")

  // Token expires in 1 hour
  const expiresAt = new Date(Date.now() + 3600000)

  // Delete any existing tokens for this user
  await pool.query("DELETE FROM password_reset_tokens WHERE user_id = $1", [user.id])

  // Store token in database
  await pool.query("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)", [
    user.id,
    resetToken,
    expiresAt,
  ])

  console.log(`[Password Reset] Token created for ${email}`)

  return resetToken
}

export const resetUserPassword = async (token, newPassword) => {
  // Find valid token
  const result = await pool.query(
    `SELECT prt.*, u.id as user_id, u.email 
     FROM password_reset_tokens prt 
     JOIN users u ON prt.user_id = u.id 
     WHERE prt.token = $1 AND prt.expires_at > NOW()`,
    [token],
  )

  if (result.rows.length === 0) {
    throw new Error("Invalid or expired reset token")
  }

  const tokenData = result.rows[0]

  // Hash new password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  // Update user password
  await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, tokenData.user_id])

  // Delete used token
  await pool.query("DELETE FROM password_reset_tokens WHERE token = $1", [token])

  console.log(`[Password Reset] Password updated for user ${tokenData.email}`)

  return true
}