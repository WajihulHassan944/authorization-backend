import jwt from "jsonwebtoken";
import { dbQuery } from "../data/dbQuery.js";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Login required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB
    const users = await dbQuery("SELECT id, email FROM users WHERE id = ?", [
      decoded.id,
    ]);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = users[0];
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
