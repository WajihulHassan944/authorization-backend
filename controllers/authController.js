import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dbQuery } from "../data/dbQuery.js";

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const existing = await dbQuery(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert user
    await dbQuery(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashed]
    );

    return res.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await dbQuery(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (result.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change to true in production (https)
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};
