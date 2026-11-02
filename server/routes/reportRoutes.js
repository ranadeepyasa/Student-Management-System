import express from 'express';
import {
  getStudentDashboardStats,
  getDepartmentReport,
  getYearReport,
  exportStudentsCsv,
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/dashboard-stats', getStudentDashboardStats);
router.get('/departments', getDepartmentReport);
router.get('/years', getYearReport);
router.get('/export/students.csv', exportStudentsCsv);

export default router;
