import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import pullRequestRoutes from './routes/pullRequestRoutes.js';
import codeReviewRoutes from './routes/codeReviewRoutes.js';
import releaseRoutes from './routes/releaseRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for academic multi-laptop testing
  },
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: 'Too many requests from this IP, please try again later.' },
});
app.use('/api/', limiter);

// Logging & Parsing
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Student Management System & DevFlow API Server',
    version: '1.0.0',
    academicContext: {
      institution: 'Woxsen University',
      courseCode: '24TU05IT01',
      courseName: 'Industry Excellence Track',
      projectTitle: 'GitHub as an Industry Standard for Collaborative Software Development',
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Student Management System API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/reports', reportRoutes);

// DevFlow & GitHub Collaborative Development Routes
app.use('/api/projects', projectRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/pull-requests', pullRequestRoutes);
app.use('/api/code-reviews', codeReviewRoutes);
app.use('/api/releases', releaseRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/github', githubRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Central Error Handler
app.use(errorHandler);

export default app;
