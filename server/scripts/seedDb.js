import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_PASSWORD = process.env.DEMO_USER_PASSWORD || 'Password123!';

async function seed() {
  console.log('Seeding DevFlow database with 5-member team and initial workflows...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, salt);

  try {
    // 1. Insert 5 Team Roles
    const users = [
      {
        username: 'ranadeepyasa',
        email: 'ranadeepreddyyasa@gmail.com',
        name: 'Ranadeep Yasa',
        role: 'Admin / Team Leader',
        department: 'Branching Workflow & Code Review',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
        status: 'online',
      },
      {
        username: 'gdharan',
        email: 'dharan.g@academic.edu',
        name: 'G. Dharan',
        role: 'Frontend Developer',
        department: 'Git/GitHub Fundamentals & Repo Management',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
        status: 'online',
      },
      {
        username: 'chrishyant',
        email: 'rishyant.ch@academic.edu',
        name: 'CH. Rishyant',
        role: 'Backend Developer',
        department: 'Source Code Management & Commits',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
        status: 'online',
      },
      {
        username: 'babhinav',
        email: 'abhinav.b@academic.edu',
        name: 'B. Abhinav',
        role: 'QA / Testing Engineer',
        department: 'GitHub Issues & Bug Tracking',
        avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&h=120&fit=crop&crop=faces',
        status: 'online',
      },
      {
        username: 'pmuneswar',
        email: 'muneswar.p@academic.edu',
        name: 'P. Muneswar Reddy',
        role: 'Release Manager',
        department: 'Release Management & CI/CD Pipelines',
        avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=faces',
        status: 'online',
      },
    ];

    for (const u of users) {
      await pool.query(
        `INSERT INTO users (username, email, password_hash, name, role, department, avatar_url, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role), password_hash=VALUES(password_hash)`,
        [u.username, u.email, passwordHash, u.name, u.role, u.department, u.avatar_url, u.status]
      );
    }
    console.log('5 Team Member accounts created/updated.');

    // Fetch user IDs
    const [dbUsers] = await pool.query('SELECT id, role, name FROM users');
    const userMap = {};
    dbUsers.forEach((u) => {
      userMap[u.role] = u.id;
    });

    const adminId = userMap['Admin / Team Leader'];
    const frontendId = userMap['Frontend Developer'];
    const backendId = userMap['Backend Developer'];
    const qaId = userMap['QA / Testing Engineer'];
    const releaseMgrId = userMap['Release Manager'];

    // 2. Insert Default Project linked to the User's GitHub Repository
    const [projRes] = await pool.query(
      `INSERT INTO projects (name, slug, description, github_repo, github_owner, default_branch, primary_language, is_private, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE description=VALUES(description)`,
      [
        'GitHub Collaborative Engineering Platform',
        'devflow-platform',
        'Enterprise microservices demonstration showing industry GitHub source code, branches, PRs, and release workflows.',
        'Student-Management-System',
        'ranadeepyasa',
        'main',
        'JavaScript',
        false,
        adminId,
      ]
    );

    const [existingProjs] = await pool.query('SELECT id FROM projects WHERE slug = ?', ['devflow-platform']);
    const projectId = existingProjs[0].id;

    // 3. Project Members
    for (const u of dbUsers) {
      await pool.query(
        `INSERT INTO project_members (project_id, user_id, project_role)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE project_role=VALUES(project_role)`,
        [projectId, u.id, u.role]
      );
    }
    console.log('Project members configured.');

    // 4. Sample Tasks
    const tasks = [
      {
        title: 'Audit JWT token expiration and refresh handling',
        desc: 'Ensure seamless refresh tokens to prevent sporadic 401 disconnects during socket reconnections.',
        assigned: backendId,
        status: 'In Progress',
        priority: 'High',
      },
      {
        title: 'Fix login button event handling in Auth Modal',
        desc: 'Implement responsive error display and loading spinner states on credential submission.',
        assigned: frontendId,
        status: 'In Progress',
        priority: 'Critical',
      },
      {
        title: 'Run end-to-end regression test suite on multi-user laptop simulation',
        desc: 'Verify real-time notification sync across concurrent browser sessions.',
        assigned: qaId,
        status: 'Todo',
        priority: 'High',
      },
      {
        title: 'Prepare SemVer v1.1.0 release notes and deployment bundle',
        desc: 'Tag git commit, generate changelog, and attach release assets.',
        assigned: releaseMgrId,
        status: 'Todo',
        priority: 'Medium',
      },
    ];

    for (const t of tasks) {
      await pool.query(
        `INSERT INTO tasks (project_id, title, description, assigned_to, status, priority, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [projectId, t.title, t.desc, t.assigned, t.status, t.priority, adminId]
      );
    }

    // 5. Issues (Including the required sample issue)
    const issues = [
      {
        num: 101,
        title: 'Login button is not working.',
        desc: 'Users cannot log in after entering valid credentials. Form submission handler intermittently fails validation check.',
        priority: 'High',
        status: 'Open',
        labels: 'bug, authentication, ui',
        assigned: frontendId,
        created: qaId,
      },
      {
        num: 102,
        title: 'WebSocket heartbeat timer memory retention upon client close',
        desc: 'Under erratic client reconnects, the heartbeat timer is not being properly cleared, resulting in socket handle leaks.',
        priority: 'Critical',
        status: 'In Progress',
        labels: 'bug, websocket, performance',
        assigned: backendId,
        created: adminId,
      },
      {
        num: 103,
        title: 'Add automated SonarQube code quality gate to PR checks',
        desc: 'Enforce minimum 80% unit test coverage prior to merging feature branches into main.',
        priority: 'Medium',
        status: 'In Progress',
        labels: 'ci/cd, tooling',
        assigned: releaseMgrId,
        created: adminId,
      },
      {
        num: 104,
        title: 'Dark mode theme contrast fails WCAG 2.1 AA specifications',
        desc: 'Button borders and secondary typography in dark mode need higher contrast ratios.',
        priority: 'Low',
        status: 'Resolved',
        labels: 'ui/ux, accessibility',
        assigned: frontendId,
        created: qaId,
      },
    ];

    for (const iss of issues) {
      await pool.query(
        `INSERT INTO issues (project_id, issue_number, title, description, priority, status, labels, assigned_to, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title)`,
        [projectId, iss.num, iss.title, iss.desc, iss.priority, iss.status, iss.labels, iss.assigned, iss.created]
      );
    }
    console.log('Issues seeded with required sample issue "Login button is not working".');

    // 6. Branches
    const branches = [
      { name: 'main', isDef: true, isProt: true, sha: 'ef0ca60', msg: 'Initial commit', author: adminId },
      { name: 'develop', isDef: false, isProt: true, sha: '8b3c41a', msg: 'feat: setup multi-user websocket rooms', author: backendId },
      { name: 'feature/oauth2-login', isDef: false, isProt: false, sha: '2c9e781', msg: 'feat: add role-based JWT authentication', author: backendId },
      { name: 'fix/login-button-handler', isDef: false, isProt: false, sha: '4d1f890', msg: 'fix: validate login credentials and bind click event', author: frontendId },
    ];

    for (const b of branches) {
      await pool.query(
        `INSERT INTO branches (project_id, name, base_branch, is_default, is_protected, last_commit_sha, last_commit_message, author_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE last_commit_message=VALUES(last_commit_message)`,
        [projectId, b.name, 'main', b.isDef, b.isProt, b.sha, b.msg, b.author]
      );
    }

    // 7. Pull Requests
    const prs = [
      {
        num: 1,
        title: 'fix: resolve login button click handler and credentials validation (#101)',
        desc: 'Fixes #101 by binding correct form submit event listener, adding input debounce, and showing clear validation feedback.',
        src: 'fix/login-button-handler',
        tgt: 'main',
        author: frontendId,
        status: 'Open',
        add: 48,
        del: 12,
      },
      {
        num: 2,
        title: 'feat: integrate Socket.IO real-time team notifications and collaborative state',
        desc: 'Broadcasts task assignments, issue updates, and review approvals across connected client laptops.',
        src: 'develop',
        tgt: 'main',
        author: backendId,
        status: 'Approved',
        add: 184,
        del: 22,
      },
    ];

    for (const pr of prs) {
      await pool.query(
        `INSERT INTO pull_requests (project_id, pr_number, title, description, source_branch, target_branch, author_id, status, additions, deletions)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title)`,
        [projectId, pr.num, pr.title, pr.desc, pr.src, pr.tgt, pr.author, pr.status, pr.add, pr.del]
      );
    }

    // 8. Code Reviews
    const [dbPrs] = await pool.query('SELECT id, pr_number FROM pull_requests WHERE project_id = ?', [projectId]);
    const prMap = {};
    dbPrs.forEach((p) => {
      prMap[p.pr_number] = p.id;
    });

    if (prMap[2]) {
      await pool.query(
        `INSERT INTO code_reviews (pull_request_id, reviewer_id, verdict, summary, inline_comments_count)
         VALUES (?, ?, ?, ?, ?)`,
        [prMap[2], adminId, 'APPROVED', 'Architecture looks solid. Verified socket room isolation per project.', 2]
      );
    }

    if (prMap[1]) {
      await pool.query(
        `INSERT INTO code_reviews (pull_request_id, reviewer_id, verdict, summary, inline_comments_count)
         VALUES (?, ?, ?, ?, ?)`,
        [prMap[1], qaId, 'CHANGES_REQUESTED', 'Tested on Chromium and Firefox. Please ensure error banner dismisses on new typing input.', 1]
      );
    }

    // 9. Releases (v1.0, v1.1, v2.0 as required!)
    const releases = [
      {
        tag: 'v1.0.0',
        name: 'DevFlow v1.0.0 – Foundational Git Workflow Engine',
        desc: '### Core Architecture Milestone\n- Initial release demonstrating the 6 core Git & GitHub collaboration workflows.\n- Source Code Management, Bug Tracking, Branches, PRs, Code Reviews, and Releases.',
        draft: false,
        pre: false,
        by: releaseMgrId,
        downloads: 420,
      },
      {
        tag: 'v1.1.0',
        name: 'DevFlow v1.1.0 – Real-Time Multi-User Collaboration',
        desc: '### Features & Enhancements\n- MySQL database persistence.\n- Socket.IO live notifications for 5-laptop collaborative engineering.\n- Real GitHub REST API synchronization for repository statistics, commits, and branches.',
        draft: false,
        pre: false,
        by: releaseMgrId,
        downloads: 850,
      },
      {
        tag: 'v2.0.0',
        name: 'DevFlow v2.0.0 – Enterprise Governance & CI/CD Automation',
        desc: '### Future Architecture Preview\n- Strict branch protection policies.\n- Automated test runner simulation.\n- Multi-organization tenant isolation.',
        draft: true,
        pre: true,
        by: releaseMgrId,
        downloads: 0,
      },
    ];

    for (const rel of releases) {
      await pool.query(
        `INSERT INTO releases (project_id, tag_name, name, description, is_draft, is_prerelease, published_by, downloads_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [projectId, rel.tag, rel.name, rel.desc, rel.draft, rel.pre, rel.by, rel.downloads]
      );
    }

    // 10. Activity Logs
    const activities = [
      { user: adminId, act: 'commit', target: 'ranadeepyasa:main', desc: 'Initial commit (ef0ca60)' },
      { user: qaId, act: 'issue_created', target: 'Issue #101', desc: 'Login button is not working.' },
      { user: frontendId, act: 'branch_created', target: 'fix/login-button-handler', desc: 'Branched from main' },
      { user: frontendId, act: 'pr_opened', target: 'PR #1', desc: 'fix: resolve login button click handler' },
      { user: qaId, act: 'review_submitted', target: 'PR #1', desc: 'Requested changes on PR #1' },
      { user: releaseMgrId, act: 'release_published', target: 'v1.1.0', desc: 'DevFlow v1.1.0 – Real-Time Multi-User Collaboration' },
    ];

    for (const a of activities) {
      await pool.query(
        `INSERT INTO activity_logs (project_id, user_id, action_type, entity_type, target_name, description)
         VALUES (?, ?, ?, 'system', ?, ?)`,
        [projectId, a.user, a.act, a.target, a.desc]
      );
    }

    // 11. Notifications
    const notifs = [
      { user: frontendId, type: 'review', title: 'QA Engineer Alex Rivera reviewed PR #1', msg: 'Changes requested on login button fix.', url: '/code-reviews' },
      { user: frontendId, type: 'issue', title: 'Assigned to Issue #101', msg: 'You were assigned to: Login button is not working.', url: '/issues' },
      { user: adminId, type: 'pr', title: 'New PR opened by Kavita Patel', msg: 'PR #1 is ready for preliminary review.', url: '/pull-requests' },
      { user: releaseMgrId, type: 'release', title: 'Release v1.1.0 published', msg: 'v1.1.0 has been deployed to staging.', url: '/releases' },
    ];

    for (const n of notifs) {
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, message, link_url)
         VALUES (?, ?, ?, ?, ?)`,
        [n.user, n.type, n.title, n.message, n.url]
      );
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
