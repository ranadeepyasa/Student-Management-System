import express from 'express';
import { getNotifications, markRead, markAllRead } from '../controllers/notificationsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getNotifications);
router.put('/:id/read', authenticate, markRead);
router.put('/read-all', authenticate, markAllRead);

export default router;
