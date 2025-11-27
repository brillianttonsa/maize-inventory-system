// backend/controllers/authController.js

import jwt from "jsonwebtoken";
import { loginUser, registerUser,createPasswordResetToken, resetUserPassword } from "../services/authService.js";


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


/////

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      })
    }

    const resetToken = await createPasswordResetToken(email)

    // In production, send email with reset link
    // For now, we'll return the token for testing
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`

    console.log("\n========== PASSWORD RESET REQUEST ==========")
    console.log(`Email: ${email}`)
    console.log(`Reset Link: ${resetLink}`)
    console.log("===========================================\n")

    res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email (check console for now)",
      // Remove resetToken in production - only send via email
      resetToken: resetToken,
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      })
    }

    await resetUserPassword(token, password)

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}