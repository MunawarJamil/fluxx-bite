import express, { Request, Response } from 'express';
import cors from 'cors';
import connect_db from './config/db.js';
import dns from 'dns'
import authRoutes from './routes/auth.js';
import errorHandler from './middleware/error.js';
import cookieParser from 'cookie-parser';

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

app.use(cookieParser());
// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

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
        app.listen(PORT, () => {
            console.log(`[Auth Service]: Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('[Auth Service]: Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
