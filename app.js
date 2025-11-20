// app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./data/database.js"; 
import authRoutes from "./routes/authRoutes.js";
import { errorMiddleware } from "./middlewares/error.js"; 

dotenv.config({ path: "./data/config.env" });

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

connectDB();

app.get("/", (req, res) => {
  res.send("Backend Api Nice working");
});

// Routes
app.use("/api/auth", authRoutes);

// Error Middleware
app.use(errorMiddleware);

export default app;
