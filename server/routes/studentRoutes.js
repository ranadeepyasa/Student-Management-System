import express from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', authenticate, createStudent);
router.put('/:id', authenticate, updateStudent);
router.delete('/:id', authenticate, deleteStudent);

export default router;
