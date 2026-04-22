import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// --- Middlewares ---
// Set security HTTP headers
app.use(helmet());
// Enable CORS for all routes
app.use(cors());
// HTTP request logging
app.use(morgan("dev"));
// Parse JSON bodies payload
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// --- Application Routes ---
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ 
    status: "success", 
    message: "Utils service is healthy and running" 
  });
});

// --- 404 Route Handler ---
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "error",
    message: `Cannot find ${req.originalUrl} on this server.`,
  });
});

// --- Global Error Handler ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error 💥:", err);
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

// --- Server Initialization ---
const server = app.listen(PORT, () => {
  console.log(`🚀 Utils Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// --- Graceful Shutdown Management ---
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated.");
  });
});
