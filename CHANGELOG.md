# Changelog

All notable changes to the **Student Management System** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-02

### Added
- **Student Management CRUD:**
  - Added `POST /api/students` for student registration with email, student ID, and GPA boundary validations.
  - Added `GET /api/students` with paginated responses, column sorting, and multi-criteria filters.
  - Added `GET /api/students/:id` returning comprehensive academic profile details.
  - Added `PUT /api/students/:id` for student record modifications.
  - Added `DELETE /api/students/:id` with two-step confirmation dialog and activity audit trail.
- **Department Governance:**
  - Added `POST /api/departments` for department onboarding with unique code validation.
  - Added `GET /api/departments` returning department list with dynamic enrolled student counts.
  - Added referential safety deletion guard on `DELETE /api/departments/:id` preventing deletion when active students are enrolled.
- **Institutional Analytics & Reports:**
  - Added `GET /api/reports/dashboard-stats` computing live campus enrollment and GPA metrics.
  - Added `GET /api/reports/export/students.csv` streaming RFC-4180 compliant CSV downloads.
  - Added interactive Recharts bar charts and donut charts on dashboard and reports views.
- **Authentication & Security:**
  - Added bcryptjs password salting and hashing (salt rounds = 10) for administrators.
  - Added JWT token generation and authentication middleware (`server/middleware/auth.js`).
  - Added Helmet security headers and rate-limiting middleware.
- **Dual-Engine Persistence:**
  - Built unified database adapter supporting MySQL 8.x and Node.js 24 native embedded SQLite (`node:sqlite`) with WAL mode.
- **Automated Testing Suite:**
  - Implemented 31 automated tests under `tests/` covering authentication, student CRUD, departments, reports, and architecture.
- **GitHub Collaborative Infrastructure:**
  - Established 5 feature branches for team members (`feature/repository-documentation`, `feature/source-code-management`, `feature/issues-and-bug-tracking`, `feature/pull-requests-and-code-review`, `feature/release-management`).
  - Added GitHub Actions continuous integration workflow (`.github/workflows/ci.yml`).
  - Added YAML issue templates (`bug_report.md`, `feature_request.md`).
  - Added Pull Request template with 6-point checklist (`.github/PULL_REQUEST_TEMPLATE.md`).
  - Added 18 comprehensive technical documentation guides under `docs/`.

---

## [0.1.0] - 2026-11-01

### Added
- Baseline repository structure and DevFlow Git workflow scaffolding.
- Initial client layout and routing with React 18, Vite, and Tailwind CSS.
- Socket.IO connection scaffolding.
