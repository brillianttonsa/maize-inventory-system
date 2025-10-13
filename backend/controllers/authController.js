// backend/controllers/authController.js

import jwt from "jsonwebtoken";
import { loginUser, registerUser } from "../services/authService.js";


export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!username || !password || !email || !name) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    

    const newUser = await registerUser({ name, username, email, password });

    return res.status(201).json({ 
      success: true, 
      message: "User registered successfully", 
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await loginUser({ username, password });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
