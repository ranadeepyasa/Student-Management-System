# Project GitHub Issues & Milestone Tracking Log

**Course Code:** 24TU05IT01 — Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project:** Student Management System  
**Lead Contributor:** B. Abhinav (`24WU0102224`)  
**Workstream:** GitHub Issues, Bug Tracking & Task Management  

---

## 1. Issue Tracking Governance & Taxonomy

In this project, GitHub Issues serve as the primary unit of project planning and bug management. Every enhancement and bug fix must originate from a tracked GitHub Issue before code is merged into `main`.

### Issue Label Taxonomy:
- `enhancement`: New feature, user capability, or UI improvement.
- `bug`: An unexpected failure, exception, or UI regression.
- `testing`: Automated test suites, test coverage, and validation.
- `documentation`: Markdown manuals, specifications, and architecture guides.
- `security`: Authentication, authorization, and cryptographic integrity.

---

## 2. Project Issues Register (Milestones v1.0.0)

### ISSUE #1: Implement Secure Admin Authentication & Token Management
- **Type:** Enhancement / Security
- **Labels:** `enhancement`, `security`
- **Assigned:** Ranadeep Yasa (`@ranadeepyasa`)
- **Status:** Closed / Implemented
- **Description:** Implement administrative login, logout, password hashing with bcryptjs (10 rounds), and JWT bearer token issuance. Protect all student modification routes against unauthenticated requests.
- **Acceptance Criteria:**
  - [x] POST `/api/auth/login` verifies admin credentials.
  - [x] Invalid passwords return HTTP 401 with informative error.
  - [x] Protected endpoints reject requests lacking valid JWT authorization header.
  - [x] Passwords never stored in plain text.

### ISSUE #2: Implement Student CRUD Operations with Referential Constraints
- **Type:** Enhancement
- **Labels:** `enhancement`
- **Assigned:** Ranadeep Yasa (`@ranadeepyasa`)
- **Status:** Closed / Implemented
- **Description:** Build complete CRUD capabilities for students (Add, Read, Update, Delete) with mandatory fields, GPA bounds checks, and unique student ID enforcement.
- **Acceptance Criteria:**
  - [x] POST `/api/students` creates new student with unique `student_id`.
  - [x] Duplicate `student_id` returns HTTP 409 Conflict.
  - [x] GPA validated between 0.00 and 4.00.
  - [x] Safe deletion removes student profile without leaving orphaned foreign key rows.

### ISSUE #3: Add Academic Department Management & Enrollment Guards
- **Type:** Enhancement
- **Labels:** `enhancement`
- **Assigned:** CH. Rishyant (`@chrishyant`)
- **Status:** Closed / Implemented
- **Description:** Implement department creation, editing, faculty lead assignment, and a safe deletion guard preventing removal of departments with actively enrolled students.
- **Acceptance Criteria:**
  - [x] Department codes are unique (e.g. `CSE`, `AI-DS`).
  - [x] Safe delete guard blocks deletion if active student count > 0.
  - [x] Enrolled student counts computed dynamically via SQL joins.

### ISSUE #4: Add Dashboard Statistics, KPI Cards & Reports
- **Type:** Enhancement
- **Labels:** `enhancement`
- **Assigned:** G. Dharan (`@gdharan`)
- **Status:** Closed / Implemented
- **Description:** Create executive dashboard with KPI cards for total students, active retention rate, average GPA, and department distribution charts powered by live database queries.
- **Acceptance Criteria:**
  - [x] All metrics computed from real SQL queries (no hardcoded numbers).
  - [x] Recharts bar and donut charts reflect live database counts.
  - [x] Dashboard refreshes seamlessly.

### ISSUE #5: Implement Student Search, Multi-Criteria Filtering & Sorting
- **Type:** Enhancement
- **Labels:** `enhancement`
- **Assigned:** B. Abhinav (`@babhinav`)
- **Status:** Closed / Implemented
- **Description:** Provide client-side and server-side filtering by name, student ID, department, year of study, and academic status (Active, Inactive, Suspended, Graduated).
- **Acceptance Criteria:**
  - [x] Case-insensitive substring search for student name and ID.
  - [x] Dropdown filters for department, year (1-4), and status.
  - [x] Empty state presented when no records match filter criteria.

### ISSUE #6: Add Automated Application Tests (Unit & Integration)
- **Type:** Testing
- **Labels:** `testing`
- **Assigned:** P. Muneswar Reddy (`@pmuneswar`)
- **Status:** Closed / Implemented
- **Description:** Implement zero-dependency Node.js native test runner suites validating authentication, CRUD, department guards, reports, and architecture integrity.
- **Acceptance Criteria:**
  - [x] At least 30 automated tests implemented across multiple suites.
  - [x] Tests run with `npm test` and pass 100%.
  - [x] Tests validate negative cases (400, 401, 404, 409).

### ISSUE #7: Improve Repository Documentation & Academic Manuals
- **Type:** Documentation
- **Labels:** `documentation`
- **Assigned:** G. Dharan (`@gdharan`)
- **Status:** Closed / Implemented
- **Description:** Produce comprehensive engineering manuals covering architecture, methodology, git workflow, and deployment instructions.
- **Acceptance Criteria:**
  - [x] Complete Markdown documentation hierarchy in `docs/`.
  - [x] Visual ASCII architecture diagrams.
  - [x] Clear installation instructions for local development.

### ISSUE #8: Add Continuous Integration Using GitHub Actions
- **Type:** Enhancement / DevOps
- **Labels:** `enhancement`
- **Assigned:** P. Muneswar Reddy (`@pmuneswar`)
- **Status:** Closed / Implemented
- **Description:** Configure automated CI workflow running on GitHub Actions across Node 20.x, 22.x, and 24.x testing matrix.
- **Acceptance Criteria:**
  - [x] `.github/workflows/ci.yml` triggers on pushes and pull requests to `main`.
  - [x] Executes linting, production Vite build, and automated test suite.
  - [x] Zero failure tolerance for integration branch.
