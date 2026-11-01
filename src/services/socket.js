import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    const token = localStorage.getItem('devflow_auth_token');
    socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 5,
    });

    socketInstance.on('connect', () => {
      console.log('[DevFlow Socket] Connected to real-time collaboration server:', socketInstance.id);
      socketInstance.emit('join:project', 1);
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('[DevFlow Socket] Connection warning:', err.message);
    });
  }

  return socketInstance;
};

export const updateSocketAuth = (newToken) => {
  if (socketInstance) {
    socketInstance.auth = { token: newToken };
    socketInstance.disconnect().connect();
  }
};
