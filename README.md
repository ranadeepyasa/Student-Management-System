# GitHub as an Industry Standard for Collaborative Software Development
### Student Management System & Collaborative Engineering Platform

[![Continuous Integration](https://github.com/ranadeepyasa/Student-Management-System/actions/workflows/ci.yml/badge.svg)](https://github.com/ranadeepyasa/Student-Management-System/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/vite-8.3.5-646CFF.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-18.3.1-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.4.19-38B2AC.svg)](https://tailwindcss.com/)

---

## 1. Project Introduction

In contemporary software engineering organizations, writing source code is rarely an isolated activity. High-performing engineering teams operate in distributed, multi-contributor environments where coordinated change management, automated verification, and asynchronous peer review form the bedrock of sustainable software delivery.

This academic Project Based Learning (PBL) project—titled **"GitHub as an Industry Standard for Collaborative Software Development"**—demonstrates how Git and GitHub provide the enterprise-grade foundation for source code management, branching workflows, issue tracking, peer code review, conflict resolution, and automated continuous integration (CI/CD). Built around an interactive **Student Management System & Collaborative Engineering Platform**, the project bridges theoretical software engineering paradigms with hands-on industry practices.

---

## 2. Project Objectives

1. **Practical Demonstration of Distributed Version Control**: Move beyond simple command line usage to implement trunk-based development with short-lived feature branches.
2. **Defect Tracking & Requirements Traceability**: Standardize issue discovery, categorization, and resolution using GitHub Issues and issue templates.
3. **Structured Peer Code Review**: Enforce multi-perspective code inspection using standardized Pull Request templates and quality checklists.
4. **Automated Continuous Integration**: Implement automated build and testing pipelines using GitHub Actions to eliminate regression defects.
5. **Conflict Diagnosis & Resolution**: Safely model and resolve real-world 3-way merge conflicts that arise during concurrent multi-developer workflows.
6. **Release Governance**: Implement Semantic Versioning (SemVer 2.0.0), changelog maintenance, and release tagging for production deployments.

---

## 3. Problem Statement

Academic and novice software developers frequently struggle with collaborative software engineering challenges:
- **Code Collision & Overwriting**: Without structured branch isolation, developers inadvertently overwrite each other's changes.
- **Undocumented Defect Lifecycles**: Bugs and feature requests communicated via ad-hoc channels become lost without clear accountability or audit logs.
- **Untested Pull Requests**: Merging unverified code leads to broken production builds and lengthy regression debugging sessions.
- **Uncoordinated Releases**: Deployments lack semantic versioning, reproducible tags, or changelogs, creating uncertainty in production environments.

This project directly resolves these challenges by demonstrating an end-to-end industry-standard GitHub workflow applied to a production-grade application codebase.

---

## 4. Technologies Used

| Tier / Domain | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | 18.3.1 | Modular, declarative user interface components |
| **Bundler & Build Tool** | Vite | 8.3.5 | Fast Hot Module Replacement (HMR) and optimized rollup bundling |
| **Styling & Design System** | Tailwind CSS | 3.4.19 | Responsive utility-first design aligned with GitHub Primer tokens |
| **Routing** | React Router | 7.18.5 | Client-side declarative application routing |
| **Data Visualization** | Recharts | 3.10.1 | Analytics charts for commit velocity and issue status breakdown |
| **Iconography** | Lucide React | 1.66.0 | Semantic iconography for repository and version control concepts |
| **Backend Runtime** | Node.js | v20+ / v24+ | Asynchronous event-driven JavaScript server environment |
| **Backend Framework** | Express | 4.21.2 | RESTful API gateway, route orchestration, and middleware handling |
| **Security Middleware** | Helmet & Rate-Limit | 8.0.0 / 7.5.0 | HTTP security headers, CORS origin enforcement, and DoS mitigation |
| **Testing Harness** | Node Test Runner | Native | Built-in zero-dependency unit and integration test runner (`node:test`) |
| **Continuous Integration** | GitHub Actions | v4 | Automated workflow matrix testing across multiple Node runtimes |

---

## 5. Application Architecture

The system utilizes a decoupled client-server architecture capable of both live connected mode and zero-dependency offline academic demonstration:

```
+-------------------------------------------------------------------------------+
|                            PRESENTATION TIER                                  |
|   React 18 SPA (Vite Bundler, Tailwind CSS UI System, Lucide Icons)           |
|                                                                               |
|   [ Dashboard ]  [ Repositories ]  [ Issues ]  [ Branches ]  [ Pull Requests ]|
|   [ Code Reviews ] [ Releases ] [ Team Roster ] [ Activity Feed ]             |
+---------------------------------------+---------------------------------------+
                                        | HTTP REST / WebSocket
                                        v
+-------------------------------------------------------------------------------+
|                               APPLICATION TIER                                |
|   Express.js API Gateway (Port 5000)                                          |
|   - Helmet Security Headers      - Express Rate Limiting    - JWT Auth        |
|   - GitHub Sync Service          - Real-Time WebSocket Hub (Socket.io)       |
+-------------------+-----------------------------------+-----------------------+
                    |                                   |
                    v                                   v
    +-------------------------------+   +-------------------------------+
    |         PERSISTENCE           |   |       EXTERNAL INTEGRATION    |
    |  MySQL Schema (devflow_db)    |   |  GitHub REST API v3           |
    |  + Resilient Mock Fallbacks   |   |  (ranadeepyasa/               |
    |    for Offline Evaluation     |   |   Student-Management-System)  |
    +-------------------------------+   +-------------------------------+
```

For detailed component interaction diagrams and API route contracts, refer to [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 6. Installation & Setup Instructions

### Prerequisites
- **Node.js**: Version `>= 20.0.0` ([Download Node.js](https://nodejs.org/))
- **npm**: Version `>= 9.0.0`
- **Git**: Version `>= 2.40.0` ([Download Git](https://git-scm.com/))

### Step 1: Clone the Repository
```bash
git clone https://github.com/ranadeepyasa/Student-Management-System.git
cd Student-Management-System
```

### Step 2: Install Project Dependencies
```bash
npm install
```

### Step 3: Run Local Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` to explore the interactive platform.

### Step 4: Optional Backend Server Setup
To run the Express backend API:
```bash
cd server
npm install
npm run dev
```
The API server starts on `http://localhost:5000`. If MySQL is not running locally, the application automatically uses resilient mock state for seamless evaluation.

---

## 7. Features & Functionality

1. **Repository Hub**: Monitor repository statistics, default branches, recent commit SHAs, and live synchronization status with GitHub.
2. **Issue Tracking & Triage**: Create, search, filter, and assign issues across priority levels (`High`, `Medium`, `Low`) and categories (`bug`, `enhancement`, `documentation`).
3. **Branch Isolation Monitor**: Visual overview of active feature branches, commit divergences, and protection rules.
4. **Pull Request Management**: Detailed PR inspections, file diff visualizers, mergeability checks, and issue linking.
5. **Peer Code Review Simulation**: Step-by-step review checklists, diff inline comments, and change request workflows.
6. **Release & Tagging Dashboard**: Semantic Versioning release notes, asset manifests, and git release tag history.
7. **Team Collaboration Roster**: Interactive 5-member team directory showcasing individual academic responsibilities, roll numbers, and active personas.
8. **Real-Time Activity Feed**: Live audit trail tracking all commits, branches, issues, and PR events.

---

## 8. Git and GitHub Workflow

Our team strictly adheres to an industry-standard collaborative development workflow:

```
               [ feature/repository-documentation ]
                        o---o---o
                       /         \   (Pull Request + Peer Review)
main (Production) ----o-----------o-----------------o---> [ v1.0.0 Release ]
                       \         /
                        o---o---o
               [ feature/source-code-management ]
```

1. **Branch Protection**: Direct commits to `main` are restricted. All changes require feature branches.
2. **Conventional Commits**: Every commit message uses structured prefixes (`feat:`, `fix:`, `docs:`, `ci:`, `chore:`).
3. **Community Templates**: Standardized `.github/ISSUE_TEMPLATE/` and `.github/PULL_REQUEST_TEMPLATE.md`.
4. **Automated Verification**: GitHub Actions CI validates linting, tests, and build on every Pull Request.
5. **Conflict Resolution**: Documented 3-way merge resolution process detailed in [docs/MERGE_CONFLICT_DEMO.md](docs/MERGE_CONFLICT_DEMO.md).

For the complete guide, see [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md).

---

## 9. Team Responsibilities & Allocations

Official allocations for the 5-member project team:

| Team Member | Roll Number | Role | Core Responsibility | Assigned Feature Branch |
| :--- | :--- | :--- | :--- | :--- |
| **G. Dharan** | `24WU0102210` | Repo Administrator | Introduction, Git/GitHub fundamentals, repository governance | `feature/repository-documentation` |
| **CH. Rishyant** | `24WU0102213` | SCM Specialist | Git workflow, commits, source code management, version history | `feature/source-code-management` |
| **B. Abhinav** | `24WU0102224` | QA Specialist | GitHub Issues, bug tracking, triage lifecycle, branch concepts | `feature/issues-and-bug-tracking` |
| **Ranadeep Yasa** | `24WU0104081` | Team Lead & Architect | Branching workflow, Pull Requests, code review, merge conflicts | `feature/pull-requests-and-code-review` |
| **P. Muneswar Reddy** | `24WU0101006` | DevOps & Release Lead | Release management, documentation, benefits, challenges, CI/CD | `feature/release-management` |

For full member profiles and deliverable matrices, see [docs/TEAM_CONTRIBUTIONS.md](docs/TEAM_CONTRIBUTIONS.md).

---

## 10. Testing Instructions

The repository includes automated unit and integration tests using Node.js's native test runner (`node:test`). Tests run in milliseconds without external test framework overhead.

### Running Tests Locally
```bash
npm test
```

### Running Tests with Spec Reporter
```bash
node --test --test-reporter=spec tests/**/*.test.js
```

### Verifying Production Build
```bash
npm run build
```

### Test Suite Coverage
- **`tests/architecture.test.js`**: Validates project directory structure, mandatory files, and `.gitignore` security rules.
- **`tests/teamContributions.test.js`**: Validates 5-member team documentation, roll numbers, and mock data rosters.
- **`tests/githubWorkflows.test.js`**: Validates issue template frontmatter, pull request template checklist, and CI workflow jobs.
- **`tests/apiEndpoints.test.js`**: Validates Express server middleware, health check route, and GitHub integration defaults.

---

## 11. Future Enhancements

1. **Automated Semantic Release**: Implement GitHub Actions automated tag generation based on conventional commit prefixes.
2. **Interactive Merge Conflict Web Playground**: Extend the web UI to provide an interactive in-browser 3-way merge conflict editor.
3. **Fine-Grained GitHub App Integration**: Add OAuth2 app installation flow for fine-grained repository webhook synchronization.
4. **Containerized Deployment**: Add multi-stage Docker and Docker Compose files for turnkey container deployment.

---

## 12. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
