import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let ioInstance = null;

export const initSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  ioInstance.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      // Allow guest socket connection for public dashboard updates, but flag unauthenticated
      socket.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devflow_super_secret_jwt_key_2026_academic');
      socket.user = decoded;
      return next();
    } catch (err) {
      console.warn('[Socket Auth] Invalid token provided:', err.message);
      socket.user = null;
      return next();
    }
  });

  ioInstance.on('connection', (socket) => {
    const username = socket.user?.username || 'Guest';
    console.log(`[Socket Connected] Socket ID: ${socket.id} | User: ${username}`);

    if (socket.user?.userId) {
      // Join user private room for personal notifications
      socket.join(`user:${socket.user.userId}`);
    }

    // Join project room
    socket.on('join:project', (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`[Socket] ${username} joined project:${projectId}`);
    });

    socket.on('leave:project', (projectId) => {
      socket.leave(`project:${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket Disconnected] Socket ID: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.IO not initialized');
  }
  return ioInstance;
};

export const broadcastProjectEvent = (projectId, eventName, data) => {
  if (!ioInstance) return;
  ioInstance.to(`project:${projectId}`).emit(eventName, data);
  // Also emit to global for dashboard subscribers
  ioInstance.emit(eventName, data);
};

export const sendUserNotification = (userId, notification) => {
  if (!ioInstance) return;
  ioInstance.to(`user:${userId}`).emit('notification:new', notification);
};
