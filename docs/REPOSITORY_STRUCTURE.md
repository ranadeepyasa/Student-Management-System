# Repository Architecture & File Hierarchy

**Course Code:** 24TU05IT01 — Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project:** Student Management System  
**Lead Contributor:** G. Dharan (`24WU0102210`)  

---

## 1. Directory Tree Overview

```text
Student-Management-System/
├── .github/                                # GitHub automation & governance templates
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md                   # Standardized bug reporting form
│   │   └── feature_request.md              # Feature enhancement request template
│   ├── PULL_REQUEST_TEMPLATE.md            # Pull Request review checklist & metadata form
│   └── workflows/
│       └── ci.yml                          # GitHub Actions Continuous Integration pipeline
├── docs/                                   # Academic engineering manuals & architecture guides
│   ├── BRANCHING_STRATEGY.md               # Git branching policy & model
│   ├── CODE_REVIEW_GUIDE.md                # Code review rules & reviewer checklist
│   ├── DEPLOYMENT_GUIDE.md                 # Production deployment procedures
│   ├── FINAL_IMPLEMENTATION_REPORT.md      # Comprehensive academic project report
│   ├── FUTURE_SCOPE.md                     # Roadmap & upcoming platform enhancements
│   ├── GIT_COMMANDS_GUIDE.md               # SCM reference manual & terminal commands
│   ├── GIT_WORKFLOW.md                     # Git lifecycle diagram & team protocols
│   ├── IMPLEMENTATION.md                   # Full-stack implementation specifications
│   ├── ISSUE_TRACKING_GUIDE.md             # Issue triage & label classification guide
│   ├── MERGE_CONFLICT_GUIDE.md             # Safe 3-way merge conflict resolution guide
│   ├── METHODOLOGY.md                      # Academic development methodology
│   ├── PROJECT_AUDIT.md                    # Pre-implementation codebase audit
│   ├── PROJECT_INTRODUCTION.md             # Project background, context & problem statement
│   ├── PROJECT_OBJECTIVES.md               # Measurable project goals & learning outcomes
│   ├── PULL_REQUEST_GUIDE.md               # Pull request submission & merge protocols
│   ├── RELEASE_MANAGEMENT.md               # Release engineering & deployment packaging
│   ├── RELEASE_NOTES.md                    # Release notes for version v1.0.0
│   ├── REPOSITORY_STRUCTURE.md             # This file: Directory & codebase anatomy
│   ├── SOURCE_CODE_MANAGEMENT.md           # SCM guidelines, atomic commits & clean trees
│   ├── SYSTEM_ARCHITECTURE.md              # Multi-tier architectural specifications
│   ├── TEAM_CONTRIBUTIONS.md               # 5-member team roster, roles & commit verifications
│   └── TESTING.md                          # Testing methodology & test suite catalog
├── server/                                 # Express.js REST API Backend
│   ├── config/
│   │   └── db.js                           # Dual-engine relational SQL adapter (MySQL + SQLite)
│   ├── controllers/
│   │   ├── authController.js               # Admin authentication, bcrypt hashing, JWT issuance
│   │   ├── departmentController.js         # Academic department CRUD & safe delete checks
│   │   ├── studentController.js            # Student records CRUD, validation & search
│   │   └── reportController.js             # BI analytics aggregations & streaming CSV export
│   ├── database/
│   │   └── schema.sql                      # SQL DDL database schema definitions
│   ├── routes/                             # Express route endpoint definitions
│   │   ├── authRoutes.js
│   │   ├── departmentRoutes.js
│   │   ├── studentRoutes.js
│   │   └── reportRoutes.js
│   ├── app.js                              # Express application setup & middleware stack
│   ├── package.json                        # Backend dependencies & script definitions
│   └── server.js                           # HTTP server startup & listener
├── src/                                    # React Frontend Application
│   ├── assets/                             # Static SVGs and branding icons
│   ├── components/                         # Modular React UI components
│   │   ├── common/                         # Reusable atomic UI elements (Buttons, Modals, Badges)
│   │   ├── dashboard/                      # Dashboard charts, metrics cards, and feeds
│   │   └── layout/                         # TopNavbar, Sidebar, AppLayout shells
│   ├── context/
│   │   └── DevFlowContext.jsx              # Global state management & API coordinator
│   ├── pages/                              # Routed page components
│   │   ├── DashboardPage.jsx               # Executive statistics & BI dashboard
│   │   ├── StudentsPage.jsx                # Student directory with search, filter, and CRUD
│   │   ├── StudentDetailPage.jsx           # Individual student profile & academic history
│   │   ├── DepartmentsPage.jsx             # Department management & faculty leads
│   │   ├── ReportsPage.jsx                 # Reports, charts, and CSV data export
│   │   ├── RepositoriesPage.jsx            # GitHub repositories viewer
│   │   ├── IssuesPage.jsx                  # GitHub issues board
│   │   ├── BranchesPage.jsx                # Workstream branch manager
│   │   ├── PullRequestsPage.jsx            # Pull requests triage & review
│   │   ├── CodeReviewsPage.jsx             # Code diff inspection simulator
│   │   ├── ReleasesPage.jsx                # Release notes & asset download
│   │   ├── TeamPage.jsx                    # Collaborator profile management
│   │   └── SettingsPage.jsx                # System configuration & preferences
│   ├── services/
│   │   └── api.js                          # Axios / Fetch HTTP client for backend REST API
│   ├── App.jsx                             # React router route definitions
│   ├── index.css                           # Global Tailwind CSS definitions (Orange & White)
│   └── main.jsx                            # React 18 DOM mount point
├── tests/                                  # Automated Test Suites (31 Tests)
│   ├── authentication.test.js              # Admin authentication & JWT security tests
│   ├── departmentOperations.test.js        # Department CRUD & referential integrity tests
│   ├── studentManagement.test.js           # Student CRUD, validation & search tests
│   ├── reportsAndAnalytics.test.js         # BI aggregations & CSV export tests
│   ├── architecture.test.js                # Project structure & file integrity tests
│   ├── githubWorkflows.test.js             # Issue, PR & CI template contract tests
│   ├── teamContributions.test.js           # Roster & student contribution tests
│   └── apiEndpoints.test.js                # Health check & route contract tests
├── .env.example                            # Safe template for environment variables
├── .gitignore                              # Git exclusion rules for secrets, builds & databases
├── CHANGELOG.md                            # Version-by-version release history
├── CONTRIBUTING.md                         # Contribution protocols & code guidelines
├── LICENSE                                 # MIT Open Source License
├── package.json                            # Root package metadata & script definitions
├── README.md                               # Primary repository entrance & user manual
├── run.bat                                 # Quick 1-click application launcher alias
├── start.bat                               # Windows 1-click launcher for frontend + backend
├── tailwind.config.js                      # Tailwind theme configuration
├── test.bat                                # Windows 1-click test suite runner
└── vite.config.js                          # Vite build tooling configuration
```
