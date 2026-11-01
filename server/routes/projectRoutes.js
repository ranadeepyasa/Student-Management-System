import express from 'express';
import { getProjects, getDashboardStats } from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/dashboard-stats', getDashboardStats);

export default router;
