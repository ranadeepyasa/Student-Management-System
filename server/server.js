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
    const engine = typeof pool.getEngine === 'function' ? pool.getEngine() : 'database';
    console.log(`[DevFlow Server] Connected to ${engine.toUpperCase()} database successfully.`);
    connection.release();

    server.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  Student Management System & DevFlow API Server`);
      console.log(`  Port:         ${PORT}`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`  Students API: http://localhost:${PORT}/api/students`);
      console.log(`  Depts API:    http://localhost:${PORT}/api/departments`);
      console.log(`  Reports API:  http://localhost:${PORT}/api/reports`);
      console.log(`  Engine:       ${engine.toUpperCase()}`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('[DevFlow Server] Database connection error:', err.message);
    process.exit(1);
  }
}

startServer();
