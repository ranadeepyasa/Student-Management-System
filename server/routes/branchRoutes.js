import express from 'express';
import { getBranches, createBranch } from '../controllers/branchesController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBranches);
router.post('/', authenticate, createBranch);

export default router;
