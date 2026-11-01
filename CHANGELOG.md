# Changelog

All notable changes to the **Student Management System** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-01

### Added
- **Repository Architecture**: Initialized production client-server architecture with React 18, Vite 8, Express 4, and MySQL database schema.
- **Documentation**: Added comprehensive 11-section `README.md`, `LICENSE` (MIT), `CONTRIBUTING.md`, and `docs/ARCHITECTURE.md`.
- **Team Governance**: Published 5-member PBL allocation charter in `docs/TEAM_CONTRIBUTIONS.md`.
- **SCM Standards**: Published `docs/GIT_WORKFLOW.md` establishing Conventional Commits and feature-branch workflows.
- **Bug Tracking**: Configured `.github/ISSUE_TEMPLATE/bug_report.md` and `feature_request.md` with YAML schemas and label taxonomy in `docs/ISSUE_MANAGEMENT.md`.
- **Code Review**: Configured `.github/PULL_REQUEST_TEMPLATE.md`, peer review guidelines in `docs/CODE_REVIEW_GUIDELINES.md`, and merge conflict resolution demonstration in `docs/MERGE_CONFLICT_DEMO.md`.
- **Continuous Integration**: Configured automated GitHub Actions workflow in `.github/workflows/ci.yml` running linting, tests, and Vite build on pull requests.
- **Automated Tests**: Implemented native Node.js test suites in `tests/` covering architecture, team roster, GitHub workflows, and backend API contracts.
- **UI Stabilizations**: Resolved icon export bindings and established fallback mock state for offline evaluation.
