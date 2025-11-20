import bcrypt from "bcrypt";
import { dbQuery } from "../data/dbQuery.js";
import { sendCookie } from "../utils/features.js";

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

    // ❗ USE sendCookie HERE
    sendCookie(user, res, "Login successful", 200);

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};
export const logout = (req, res) => {
  const nodeEnv = process.env.NODE_ENV?.toLowerCase(); // normalize
  const isDev = nodeEnv === "development";

  const sameSite = isDev ? "lax" : "none";
  const secure = isDev ? false : true;
  const currentToken = req.cookies?.token;

  console.log("=== Logout Debug Info ===");
  console.log("NODE_ENV:", nodeEnv);
  console.log("isDev:", isDev);
  console.log("SameSite:", sameSite);
  console.log("Secure:", secure);
  console.log("Current token cookie (if any):", currentToken);

  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite,
      secure,
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
      debug: {
        NODE_ENV: nodeEnv,
        sameSite,
        secure,
        receivedToken: currentToken,
      },
    });
};
