import express from 'express';
import { getActivities } from '../controllers/activitiesController.js';

const router = express.Router();

router.get('/', getActivities);

export default router;
