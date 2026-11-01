import express from 'express';
import { getReleases, createRelease } from '../controllers/releasesController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getReleases);
router.post('/', authenticate, createRelease);

export default router;
