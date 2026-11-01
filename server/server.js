import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { initSocket } from './services/socketService.js';
import pool from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Test Database Connection and start server
async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log('[DevFlow Server] Connected to MySQL database successfully.');
    connection.release();

    server.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  DevFlow Backend API Server running on port ${PORT}`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`  Socket.IO:    Ready for multi-user real-time sync`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('[DevFlow Server] Database connection error:', err.message);
    console.error('Please verify MySQL is running on port 3306 and devflow_db exists.');
    process.exit(1);
  }
}

startServer();
