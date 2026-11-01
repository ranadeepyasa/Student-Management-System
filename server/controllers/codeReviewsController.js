import pool from '../config/db.js';
import { broadcastProjectEvent, sendUserNotification } from '../services/socketService.js';

export const getReviews = async (req, res, next) => {
  try {
    const { pullRequestId } = req.query;

    let query = `
      SELECT cr.*, 
        u.name as reviewer_name, u.avatar_url as reviewer_avatar, u.role as reviewer_role,
        pr.title as pr_title, pr.pr_number, pr.author_id, pr.source_branch, pr.target_branch,
        p.name as project_name
      FROM code_reviews cr
      JOIN pull_requests pr ON cr.pull_request_id = pr.id
      JOIN users u ON cr.reviewer_id = u.id
      JOIN projects p ON pr.project_id = p.id
    `;
    const params = [];

    if (pullRequestId) {
      query += ' WHERE cr.pull_request_id = ?';
      params.push(pullRequestId);
    }

    query += ' ORDER BY cr.id DESC';

    const [rows] = await pool.query(query, params);
    res.json({ success: true, reviews: rows });
  } catch (err) {
    next(err);
  }
};

export const submitReview = async (req, res, next) => {
  try {
    const { pull_request_id, verdict, summary, inline_comments_count = 0 } = req.body;
    if (!pull_request_id || !verdict || !summary) {
      return res.status(400).json({ error: 'Pull request ID, verdict (APPROVED / CHANGES_REQUESTED / COMMENTED), and summary are required' });
    }

    const [prRows] = await pool.query('SELECT * FROM pull_requests WHERE id = ?', [pull_request_id]);
    if (prRows.length === 0) {
      return res.status(404).json({ error: 'Pull request not found' });
    }
    const pr = prRows[0];

    const [result] = await pool.query(
      `INSERT INTO code_reviews (pull_request_id, reviewer_id, verdict, summary, inline_comments_count)
       VALUES (?, ?, ?, ?, ?)`,
      [pull_request_id, req.user?.id || 1, verdict, summary.trim(), inline_comments_count]
    );

    // Update PR status if Approved or Changes Requested
    if (verdict === 'APPROVED') {
      await pool.query('UPDATE pull_requests SET status = "Approved" WHERE id = ?', [pull_request_id]);
    } else if (verdict === 'CHANGES_REQUESTED') {
      await pool.query('UPDATE pull_requests SET status = "Changes Requested" WHERE id = ?', [pull_request_id]);
    }

    // Log Activity
    await pool.query(
      `INSERT INTO activity_logs (project_id, user_id, action_type, entity_type, entity_id, target_name, description)
       VALUES (?, ?, 'review_submitted', 'code_review', ?, ?, ?)`,
      [
        pr.project_id,
        req.user?.id || 1,
        result.insertId,
        `PR #${pr.pr_number}`,
        `${verdict}: "${summary.trim().substring(0, 80)}..." by ${req.user?.name || 'Reviewer'}`
      ]
    );

    // Send Notification to PR author
    if (pr.author_id && pr.author_id !== req.user?.id) {
      const notif = {
        userId: pr.author_id,
        type: 'review',
        title: `Code Review on PR #${pr.pr_number}`,
        message: `${req.user?.name || 'A team member'} submitted a review: ${verdict}`,
        linkUrl: '/code-reviews',
      };
      await pool.query(
        'INSERT INTO notifications (user_id, type, title, message, link_url) VALUES (?, ?, ?, ?, ?)',
        [pr.author_id, notif.type, notif.title, notif.message, notif.linkUrl]
      );
      sendUserNotification(pr.author_id, notif);
    }

    const [created] = await pool.query(
      `SELECT cr.*, u.name as reviewer_name, u.avatar_url as reviewer_avatar, u.role as reviewer_role
       FROM code_reviews cr JOIN users u ON cr.reviewer_id = u.id WHERE cr.id = ?`,
      [result.insertId]
    );

    broadcastProjectEvent(pr.project_id, 'review:new', created[0]);

    res.status(201).json({ success: true, review: created[0] });
  } catch (err) {
    next(err);
  }
};
