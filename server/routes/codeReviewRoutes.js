import express from 'express';
import { getReviews, submitReview } from '../controllers/codeReviewsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', authenticate, submitReview);

export default router;
