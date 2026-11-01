import pool from '../config/db.js';
import { githubService } from '../services/githubService.js';
import { broadcastProjectEvent, sendUserNotification } from '../services/socketService.js';

export const getIssues = async (req, res, next) => {
  try {
    const { status, priority, search, projectId = 1 } = req.query;

    let query = `
      SELECT i.*, 
        u_assign.name as assignee_name, u_assign.avatar_url as assignee_avatar, u_assign.role as assignee_role,
        u_creator.name as creator_name,
        p.name as project_name,
        (SELECT COUNT(*) FROM issue_comments WHERE issue_id = i.id) as comments_count
      FROM issues i
      LEFT JOIN users u_assign ON i.assigned_to = u_assign.id
      LEFT JOIN users u_creator ON i.created_by = u_creator.id
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (projectId) {
      query += ' AND i.project_id = ?';
      params.push(projectId);
    }

    if (status && status !== 'all') {
      if (status === 'open') {
        query += ' AND i.status != "Closed"';
      } else if (status === 'closed') {
        query += ' AND i.status = "Closed"';
      } else {
        query += ' AND i.status = ?';
        params.push(status);
      }
    }

    if (priority && priority !== 'all') {
      query += ' AND i.priority = ?';
      params.push(priority);
    }

    if (search) {
      query += ' AND (i.title LIKE ? OR i.description LIKE ? OR i.labels LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY i.id DESC';

    const [rows] = await pool.query(query, params);
    res.json({ success: true, issues: rows });
  } catch (err) {
    next(err);
  }
};

export const createIssue = async (req, res, next) => {
  try {
    const { title, description, priority = 'Medium', labels = 'bug', assigned_to, project_id = 1 } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Issue title is required' });
    }

    // Determine next issue number
    const [[{ maxNum }]] = await pool.query('SELECT COALESCE(MAX(issue_number), 100) as maxNum FROM issues');
    const nextNum = maxNum + 1;

    // Optional sync to GitHub
    let githubIssueId = null;
    let isGitHubSynced = false;
    if (githubService.isConfigured()) {
      const ghResult = await githubService.createIssue(title.trim(), description || '', labels.split(',').map(s => s.trim()));
      if (ghResult.success) {
        githubIssueId = ghResult.githubId;
        isGitHubSynced = true;
      }
    }

    const [result] = await pool.query(
      `INSERT INTO issues (project_id, issue_number, title, description, priority, status, labels, assigned_to, created_by, github_issue_id, is_github_synced)
       VALUES (?, ?, ?, ?, ?, 'Open', ?, ?, ?, ?, ?)`,
      [project_id, nextNum, title.trim(), description || '', priority, labels, assigned_to || null, req.user?.id || 1, githubIssueId, isGitHubSynced]
    );

    const issueId = result.insertId;

    // Log Activity
    await pool.query(
      `INSERT INTO activity_logs (project_id, user_id, action_type, entity_type, entity_id, target_name, description)
       VALUES (?, ?, 'issue_created', 'issue', ?, ?, ?)`,
      [project_id, req.user?.id || 1, issueId, `Issue #${nextNum}`, title.trim()]
    );

    // Notify assigned user if specified
    if (assigned_to && assigned_to !== req.user?.id) {
      const notif = {
        userId: assigned_to,
        type: 'issue',
        title: `Assigned to Issue #${nextNum}`,
        message: `${req.user?.name || 'A team member'} assigned you to: "${title.trim()}"`,
        linkUrl: '/issues',
      };
      await pool.query(
        'INSERT INTO notifications (user_id, type, title, message, link_url) VALUES (?, ?, ?, ?, ?)',
        [assigned_to, notif.type, notif.title, notif.message, notif.linkUrl]
      );
      sendUserNotification(assigned_to, notif);
    }

    const [created] = await pool.query(
      `SELECT i.*, u.name as assignee_name, u.avatar_url as assignee_avatar
       FROM issues i LEFT JOIN users u ON i.assigned_to = u.id WHERE i.id = ?`,
      [issueId]
    );

    broadcastProjectEvent(project_id, 'issue:new', created[0]);

    res.status(201).json({ success: true, issue: created[0] });
  } catch (err) {
    next(err);
  }
};

export const updateIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, priority, title, description, assigned_to } = req.body;

    const [existing] = await pool.query('SELECT * FROM issues WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const current = existing[0];
    const newStatus = status !== undefined ? status : current.status;
    const newPriority = priority !== undefined ? priority : current.priority;
    const newTitle = title !== undefined ? title : current.title;
    const newDesc = description !== undefined ? description : current.description;
    const newAssigned = assigned_to !== undefined ? assigned_to : current.assigned_to;

    await pool.query(
      `UPDATE issues SET status = ?, priority = ?, title = ?, description = ?, assigned_to = ? WHERE id = ?`,
      [newStatus, newPriority, newTitle, newDesc, newAssigned, id]
    );

    // Log Activity if status changed
    if (newStatus !== current.status) {
      await pool.query(
        `INSERT INTO activity_logs (project_id, user_id, action_type, entity_type, entity_id, target_name, description)
         VALUES (?, ?, 'issue_updated', 'issue', ?, ?, ?)`,
        [current.project_id, req.user?.id || 1, id, `Issue #${current.issue_number}`, `Status changed from ${current.status} to ${newStatus}`]
      );
    }

    const [updated] = await pool.query(
      `SELECT i.*, u.name as assignee_name, u.avatar_url as assignee_avatar
       FROM issues i LEFT JOIN users u ON i.assigned_to = u.id WHERE i.id = ?`,
      [id]
    );

    broadcastProjectEvent(current.project_id, 'issue:updated', updated[0]);

    res.json({ success: true, issue: updated[0] });
  } catch (err) {
    next(err);
  }
};

export const deleteIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Only Admin can delete issues
    if (req.user?.role !== 'Admin / Team Leader') {
      return res.status(403).json({ error: 'Only the Admin / Team Leader can delete issue records' });
    }

    await pool.query('DELETE FROM issues WHERE id = ?', [id]);
    res.json({ success: true, message: `Issue ${id} removed` });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'Comment body required' });
    }

    const [result] = await pool.query(
      'INSERT INTO issue_comments (issue_id, user_id, comment) VALUES (?, ?, ?)',
      [id, req.user?.id || 1, comment.trim()]
    );

    const [newComment] = await pool.query(
      `SELECT c.*, u.name as author_name, u.avatar_url as author_avatar, u.role as author_role
       FROM issue_comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, comment: newComment[0] });
  } catch (err) {
    next(err);
  }
};
