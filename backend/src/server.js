import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./lib/env.js";
import authRoutes from "./routes/auth.route.js";
import { initDB } from "../auth/config/db.js";

const app = express();
const PORT = ENV.PORT;

// Middleware
app.use(
  cors({
    origin: [ENV.FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "HumaNex Auth & Healthcare Backend",
    timestamp: new Date().toISOString(),
  });
});

// Mount Authentication & Authorization Routes
app.use("/api/auth", authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "An unexpected server error occurred.",
  });
});

app.listen(PORT, async () => {
  console.log(` HumaNex backend server is running on port ${PORT}`);
  console.log(` Frontend URL: ${ENV.FRONTEND_URL}`);
  
  // Initialize MySQL database table
  await initDB();
});

export default app;
