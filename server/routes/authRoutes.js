import express from 'express';
import { login, switchPersona, getMe, getAllUsers, updateStatus } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/switch-persona', switchPersona);
router.get('/me', authenticate, getMe);
router.get('/users', getAllUsers);
router.put('/status', authenticate, updateStatus);

export default router;
