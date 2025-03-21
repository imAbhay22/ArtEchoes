import express from "express";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

const router = express.Router();
dotenv.config(); // load .env file

// Helper function to ensure email has a domain
const ensureGmailDomain = (email) => {
  // If email doesn't contain "@", append "@gmail.com"
  if (!email.includes("@")) {
    return email + "@gmail.com";
  }
  return email;
};

// Signup
router.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // Automatically append "@gmail.com" if needed
    email = ensureGmailDomain(email);

    // Check for existing username and email
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors).map((val) => val.message),
      });
    }
    return res.status(500).json({ message: "Server error" });
  }
});

// Login route supporting login by email or username
router.post("/login", async (req, res) => {
  try {
    let { email, username, password } = req.body;
    let user;

    if (email) {
      email = ensureGmailDomain(email);
      user = await User.findOne({ email });
    } else if (username) {
      user = await User.findOne({ username });
    } else {
      return res
        .status(400)
        .json({ message: "Please provide an email or username" });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      token,
      email: user.email,
      userId: user._id,
      username: user.username,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// POST /api/auth/forgot-password remains unchanged
router.post("/forgot-password", async (req, res) => {
  let { email } = req.body;
  email = ensureGmailDomain(email); // Ensure email is correctly formatted
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with that email doesn't exist." });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset - ArtEchoes",
      text: `Hi there,\n\nYou requested a password reset. Please click on the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email." });
      }
      return res.json({
        message: "Password reset email sent. Please check your inbox.",
      });
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

// POST /api/auth/reset-password remains unchanged
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid token or user does not exist." });
    }
    user.password = newPassword;
    await user.save();
    return res.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Invalid or expired token." });
  }
});

export default router;
