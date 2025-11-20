import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected example route
router.get("/me", isAuthenticated, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Logout
router.get("/logout", logout);

export default router;
