// backend/services/authService.js

import bcrypt from "bcrypt";
import pool from "../config/db.js";

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