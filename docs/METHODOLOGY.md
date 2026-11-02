# Engineering Methodology & Development Lifecycle

**Course Code:** 24TU05IT01  
**Course Title:** Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project Title:** GitHub as an Industry Standard for Collaborative Software Development  

---

## 1. Collaborative Engineering Framework

To emulate modern software engineering organizations, the team adopted an **Agile-Scrum hybrid framework** coupled with a **GitHub Flow / Trunk-Based Integration model**. Development was organized into structured sprints corresponding to project phases, with strict code quality gates, automated CI checks, and peer reviews required before integration into the primary integration branch (`main`).

```
                    AGILE SPRINT LIFECYCLE ON GITHUB
  +-----------------------------------------------------------------+
  | 1. Issue Triage & Backlog Refinement (GitHub Issues & YAML)     |
  +-------------------------------+---------------------------------+
                                  |
                                  v
  +-----------------------------------------------------------------+
  | 2. Feature Workstream Isolation (Dedicated Git Feature Branch)  |
  +-------------------------------+---------------------------------+
                                  |
                                  v
  +-----------------------------------------------------------------+
  | 3. Local Development, Unit Testing & Conventional Commits       |
  +-------------------------------+---------------------------------+
                                  |
                                  v
  +-----------------------------------------------------------------+
  | 4. Pull Request Submission & Automated CI Validation            |
  +-------------------------------+---------------------------------+
                                  |
                                  v
  +-----------------------------------------------------------------+
  | 5. Peer Code Review, Line Comments & Quality Checklist Sign-off|
  +-------------------------------+---------------------------------+
                                  |
                                  v
  +-----------------------------------------------------------------+
  | 6. Fast-Forward / Rebase Integration to main & Tagged Release   |
  +-----------------------------------------------------------------+
```

---

## 2. Sprint Breakdown & Milestones

### Sprint 1: Repository Audit & Infrastructure (Phase 1 & 5)
- **Focus:** Complete repository audit, technology stack detection, dependency baseline, and feature-branch structure establishment.
- **Milestone:** `docs/PROJECT_AUDIT.md`, `tests/architecture.test.js`, and branch creation.

### Sprint 2: Core Domain Modeling & Persistence (Phase 2 & 3)
- **Focus:** Schema design for Students, Departments, and Users. Dual-engine persistence adapter supporting MySQL 8.x and native Node.js SQLite (`node:sqlite`).
- **Milestone:** Relational tables, foreign key constraints, and default database seeding.

### Sprint 3: REST API & Client-Side Modules (Phase 2)
- **Focus:** Express controllers and routes for student CRUD, department management, academic reporting, and JWT admin authentication. React 18 UI with Tailwind CSS and Recharts.
- **Milestone:** `StudentsPage`, `StudentDetailPage`, `DepartmentsPage`, `ReportsPage`, and `DashboardPage`.

### Sprint 4: Quality Assurance & Test-Driven Verification (Phase 4)
- **Focus:** Automated unit and integration testing suite utilizing Node.js test runner (`node:test`).
- **Milestone:** 31 passing automated tests covering all CRUD paths, security validation, and referential constraints.

### Sprint 5: GitHub Governance & CI/CD Pipeline (Phase 6, 7, 8, 9, 10, 11)
- **Focus:** Community health files, YAML issue templates, PR checklists, code review guides, merge conflict demonstration, and GitHub Actions CI pipeline.
- **Milestone:** Automated CI passing across Node 20, 22, and 24; SemVer `v1.0.0` release notes.

---

## 3. Quality Assurance Gates

All development followed strict QA gates:
1. **Compilation Gate:** Zero JSX, CSS, or syntax errors during `npm run build`.
2. **Linting Gate:** Verified with Oxlint.
3. **Automated Test Gate:** All 31 tests in `tests/` must pass with zero failures.
4. **Security Gate:** Passwords must be hashed with `bcryptjs`; no credentials in Git history; protected routes require valid JWT tokens.
5. **Peer Review Gate:** Completed PR checklist and reviewer approval before integration.
