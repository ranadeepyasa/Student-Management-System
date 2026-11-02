# Source Code Management (SCM) & Version Control Standards

**Course Code:** 24TU05IT01 — Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project:** Student Management System  
**Lead Contributor:** CH. Rishyant (`24WU0102213`)  
**Workstream:** Source Code Management, Git Workflow & Commits  

---

## 1. SCM Core Principles in Enterprise Engineering

Source Code Management (SCM) is the discipline of managing changes to computer programs, documents, and digital assets. In modern high-velocity engineering environments, disciplined SCM prevents catastrophic code overwrites, enables parallel feature development across distributed teams, and maintains an immutable audit trail of system evolution.

### Key Tenets Applied in this Project:
1. **Single Source of Truth:** `main` represents the stable, production-ready integration branch.
2. **Atomic Commits:** Each commit represents a single logical unit of change with an explanatory conventional message.
3. **Clean Working Trees:** Unstaged, uncommitted, and transient files are never abandoned or committed.
4. **Secret Hygiene:** Environment variables (`.env`), private tokens, and local SQLite runtime journals (`*.sqlite-shm`, `*.sqlite-wal`) are strictly ignored via `.gitignore`.
5. **No Blind Rewriting:** History on shared branches is never force-pushed or rewritten without consensus.

---

## 2. Conventional Commit Standards

Every commit in this repository follows the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short imperative summary>

[optional detailed description explaining WHAT and WHY, not HOW]

[optional footer(s) referencing GitHub Issues]
```

### Recognized Commit Types:
- `feat`: A new user-facing feature or API endpoint (e.g., `feat(students): implement multi-parameter search API`).
- `fix`: A bug fix (e.g., `fix(auth): correct SQLite string literal comparison in login controller`).
- `docs`: Documentation-only additions or modifications (e.g., `docs(scm): add source code management manual`).
- `style`: Changes that do not affect code logic (e.g., UI redesign to orange and white theme).
- `refactor`: A code change that neither fixes a bug nor adds a feature (e.g., modularizing route controllers).
- `test`: Adding missing tests or correcting existing test suites.
- `chore`: Maintenance tasks, dependencies updates, and build tool configurations.

---

## 3. Directory Modularization & Architecture Governance

The application architecture follows separation of concerns:

1. **Frontend Presentation Layer (`src/`):**
   - Components are partitioned into `common/` (atomic design: Button, Modal, Badge), `dashboard/` (charts, stat feeds), and `layout/` (navigation bar, sidebar).
   - Business state is decoupled from rendering via `src/context/DevFlowContext.jsx`.
2. **Backend API Controller Layer (`server/`):**
   - Routing concerns (`server/routes/*.js`) are separated from business logic execution (`server/controllers/*.js`).
   - Database operations are abstracted behind a unified relational interface (`server/config/db.js`).
3. **Automated Verification Layer (`tests/`):**
   - Isolated integration and unit test suites running under Node.js native test runner with concurrency constraints (`--test-concurrency=1`).

---

## 4. Exclusion & Secret Guard Policies (`.gitignore`)

The `.gitignore` configuration guarantees that sensitive keys, node modules, and transient test database artifacts are never committed to GitHub:
- `node_modules/` (Dependencies)
- `dist/`, `build/` (Build output)
- `.env`, `.env.local`, `server/.env` (Credentials & Secrets)
- `*.sqlite`, `*.sqlite-wal`, `*.sqlite-shm` (Local database storage)
- `*.log`, `npm-debug.log*` (Execution logs)
