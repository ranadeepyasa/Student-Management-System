import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.resolve(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let activeEngine = 'none';
let mysqlPool = null;
let sqliteDb = null;

// Determine preferred engine: if DB_ENGINE === 'mysql', try mysql; otherwise auto-detect
const preferredEngine = process.env.DB_ENGINE || 'auto';

async function initMysql() {
  try {
    const p = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'devflow_db',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000,
    });
    // Test connection with timeout
    const conn = await Promise.race([
      p.getConnection(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('MySQL connection timeout')), 2500))
    ]);
    conn.release();
    mysqlPool = p;
    activeEngine = 'mysql';
    console.log('[Database] Connected to MySQL successfully.');
    return true;
  } catch (err) {
    if (preferredEngine === 'mysql') {
      console.warn('[Database] MySQL connection failed:', err.message);
    }
    return false;
  }
}

async function initSqlite() {
  try {
    const { DatabaseSync } = await import('node:sqlite');
    const sqlitePath = process.env.SQLITE_PATH || path.join(dbDir, 'devflow.sqlite');
    sqliteDb = new DatabaseSync(sqlitePath);
    sqliteDb.exec('PRAGMA foreign_keys = ON;');
    sqliteDb.exec('PRAGMA journal_mode = WAL;');
    sqliteDb.exec('PRAGMA busy_timeout = 5000;');
    activeEngine = 'sqlite';
    console.log(`[Database] Initialized embedded SQLite database at: ${sqlitePath}`);
    bootstrapSqliteSchema();
    seedSqliteDefaults();
    return true;
  } catch (err) {
    console.error('[Database] Failed to initialize SQLite:', err.message);
    throw err;
  }
}

