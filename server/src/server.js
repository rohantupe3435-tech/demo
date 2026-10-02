import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: "*",
    credentials: true
  })
);

// Body parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "mini-ecommerce-server",
    version: "1.0.0"
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Mini E-Commerce REST API is running. Check /api/health or /docs for details.");
});

// Centralized 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Express] Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

export default app;
