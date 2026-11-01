import pool from '../config/db.js';

export const getActivities = async (req, res, next) => {
  try {
    const { actionType, limit = 50, projectId = 1 } = req.query;

    let query = `
      SELECT a.*, u.name as user_name, u.avatar_url, u.role as user_role, p.name as project_name
      FROM activity_logs a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN projects p ON a.project_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (projectId) {
      query += ' AND (a.project_id = ? OR a.project_id IS NULL)';
      params.push(projectId);
    }

    if (actionType && actionType !== 'all') {
      query += ' AND a.action_type = ?';
      params.push(actionType);
    }

    query += ' ORDER BY a.id DESC LIMIT ?';
    params.push(parseInt(limit, 10));

    const [rows] = await pool.query(query, params);
    res.json({ success: true, activities: rows });
  } catch (err) {
    next(err);
  }
};
