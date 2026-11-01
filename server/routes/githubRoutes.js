import express from 'express';
import { githubService } from '../services/githubService.js';

const router = express.Router();

router.get('/status', async (req, res, next) => {
  try {
    const coords = githubService.getRepoCoordinates();
    const info = await githubService.getRepositoryInfo();
    res.json({
      success: true,
      configured: coords.hasToken,
      owner: coords.owner,
      repo: coords.repo,
      repository: info,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/commits', async (req, res, next) => {
  try {
    const commits = await githubService.getCommits(parseInt(req.query.limit || '15', 10));
    res.json({ success: true, commits });
  } catch (err) {
    next(err);
  }
});

router.get('/branches', async (req, res, next) => {
  try {
    const branches = await githubService.getBranches();
    res.json({ success: true, branches });
  } catch (err) {
    next(err);
  }
});

export default router;
