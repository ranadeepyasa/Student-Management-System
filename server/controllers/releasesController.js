import pool from '../config/db.js';
import { githubService } from '../services/githubService.js';
import { broadcastProjectEvent } from '../services/socketService.js';

export const getReleases = async (req, res, next) => {
  try {
    const { projectId = 1 } = req.query;

    const [dbReleases] = await pool.query(`
      SELECT r.*, u.name as publisher_name, u.avatar_url as publisher_avatar, p.name as project_name
      FROM releases r
      LEFT JOIN users u ON r.published_by = u.id
      LEFT JOIN projects p ON r.project_id = p.id
      WHERE r.project_id = ?
      ORDER BY r.id DESC
    `, [projectId]);

    const ghReleases = await githubService.getReleases();

    res.json({
      success: true,
      releases: dbReleases,
      githubReleases: ghReleases,
    });
  } catch (err) {
    next(err);
  }
};

export const createRelease = async (req, res, next) => {
  try {
    const { tag_name, name, description, is_draft = false, is_prerelease = false, project_id = 1 } = req.body;
    if (!tag_name || !name) {
      return res.status(400).json({ error: 'Tag name (e.g. v1.2.0) and release title are required' });
    }

    const cleanTag = tag_name.trim().startsWith('v') ? tag_name.trim() : `v${tag_name.trim()}`;

    let githubReleaseId = null;
    let isGitHubSynced = false;
    if (githubService.isConfigured()) {
      const ghResult = await githubService.createRelease(cleanTag, name.trim(), description || '');
      if (ghResult.success) {
        githubReleaseId = ghResult.githubId;
        isGitHubSynced = true;
      }
    }

    const [result] = await pool.query(
      `INSERT INTO releases (project_id, tag_name, name, description, is_draft, is_prerelease, published_by, github_release_id, is_github_synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [project_id, cleanTag, name.trim(), description || '', is_draft, is_prerelease, req.user?.id || 1, githubReleaseId, isGitHubSynced]
    );

    // Log Activity
    await pool.query(
      `INSERT INTO activity_logs (project_id, user_id, action_type, entity_type, entity_id, target_name, description)
       VALUES (?, ?, 'release_published', 'release', ?, ?, ?)`,
      [project_id, req.user?.id || 1, result.insertId, cleanTag, name.trim()]
    );

    const [created] = await pool.query(
      `SELECT r.*, u.name as publisher_name, u.avatar_url as publisher_avatar
       FROM releases r LEFT JOIN users u ON r.published_by = u.id WHERE r.id = ?`,
      [result.insertId]
    );

    broadcastProjectEvent(project_id, 'release:new', created[0]);

    res.status(201).json({ success: true, release: created[0] });
  } catch (err) {
    next(err);
  }
};