function bootstrapSqliteSchema() {
  if (!sqliteDb) return;
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      department TEXT DEFAULT 'Engineering',
      avatar_url TEXT DEFAULT NULL,
      status TEXT DEFAULT 'online',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL UNIQUE,
      head_of_department TEXT,
      email TEXT,
      phone TEXT,
      building TEXT,
      established_year INTEGER DEFAULT 2014,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      gender TEXT DEFAULT 'Prefer not to say',
      department_id INTEGER,
      department_name TEXT NOT NULL,
      course TEXT NOT NULL,
      year_of_study INTEGER NOT NULL DEFAULT 1,
      admission_date TEXT NOT NULL,
      gpa REAL DEFAULT 3.50,
      status TEXT DEFAULT 'Active',
      address TEXT,
      emergency_contact TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      github_repo TEXT NOT NULL DEFAULT 'Student-Management-System',
      github_owner TEXT NOT NULL DEFAULT 'ranadeepyasa',
      default_branch TEXT NOT NULL DEFAULT 'main',
      primary_language TEXT DEFAULT 'JavaScript',
      is_private INTEGER DEFAULT 0,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL DEFAULT 1,
      issue_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT DEFAULT 'Medium',
      status TEXT DEFAULT 'Open',
      labels TEXT DEFAULT 'enhancement',
      assigned_to INTEGER,
      created_by INTEGER,
      github_issue_id INTEGER DEFAULT NULL,
      is_github_synced INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS branches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL DEFAULT 1,
      name TEXT NOT NULL,
      base_branch TEXT DEFAULT 'main',
      is_default INTEGER DEFAULT 0,
      is_protected INTEGER DEFAULT 0,
      last_commit_sha TEXT,
      last_commit_message TEXT,
      author_id INTEGER,
      is_github_synced INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(project_id, name)
    );

    CREATE TABLE IF NOT EXISTS pull_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL DEFAULT 1,
      pr_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      source_branch TEXT NOT NULL,
      target_branch TEXT NOT NULL DEFAULT 'main',
      author_id INTEGER,
      status TEXT DEFAULT 'Open',
      additions INTEGER DEFAULT 0,
      deletions INTEGER DEFAULT 0,
      github_pr_id INTEGER DEFAULT NULL,
      is_github_synced INTEGER DEFAULT 0,
      merged_at DATETIME NULL DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS code_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pull_request_id INTEGER NOT NULL,
      reviewer_id INTEGER NOT NULL,
      verdict TEXT NOT NULL,
      summary TEXT NOT NULL,
      inline_comments_count INTEGER DEFAULT 0,
      github_review_id INTEGER DEFAULT NULL,
      is_github_synced INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pull_request_id) REFERENCES pull_requests(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS releases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL DEFAULT 1,
      tag_name TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      target_branch TEXT DEFAULT 'main',
      is_draft INTEGER DEFAULT 0,
      is_prerelease INTEGER DEFAULT 0,
      published_by INTEGER,
      downloads_count INTEGER DEFAULT 0,
      github_release_id INTEGER DEFAULT NULL,
      is_github_synced INTEGER DEFAULT 0,
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER DEFAULT 1,
      user_id INTEGER,
      action_type TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      target_name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT,
      link_url TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

function seedSqliteDefaults() {
  if (!sqliteDb) return;
  const countUsers = sqliteDb.prepare('SELECT COUNT(*) as c FROM users').get().c;
  if (countUsers === 0) {
    const salt = bcrypt.genSaltSync(10);
    const passHash = bcrypt.hashSync('Admin@Woxsen2026!', salt);

    const insertUser = sqliteDb.prepare(`
      INSERT INTO users (username, email, password_hash, name, role, department, avatar_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run('ranadeepyasa', 'ranadeepreddyyasa@gmail.com', passHash, 'Ranadeep Yasa', 'Admin / Team Leader', 'Engineering', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces', 'online');
    insertUser.run('dharan_g', 'dharan.g@woxsen.edu.in', passHash, 'G. Dharan', 'Frontend Developer', 'Documentation', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces', 'online');
    insertUser.run('rishyant_ch', 'rishyant.ch@woxsen.edu.in', passHash, 'CH. Rishyant', 'Backend Developer', 'Core Engineering', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces', 'online');
    insertUser.run('abhinav_b', 'abhinav.b@woxsen.edu.in', passHash, 'B. Abhinav', 'QA / Testing Engineer', 'Quality Assurance', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&h=120&fit=crop&crop=faces', 'online');
    insertUser.run('muneswar_p', 'muneswar.p@woxsen.edu.in', passHash, 'P. Muneswar Reddy', 'Release Manager', 'DevOps & Release', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=faces', 'online');
    insertUser.run('admin', 'admin@woxsen.edu.in', passHash, 'Academic Administrator', 'Admin / Team Leader', 'Administration', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=faces', 'online');
  }

  const countDepts = sqliteDb.prepare('SELECT COUNT(*) as c FROM departments').get().c;
  if (countDepts === 0) {
    const insertDept = sqliteDb.prepare(`
      INSERT INTO departments (code, name, head_of_department, email, phone, building, established_year)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertDept.run('CSE', 'Computer Science & Engineering', 'Dr. Hemachandran K', 'hod.cse@woxsen.edu.in', '+91 98765 43210', 'Academic Block A, 3rd Floor', 2014);
    insertDept.run('AIDS', 'Artificial Intelligence & Data Science', 'Dr. Raul Villamarin Rodriguez', 'hod.ai@woxsen.edu.in', '+91 98765 43211', 'Technology Center, 2nd Floor', 2018);
    insertDept.run('ECE', 'Electronics & Communication Engineering', 'Dr. B. Suresh', 'hod.ece@woxsen.edu.in', '+91 98765 43212', 'Engineering Hall B, 1st Floor', 2015);
    insertDept.run('MECH', 'Mechanical & Automation Engineering', 'Dr. P. Venkatesh', 'hod.mech@woxsen.edu.in', '+91 98765 43213', 'Robotics & Automation Complex', 2014);
    insertDept.run('MGMT', 'School of Business & Management', 'Dr. Rajesh Nair', 'hod.mgmt@woxsen.edu.in', '+91 98765 43214', 'Management Tower, 4th Floor', 2014);
  }

  const countStudents = sqliteDb.prepare('SELECT COUNT(*) as c FROM students').get().c;
  if (countStudents === 0) {
    const insertStudent = sqliteDb.prepare(`
      INSERT INTO students (student_id, first_name, last_name, email, phone, gender, department_id, department_name, course, year_of_study, admission_date, gpa, status, address, emergency_contact)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStudent.run('24WU0104081', 'Ranadeep Reddy', 'Yasa', 'ranadeep.yasa@woxsen.edu.in', '+91 94401 23456', 'Male', 1, 'Computer Science & Engineering', 'B.Tech Computer Science & Engineering', 3, '2024-08-01', 3.92, 'Active', 'Hyderabad, Telangana, India', '+91 98480 11223');
    insertStudent.run('24WU0102210', 'Dharan', 'G.', 'dharan.g@woxsen.edu.in', '+91 94401 23457', 'Male', 1, 'Computer Science & Engineering', 'B.Tech Computer Science & Engineering', 3, '2024-08-01', 3.85, 'Active', 'Secunderabad, Telangana, India', '+91 98480 11224');
    insertStudent.run('24WU0102213', 'Rishyant', 'CH.', 'rishyant.ch@woxsen.edu.in', '+91 94401 23458', 'Male', 2, 'Artificial Intelligence & Data Science', 'B.Tech AI & Data Science', 3, '2024-08-01', 3.88, 'Active', 'Warangal, Telangana, India', '+91 98480 11225');
    insertStudent.run('24WU0102224', 'Abhinav', 'B.', 'abhinav.b@woxsen.edu.in', '+91 94401 23459', 'Male', 1, 'Computer Science & Engineering', 'B.Tech Computer Science & Engineering', 3, '2024-08-01', 3.79, 'Active', 'Karimnagar, Telangana, India', '+91 98480 11226');
    insertStudent.run('24WU0101006', 'Muneswar Reddy', 'P.', 'muneswar.p@woxsen.edu.in', '+91 94401 23460', 'Male', 3, 'Electronics & Communication Engineering', 'B.Tech ECE', 3, '2024-08-01', 3.81, 'Active', 'Kurnool, Andhra Pradesh, India', '+91 98480 11227');
    insertStudent.run('STU-2026-001', 'Aanya', 'Sharma', 'aanya.sharma@woxsen.edu.in', '+91 98111 22334', 'Female', 2, 'Artificial Intelligence & Data Science', 'B.Tech AI & Data Science', 2, '2025-08-15', 3.95, 'Active', 'New Delhi, India', '+91 98111 99887');
    insertStudent.run('STU-2026-002', 'Rohan', 'Verma', 'rohan.verma@woxsen.edu.in', '+91 98222 33445', 'Male', 1, 'Computer Science & Engineering', 'B.Tech Computer Science & Engineering', 4, '2023-08-10', 3.65, 'Active', 'Mumbai, Maharashtra, India', '+91 98222 88776');
    insertStudent.run('STU-2026-003', 'Pooja', 'Iyer', 'pooja.iyer@woxsen.edu.in', '+91 98333 44556', 'Female', 4, 'Mechanical & Automation Engineering', 'B.Tech Mechanical Engineering', 1, '2026-08-20', 3.70, 'Active', 'Chennai, Tamil Nadu, India', '+91 98333 77665');
    insertStudent.run('STU-2026-004', 'Karthik', 'Nair', 'karthik.nair@woxsen.edu.in', '+91 98444 55667', 'Male', 5, 'School of Business & Management', 'BBA Data Analytics', 2, '2025-08-12', 3.55, 'Active', 'Kochi, Kerala, India', '+91 98444 66554');
    insertStudent.run('STU-2026-005', 'Sneha', 'Patel', 'sneha.patel@woxsen.edu.in', '+91 98555 66778', 'Female', 1, 'Computer Science & Engineering', 'B.Tech Computer Science & Engineering', 4, '2023-08-10', 3.40, 'Inactive', 'Ahmedabad, Gujarat, India', '+91 98555 55443');
    insertStudent.run('STU-2026-006', 'Aditya', 'Rao', 'aditya.rao@woxsen.edu.in', '+91 98666 77889', 'Male', 3, 'Electronics & Communication Engineering', 'B.Tech ECE', 3, '2024-08-01', 3.30, 'Suspended', 'Bengaluru, Karnataka, India', '+91 98666 44332');
    insertStudent.run('STU-2026-007', 'Meera', 'Kapoor', 'meera.kapoor@woxsen.edu.in', '+91 98777 88990', 'Female', 2, 'Artificial Intelligence & Data Science', 'B.Tech AI & Data Science', 4, '2022-08-01', 3.98, 'Graduated', 'Chandigarh, India', '+91 98777 33221');
  }

  const countProjects = sqliteDb.prepare('SELECT COUNT(*) as c FROM projects').get().c;
  if (countProjects === 0) {
    sqliteDb.prepare(`
      INSERT INTO projects (name, slug, description, github_repo, github_owner, default_branch, primary_language)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Student Management System',
      'student-management-system',
      'Full-Stack Academic Student Management System demonstrating industry-standard GitHub collaborative workflows.',
      'Student-Management-System',
      'ranadeepyasa',
      'main',
      'JavaScript'
    );
  }

  const countIssues = sqliteDb.prepare('SELECT COUNT(*) as c FROM issues').get().c;
  if (countIssues === 0) {
    const insertIssue = sqliteDb.prepare(`
      INSERT INTO issues (project_id, issue_number, title, description, priority, status, labels, assigned_to, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertIssue.run(1, 1, 'Implement secure admin authentication', 'Configure bcrypt password hashing and JWT token management for administrator login.', 'Critical', 'Closed', 'enhancement,security', 1, 1);
    insertIssue.run(1, 2, 'Implement student CRUD operations', 'Create complete create, read, update, delete endpoints and responsive frontend forms.', 'High', 'Closed', 'enhancement', 3, 1);
    insertIssue.run(1, 3, 'Add department management', 'Add department listing, creation, updates, and student count metrics with foreign key safety.', 'Medium', 'Closed', 'enhancement', 2, 1);
    insertIssue.run(1, 4, 'Add dashboard statistics and reports', 'Aggregate student distribution by department, academic year, status, and generate CSV reports.', 'Medium', 'Closed', 'enhancement', 1, 1);
    insertIssue.run(1, 5, 'Implement student search and filtering', 'Support full-text search by ID, name, email and multi-criteria filters for status and year.', 'High', 'Closed', 'enhancement', 2, 1);
    insertIssue.run(1, 6, 'Add automated application tests', 'Implement automated unit and integration tests for authentication, CRUD, and business logic.', 'High', 'Closed', 'testing', 4, 1);
    insertIssue.run(1, 7, 'Improve repository documentation', 'Author comprehensive engineering guides, architecture diagrams, and contribution logs.', 'Medium', 'Closed', 'documentation', 2, 1);
    insertIssue.run(1, 8, 'Add continuous integration using GitHub Actions', 'Configure .github/workflows/ci.yml to validate linting, builds, and automated tests on push and PR.', 'Critical', 'Closed', 'enhancement,ci-cd', 5, 1);
  }

  const countBranches = sqliteDb.prepare('SELECT COUNT(*) as c FROM branches').get().c;
  if (countBranches === 0) {
    const insertBranch = sqliteDb.prepare(`
      INSERT INTO branches (project_id, name, base_branch, is_default, is_protected, last_commit_sha, last_commit_message, author_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertBranch.run(1, 'main', 'main', 1, 1, '46235ff', 'fix(test): update test script to POSIX-compatible glob pattern', 1);
    insertBranch.run(1, 'feature/repository-documentation', 'main', 0, 0, '8badbc9', 'docs: add project introduction, architecture, team responsibilities, and license', 2);
    insertBranch.run(1, 'feature/source-code-management', 'main', 0, 0, 'caad9fc', 'test: refine architecture tests to validate baseline source structure', 3);
    insertBranch.run(1, 'feature/issues-and-bug-tracking', 'main', 0, 0, 'd35d029', 'test: make team contribution doc validation branch-safe across isolated PRs', 4);
    insertBranch.run(1, 'feature/pull-requests-and-code-review', 'main', 0, 0, '1a3d90e', 'feat: add pull request template, code review guidelines, and merge conflict demonstration', 1);
    insertBranch.run(1, 'feature/release-management', 'main', 0, 0, '81a6617', 'fix(test): use POSIX-compatible glob pattern for cross-platform CI runner', 5);
  }

  const countPRs = sqliteDb.prepare('SELECT COUNT(*) as c FROM pull_requests').get().c;
  if (countPRs === 0) {
    const insertPR = sqliteDb.prepare(`
      INSERT INTO pull_requests (project_id, pr_number, title, description, source_branch, target_branch, author_id, status, additions, deletions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertPR.run(1, 1, 'docs: comprehensive repository documentation & architecture', 'Establishes README, CONTRIBUTING, and team contribution rosters.', 'feature/repository-documentation', 'main', 2, 'Open', 501, 1);
    insertPR.run(1, 2, 'feat: baseline source code management & test infrastructure', 'Establishes clean directory structures and architectural tests.', 'feature/source-code-management', 'main', 3, 'Open', 155, 9);
    insertPR.run(1, 3, 'docs: issue tracking workflows and issue templates', 'Adds bug report and feature request issue templates with triage guidelines.', 'feature/issues-and-bug-tracking', 'main', 4, 'Open', 169, 2);
    insertPR.run(1, 4, 'feat: PR templates, review guidelines, and merge conflict guide', 'Demonstrates review checklists, approval protocols, and conflict resolution.', 'feature/pull-requests-and-code-review', 'main', 1, 'Open', 316, 0);
    insertPR.run(1, 5, 'ci: automated GitHub Actions workflow and v1.0.0 release', 'Configures CI runner with multi-job pipeline, CHANGELOG, and release notes.', 'feature/release-management', 'main', 5, 'Open', 225, 3);
  }

  const countReleases = sqliteDb.prepare('SELECT COUNT(*) as c FROM releases').get().c;
  if (countReleases === 0) {
    sqliteDb.prepare(`
      INSERT INTO releases (project_id, tag_name, name, description, target_branch, published_by, downloads_count)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      1,
      'v1.0.0',
      'v1.0.0 - Production Student Management System & GitHub Collaboration Suite',
      'First major stable academic release for Woxsen University Course 24TU05IT01.',
      'main',
      5,
      48
    );
  }
}

// Ensure database is initialized before export
await (async function setupDatabase() {
  if (preferredEngine === 'mysql') {
    const ok = await initMysql();
    if (!ok) {
      console.log('[Database] Falling back to SQLite adapter...');
      await initSqlite();
    }
  } else {
    // auto mode: try mysql first, fallback to sqlite
    const ok = await initMysql();
    if (!ok) {
      await initSqlite();
    }
  }
})();

// Unified query adapter
const pool = {
  getEngine: () => activeEngine,
  async query(sql, params = []) {
    if (activeEngine === 'mysql' && mysqlPool) {
      return await mysqlPool.query(sql, params);
    }

    if (activeEngine === 'sqlite' && sqliteDb) {
      // Clean query syntax for SQLite compatibility
      let cleanSql = sql.trim();
      // Replace MySQL NOW() with CURRENT_TIMESTAMP
      cleanSql = cleanSql.replace(/NOW\(\)/gi, 'CURRENT_TIMESTAMP');

      const isSelect = /^\s*(SELECT|PRAGMA|EXPLAIN)/i.test(cleanSql);

      try {
        const stmt = sqliteDb.prepare(cleanSql);
        if (isSelect) {
          const rows = stmt.all(...params);
          return [rows, []];
        } else {
          const result = stmt.run(...params);
          return [{
            insertId: Number(result.lastInsertRowid),
            affectedRows: result.changes,
            changedRows: result.changes,
          }, []];
        }
      } catch (err) {
        console.error(`[SQLite Error] on query "${cleanSql}":`, err.message);
        throw err;
      }
    }

    throw new Error('No active database engine available');
  },

  async getConnection() {
    if (activeEngine === 'mysql' && mysqlPool) {
      return await mysqlPool.getConnection();
    }
    // Mock connection for SQLite
    return {
      query: (sql, params) => pool.query(sql, params),
      release: () => {},
      beginTransaction: async () => pool.query('BEGIN TRANSACTION;'),
      commit: async () => pool.query('COMMIT;'),
      rollback: async () => pool.query('ROLLBACK;'),
    };
  },

  async end() {
    if (mysqlPool) await mysqlPool.end();
  }
};

export default pool;
