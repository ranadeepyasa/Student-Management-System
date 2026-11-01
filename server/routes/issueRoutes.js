import express from 'express';
import { getIssues, createIssue, updateIssue, deleteIssue, addComment } from '../controllers/issuesController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getIssues);
router.post('/', authenticate, createIssue);
router.put('/:id', authenticate, updateIssue);
router.delete('/:id', authenticate, deleteIssue);
router.post('/:id/comments', authenticate, addComment);

export default router;
