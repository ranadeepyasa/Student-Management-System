import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'devflow_super_secret_jwt_key_2026_academic';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [identifier.trim(), identifier.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Password incorrect.' });
    }

    // Update status to online upon login
    await pool.query("UPDATE users SET status = 'online' WHERE id = ?", [user.id]);

    const token = generateToken(user);
    const { password_hash, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

export const switchPersona = async (req, res, next) => {
  try {
    const { role, userId } = req.body;
    let query = 'SELECT * FROM users WHERE ';
    let params = [];

    if (userId) {
      query += 'id = ?';
      params.push(userId);
    } else if (role) {
      query += 'role = ?';
      params.push(role);
    } else {
      query += 'id = 1';
    }

    const [rows] = await pool.query(query, params);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Target persona not found' });
    }

    const user = rows[0];
    const token = generateToken(user);
    const { password_hash, ...safeUser } = user;

    res.json({
      success: true,
      message: `Simulating persona: ${user.name} (${user.role})`,
      token,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const { password_hash, ...safeUser } = req.user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email, name, role, department, avatar_url, status, created_at FROM users ORDER BY id ASC'
    );
    res.json({ success: true, users: rows });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['online', 'busy', 'offline'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, req.user.id]);
    res.json({ success: true, status });
  } catch (err) {
    next(err);
  }
};
