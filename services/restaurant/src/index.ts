import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import config from "./config/index.js";
import prisma from "./config/prisma.js";
import errorHandler from "./middleware/error.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import restaurantRoutes from "./modules/restaurant/restaurant.routes.js";

const app = express();

// Global Rate Limiting
app.use(apiLimiter);
// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
}));

// Performance Middlewares
app.use(compression());

// Request Logging
if (config.env === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Body Parsers (with size limit to prevent DoS)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "up",
        service: "restaurant-service",
        timestamp: new Date().toISOString()
    });
});

// Root Route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Fluxx-Bite Restaurant Service API"
    });
});

// API Routes  
app.use("/api/v1/restaurant", restaurantRoutes);

// Error Handling Middleware
app.use(errorHandler);

const server = app.listen(config.port, () => {
    console.log(`[${config.env}] Restaurant service is running on port ${config.port}`);
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);

    server.close(async () => {
        console.log('HTTP server closed.');

        try {
            await prisma.$disconnect();
            console.log('Database connection closed.');
            process.exit(0);
        } catch (err) {
            console.error('Error during database disconnection:', err);
            process.exit(1);
        }
    });

    // Force shutdown after 10s if graceful fails
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;