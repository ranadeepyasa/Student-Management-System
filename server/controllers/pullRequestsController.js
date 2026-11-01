import pool from '../config/db.js';
import { githubService } from '../services/githubService.js';
import { broadcastProjectEvent, sendUserNotification } from '../services/socketService.js';

export const getPullRequests = async (req, res, next) => {
  try {
    const { status, projectId = 1 } = req.query;

    let query = `
      SELECT pr.*, u.name as author_name, u.avatar_url as author_avatar, u.role as author_role,
        (SELECT COUNT(*) FROM code_reviews WHERE pull_request_id = pr.id) as reviews_count,
        (SELECT verdict FROM code_reviews WHERE pull_request_id = pr.id ORDER BY id DESC LIMIT 1) as latest_verdict
      FROM pull_requests pr
      LEFT JOIN users u ON pr.author_id = u.id
      WHERE pr.project_id = ?
    `;
    const params = [projectId];

    if (status && status !== 'all') {
      query += ' AND pr.status = ?';
      params.push(status);
    }

    query += ' ORDER BY pr.id DESC';

    const [rows] = await pool.query(query, params);

    // Also get GitHub remote pull requests for comparison
    const ghPrs = await githubService.getPullRequests();

    res.json({
      success: true,
      pullRequests: rows,
      githubPullRequests: ghPrs,
    });
  } catch (err) {
    next(err);
  }
};

export const createPullRequest = async (req, res, next) => {
  try {
    const { title, description, source_branch, target_branch = 'main', project_id = 1 } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Pull request title is required' });
    }
    if (source_branch === target_branch) {
      return res.status(400).json({ error: 'Source and target branches cannot be identical' });
    }

    const [[{ maxNum }]] = await pool.query('SELECT COALESCE(MAX(pr_number), 0) as maxNum FROM pull_requests');
    const nextNum = maxNum + 1;

    let githubPrId = null;
    let isGitHubSynced = false;
    if (githubService.isConfigured()) {
      const ghResult = await githubService.createPullRequest(title.trim(), description || '', source_branch, target_branch);
      if (ghResult.success) {
        githubPrId = ghResult.githubId;
        isGitHubSynced = true;
      }
    }

    const additions = Math.floor(Math.random() * 80) + 15;
    const deletions = Math.floor(Math.random() * 25) + 3;

    const [result] = await pool.query(
      `INSERT INTO pull_requests (project_id, pr_number, title, description, source_branch, target_branch, author_id, status, additions, deletions, github_pr_id, is_github_synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Open', ?, ?, ?, ?)`,
      [project_id, nextNum, title.trim(), description || '', source_branch, target_branch, req.user?.id || 1, additions, deletions, githubPrId, isGitHubSynced]
    );

    // Log Activity
    await pool.query(
      `INSERT INTO activity_logs (project_id, user_id, action_type, entity_type, entity_id, target_name, description)
       VALUES (?, ?, 'pr_opened', 'pull_request', ?, ?, ?)`,
      [project_id, req.user?.id || 1, result.insertId, `PR #${nextNum}`, title.trim()]
    );

    const [created] = await pool.query(
      `SELECT pr.*, u.name as author_name, u.avatar_url as author_avatar
       FROM pull_requests pr LEFT JOIN users u ON pr.author_id = u.id WHERE pr.id = ?`,
      [result.insertId]
    );

    broadcastProjectEvent(project_id, 'pr:new', created[0]);

    res.status(201).json({ success: true, pullRequest: created[0] });
  } catch (err) {
    next(err);
  }
};

export const updatePullRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved', 'Changes Requested', 'Merged', 'Closed'

    const [existing] = await pool.query('SELECT * FROM pull_requests WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Pull request not found' });
    }

    const pr = existing[0];
    const isMerging = status === 'Merged';

    await pool.query(
      `UPDATE pull_requests SET status = ?, merged_at = ? WHERE id = ?`,
      [status, isMerging ? new Date() : null, id]
    );

    // Log Activity
    await pool.query(
      `INSERT INTO activity_logs (project_id, user_id, action_type, entity_type, entity_id, target_name, description)
       VALUES (?, ?, ?, 'pull_request', ?, ?, ?)`,
      [
        pr.project_id,
        req.user?.id || 1,
        isMerging ? 'pr_merged' : 'pr_status_changed',
        id,
        `PR #${pr.pr_number}`,
        `Marked as ${status} by ${req.user?.name || 'Reviewer'}`
      ]
    );

    const [updated] = await pool.query(
      `SELECT pr.*, u.name as author_name, u.avatar_url as author_avatar
       FROM pull_requests pr LEFT JOIN users u ON pr.author_id = u.id WHERE pr.id = ?`,
      [id]
    );

    broadcastProjectEvent(pr.project_id, 'pr:updated', updated[0]);

    res.json({ success: true, pullRequest: updated[0] });
  } catch (err) {
    next(err);
  }
};
