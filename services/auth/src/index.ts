import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connect_db from './config/db.js';

import dns from 'dns'
import authRoutes from './routes/auth.js';
import errorHandler from './middleware/error.js';

dotenv.config();
if (process.env.DNS_SERVERS && process.env.NODE_ENV === 'development') {
    dns.setServers(process.env.DNS_SERVERS.split(','));
}



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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

// Start server
app.listen(PORT, () => {
    // Connect to Database
    connect_db();
    console.log(`Server is running on port ${PORT}`);
});
