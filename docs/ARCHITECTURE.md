# System Architecture & Technical Specifications

**Project Title**: GitHub as an Industry Standard for Collaborative Software Development  
**Application**: Student Management System & Collaborative Engineering Platform  
**Repository**: [ranadeepyasa/Student-Management-System](https://github.com/ranadeepyasa/Student-Management-System)  

---

## 1. High-Level Architectural Model

The application follows a **modern decoupled three-tier architecture** with dual-mode operational capability:
1. **Presentation Layer (Frontend)**: React 18 SPA bundled with Vite 8 and styled with Tailwind CSS 3. Provides interactive dashboards, issue management tables, branch status visualizers, pull request diff monitors, and team directory pages.
2. **Application Layer (Backend API)**: Node.js Express 4 RESTful micro-service with Helmet security middleware, Morgan logging, JWT authentication, and WebSocket (Socket.io) real-time state synchronization.
3. **Data Layer**: Relational MySQL schema with automatic pooling, alongside robust local mock data failover for zero-dependency academic evaluation.
4. **Integration Tier**: Direct bi-directional integration with the **GitHub REST API v3** to sync live repository statistics, commit trees, open issues, and pull request statuses.

```
+-----------------------------------------------------------------------+
|                           CLIENT TIER                                 |
|   React 18 Single Page Application (Vite 8, Tailwind CSS, Recharts)   |
|   - DashboardPage          - IssuesPage         - BranchesPage        |
|   - PullRequestsPage       - CodeReviewsPage    - TeamPage (5 Members)|
+-----------------------------------+-----------------------------------+
                                    | REST / WebSocket
                                    v
+-----------------------------------------------------------------------+
|                           SERVER TIER                                 |
|   Node.js + Express 4 API Gateway (Port 5000)                         |
|   - Rate Limiter           - Helmet Security    - JWT Auth Middleware |
|   - Controllers: Auth, Project, Issue, Branch, PullRequest, Release   |
+-------------------+-------------------------------+-------------------+
                    |                               |
                    v                               v
    +-------------------------------+   +-------------------------------+
    |         STORAGE TIER          |   |       EXTERNAL SERVICES       |
    |  MySQL Database (devflow_db)  |   |   GitHub REST API v3          |
    |  - Users (5 Team Members)     |   |   (ranadeepyasa/              |
    |  - Issues, Branches, Commits  |   |    Student-Management-System) |
    +-------------------------------+   +-------------------------------+
```

---

## 2. Directory Layout & Organization

```
Student-Management-System/
├── .github/                         # GitHub platform configurations
│   ├── ISSUE_TEMPLATE/              # Structured bug & feature request templates
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md     # Comprehensive pull request checklist
│   └── workflows/
│       └── ci.yml                   # Automated CI build & test pipeline
├── docs/                            # Academic & technical documentation
│   ├── ARCHITECTURE.md              # System design & architecture (this file)
│   ├── CODE_REVIEW_GUIDELINES.md    # PR review checklist & guidelines
│   ├── GIT_WORKFLOW.md              # Branching models & commit standards
│   ├── ISSUE_MANAGEMENT.md          # Issue triage, labels, and SLAs
│   ├── MERGE_CONFLICT_DEMO.md       # Practical merge conflict simulation & fix
│   ├── RELEASE_NOTES_v1.0.0.md      # Semantic release notes for v1.0.0
│   └── TEAM_CONTRIBUTIONS.md        # Official 5-member team roster & allocations
├── public/                          # Static assets and icons
├── screenshots/                     # Visual workflow and UI demonstration captures
├── server/                          # Backend Express API
│   ├── config/                      # Database & environment configurations
│   ├── controllers/                 # Business logic controllers
│   ├── database/                    # Relational MySQL schema & migrations
│   ├── middleware/                  # Auth, rate limiting & error handlers
│   ├── routes/                      # Express route endpoints
│   ├── scripts/                     # Database initialization and seed scripts
│   ├── services/                    # GitHub API and WebSocket services
│   └── server.js                    # Server bootstrap entry point
├── src/                             # Frontend React application
│   ├── assets/                      # SVGs, brand assets, hero artwork
│   ├── components/                  # Common, dashboard, and layout components
│   ├── context/                     # Global DevFlow state context provider
│   ├── data/                        # Mock data fallbacks & team member rosters
│   ├── pages/                       # Route views (Dashboard, Issues, PRs, etc.)
│   └── services/                    # Axios/fetch API clients and WebSocket clients
├── tests/                           # Automated test suites (Node native test runner)
│   ├── apiEndpoints.test.js
│   ├── architecture.test.js
│   ├── githubWorkflows.test.js
│   └── teamContributions.test.js
├── .gitignore                       # Multi-tier exclusion list
├── CHANGELOG.md                     # Release version history
├── CONTRIBUTING.md                  # Open-source collaboration guidelines
├── LICENSE                          # MIT Open Source License
├── package.json                     # Project manifest and scripts
├── tailwind.config.js               # Tailwind design tokens
└── vite.config.js                   # Vite bundler configuration
```

---

## 3. Technology Stack Summary

| Layer | Component | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | 18.3.1 | Component-driven UI architecture |
| **Build Tooling** | Vite | 8.3.5 | Ultra-fast HMR and production bundling |
| **Styling** | Tailwind CSS | 3.4.19 | Utility-first responsive design system |
| **Icons & Charts** | Lucide / Recharts | Latest | High-fidelity GitHub-style visualization |
| **Backend Runtime** | Node.js | v24+ | Asynchronous server execution |
| **Web Framework** | Express | 4.21.2 | REST API routing and middleware chaining |
| **Database** | MySQL / In-Memory | 8.0 / Pool | Relational entity persistence |
| **Testing** | Node Test Runner | Native | Zero-dependency, lightning-fast unit tests |
| **VCS & Collaboration** | Git / GitHub | Latest | Distributed version control and automation |
