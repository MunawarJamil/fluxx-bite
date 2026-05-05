import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import connect_db from './config/db.js';
import dns from 'dns';
import authRoutes from './routes/auth.js';
import errorHandler from './middleware/error.js';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middleware/rateLimiter.js';

import dotenv from 'dotenv';
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}
if (process.env.DNS_SERVERS && process.env.NODE_ENV === 'development') {
    dns.setServers(process.env.DNS_SERVERS.split(','));
}
const app = express();


console.log("ENV CHECK:", {
    mongo: !!process.env.MONGO_URI,
    jwt: !!process.env.JWT_ACCESS_SECRET,
});

// ✅ Global error handlers (IMPORTANT)
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION:", err);
});
const PORT = process.env.PORT || 5000;

// Global Rate Limiting
app.use(apiLimiter);

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Performance Middlewares
app.use(compression());

// Request Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Body Parsers (with size limit to prevent DoS)
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Auth Service is running' });
});

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mount routers
app.use('/api/v1/auth', authRoutes);

// Error Handler Middleware (Should be last)
app.use(errorHandler);

// Startup sequence
const startServer = async () => {
    try {
        // 1. Connect to Database FIRST
        await connect_db();

        // 2. Start listening ONLY after DB is ready
        const server = app.listen(PORT, () => {
            console.log(`[Auth Service]: Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });

        // Graceful Shutdown
        const shutdown = async (signal: string) => {
            console.log(`\n${signal} received. Shutting down gracefully...`);

            server.close(async () => {
                console.log('[Auth Service]: HTTP server closed.');
                // Mongoose disconnects via the process exit — connect_db handles its own lifecycle
                process.exit(0);
            });

            // Force shutdown after 10s if graceful fails
            setTimeout(() => {
                console.error('[Auth Service]: Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        console.error('[Auth Service]: Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
