import express from 'express';
import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);
router.post('/', authenticate, createDepartment);
router.put('/:id', authenticate, updateDepartment);
router.delete('/:id', authenticate, deleteDepartment);

export default router;
