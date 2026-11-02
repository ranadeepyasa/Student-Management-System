# GitHub Issues & Defect Triage Management Guide

**Course Code:** 24TU05IT01  
**Course Title:** Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project Title:** GitHub as an Industry Standard for Collaborative Software Development  

---

## 1. Issue Triage Philosophy

In modern software development, GitHub Issues serve as the single source of truth for work items, defect reports, feature proposals, and architectural discussions. 

```text
[Issue Submitted via Template] 
         │
         ▼
[Triage: Labeling & Severity Assessment] 
         │
         ▼
[Assigned to Team Member & Linked to Milestone] 
         │
         ▼
[Development on Feature Branch (feature/issue-name)] 
         │
         ▼
[Pull Request referencing "Closes #IssueNumber"] 
         │
         ▼
[Automated Issue Closing upon PR Merge]
```

---

## 2. Standard Label Taxonomy

| Label | Color | Description |
| :--- | :--- | :--- |
| `enhancement` | `#a2eeef` | New feature or improvement request |
| `bug` | `#d73a4a` | Something isn't working as expected |
| `documentation` | `#0075ca` | Improvements or additions to documentation |
| `testing` | `#fbca04` | Unit, integration, or E2E testing additions |
| `ci-cd` | `#5319e7` | Continuous integration and release automation |
| `security` | `#b60205` | Vulnerability patch or access control measure |

---

## 3. Official Project Milestone Issues

The following 8 milestone issues were defined, triaged, and delivered during this project lifecycle:

### Issue #1: Implement secure admin authentication
- **Label:** `enhancement`, `security`
- **Assigned To:** Ranadeep Yasa (`24WU0104081`)
- **Description:** Implement administrator authentication with encrypted credentials, session management, and protected dashboard routes.
- **Acceptance Criteria:**
  - [x] Passwords hashed using `bcryptjs` with salt rounds >= 10.
  - [x] Cryptographically signed JWT tokens issued on login.
  - [x] Unauthorized access protection on student mutation endpoints (`POST`, `PUT`, `DELETE`).
  - [x] Token verification endpoint `/api/auth/me`.

### Issue #2: Implement student CRUD operations
- **Label:** `enhancement`
- **Assigned To:** CH. Rishyant (`24WU0102213`)
- **Description:** Build complete create, read, update, delete functionality for student records.
- **Acceptance Criteria:**
  - [x] Student modal registration with full field validation.
  - [x] Paginated directory view with sortable columns.
  - [x] Student update interface with real-time UI synchronization.
  - [x] Safe deletion confirmation dialog with audit logging.

### Issue #3: Add department management
- **Label:** `enhancement`
- **Assigned To:** G. Dharan (`24WU0102210`)
- **Description:** Build department registry with capacity metrics and referential deletion safety.
- **Acceptance Criteria:**
  - [x] Add, view, edit department details (Code, Name, HOD, Building, Email).
  - [x] Dynamic calculation of enrolled students and active student capacity.
  - [x] Safe delete guard blocking deletion when students are actively enrolled.

### Issue #4: Add dashboard statistics and reports
- **Label:** `enhancement`
- **Assigned To:** P. Muneswar Reddy (`24WU0101006`)
- **Description:** Aggregate institutional intelligence and student metrics into interactive visual charts and downloadable reports.
- **Acceptance Criteria:**
  - [x] Database-computed summary metrics (Total, Active, Inactive, Suspended, Graduated, Average GPA).
  - [x] Department distribution bar chart and status breakdown donut chart using Recharts.
  - [x] One-click RFC-4180 compliant CSV export download.

### Issue #5: Implement student search and filtering
- **Label:** `enhancement`
- **Assigned To:** CH. Rishyant (`24WU0102213`)
- **Description:** Enable fast search across student IDs, names, and emails, plus multi-criteria filters.
- **Acceptance Criteria:**
  - [x] Real-time search by ID, name, email, or degree.
  - [x] Filter by academic department dropdown.
  - [x] Filter by academic year (1st, 2nd, 3rd, 4th).
  - [x] Filter by status (`Active`, `Inactive`, `Suspended`, `Graduated`).

### Issue #6: Add automated application tests
- **Label:** `testing`
- **Assigned To:** B. Abhinav (`24WU0102224`)
- **Description:** Implement comprehensive automated unit and integration tests using Node.js native test runner.
- **Acceptance Criteria:**
  - [x] Test suites covering Authentication, Student CRUD, Departments, and Analytics.
  - [x] Zero fake or skipped tests; 100% genuine assertion execution.
  - [x] All tests passing deterministically: `npm test`.

### Issue #7: Improve repository documentation
- **Label:** `documentation`
- **Assigned To:** G. Dharan (`24WU0102210`)
- **Description:** Author professional engineering documentation covering architecture, Git workflows, PR guides, and contribution rosters.
- **Acceptance Criteria:**
  - [x] Detailed `README.md`, `CONTRIBUTING.md`, and 18 technical guides under `docs/`.
  - [x] Complete system architecture and sequence diagrams.
  - [x] Verified contribution matrix distinguishing team assignments.

### Issue #8: Add continuous integration using GitHub Actions
- **Label:** `enhancement`, `ci-cd`
- **Assigned To:** P. Muneswar Reddy (`24WU0101006`)
- **Description:** Configure automated GitHub Actions CI pipeline running builds, linters, and test suites across multi-version Node environments.
- **Acceptance Criteria:**
  - [x] Workflow configuration at `.github/workflows/ci.yml`.
  - [x] Triggers automatically on pull requests targeting `main` and pushes.
  - [x] Tests across Node 20.x, 22.x, and 24.x matrix.
