import express from 'express';
import { getPullRequests, createPullRequest, updatePullRequestStatus } from '../controllers/pullRequestsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPullRequests);
router.post('/', authenticate, createPullRequest);
router.put('/:id/status', authenticate, updatePullRequestStatus);

export default router;
