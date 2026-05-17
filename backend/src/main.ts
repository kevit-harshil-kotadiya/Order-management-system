import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { initializeSocket } from './config/socket.js';
import menuRoutes from './routes/menu.route.js';
import orderRoutes from './routes/orders.route.js';
import { seedMenuItems } from './controllers/menu.controller.js';
import { startStatusSimulation } from './controllers/order.controller.js';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const startServer = async (): Promise<void> => {
  await connectDB();
  await seedMenuItems();
  startStatusSimulation();

  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { app, httpServer };
