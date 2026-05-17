import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: Server;

export const initializeSocket = (httpServer: HTTPServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-order', (orderId: string) => {
      socket.join(`order:${orderId}`);
      console.log(`Socket ${socket.id} joined order:${orderId}`);
    });

    socket.on('leave-order', (orderId: string) => {
      socket.leave(`order:${orderId}`);
      console.log(`Socket ${socket.id} left order:${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
};
