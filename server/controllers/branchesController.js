import pool from '../config/db.js';
import { githubService } from '../services/githubService.js';
import { broadcastProjectEvent } from '../services/socketService.js';

export const getBranches = async (req, res, next) => {
  try {
    const { projectId = 1 } = req.query;

    const [dbBranches] = await pool.query(`
      SELECT b.*, u.name as author_name,
        (SELECT COUNT(*) FROM pull_requests WHERE source_branch = b.name AND status = 'Open') as associated_open_prs
      FROM branches b
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.project_id = ?
      ORDER BY b.is_default DESC, b.is_protected DESC, b.id ASC
    `, [projectId]);

    // Query live branches from GitHub repository
    const ghBranches = await githubService.getBranches();

    // Map and flag GitHub sync status
    const ghBranchNames = new Set(ghBranches.map(b => b.name));

    const enriched = dbBranches.map(b => ({
      ...b,
      is_on_github: ghBranchNames.has(b.name),
    }));

    res.json({
      success: true,
      branches: enriched,
      githubBranches: ghBranches,
      isGitHubConfigured: githubService.isConfigured(),
    });
  } catch (err) {
    next(err);
  }
};

export const createBranch = async (req, res, next) => {
  try {
    const { name, base_branch = 'main', project_id = 1 } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Branch name is required' });
    }

    const cleanName = name.trim().replace(/\s+/g, '-');

    // Check duplicate
    const [existing] = await pool.query(
      'SELECT id FROM branches WHERE project_id = ? AND name = ?',
      [project_id, cleanName]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: `Branch '${cleanName}' already exists in this project` });
    }

    // Sync to GitHub if token available
    let isGitHubSynced = false;
    let commitSha = Math.random().toString(16).substring(2, 9);

    if (githubService.isConfigured()) {
      const ghResult = await githubService.createBranch(cleanName, base_branch);
      if (ghResult.success) {
        isGitHubSynced = true;
        if (ghResult.sha) commitSha = ghResult.sha.substring(0, 7);
      }
    }

    const [result] = await pool.query(
      `INSERT INTO branches (project_id, name, base_branch, is_default, is_protected, last_commit_sha, last_commit_message, author_id, is_github_synced)
       VALUES (?, ?, ?, FALSE, FALSE, ?, ?, ?, ?)`,
      [project_id, cleanName, base_branch, commitSha, `Initialize branch ${cleanName}`, req.user?.id || 1, isGitHubSynced]
    );

    // Log Activity
    await pool.query(
      `INSERT INTO activity_logs (project_id, user_id, action_type, entity_type, entity_id, target_name, description)
       VALUES (?, ?, 'branch_created', 'branch', ?, ?, ?)`,
      [project_id, req.user?.id || 1, result.insertId, cleanName, `Branched from ${base_branch}`]
    );

    const [newBranch] = await pool.query(
      `SELECT b.*, u.name as author_name FROM branches b LEFT JOIN users u ON b.author_id = u.id WHERE b.id = ?`,
      [result.insertId]
    );

    broadcastProjectEvent(project_id, 'branch:new', newBranch[0]);

    res.status(201).json({ success: true, branch: newBranch[0] });
  } catch (err) {
    next(err);
  }
};
