# Software Testing Plan & Verification Report

**Course Code:** 24TU05IT01  
**Course Title:** Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project Title:** GitHub as an Industry Standard for Collaborative Software Development  

---

## 1. Quality Assurance Strategy

Testing is a core pillar of professional software development. For the **Student Management System**, testing was designed to validate:
1. Functional correctness of all CRUD operations and business logic.
2. Security access controls, password hashing, and token validation.
3. Referential integrity and safety constraints between students and departments.
4. Input validation and collision handling (duplicate IDs, duplicate emails).
5. Architecture compliance, directory hygiene, and GitHub community templates.

---

## 2. Test Execution Command

To execute the automated test suite locally:

```bash
npm test
```

*Under the hood, this executes the Node.js native test runner:*
```bash
node --test --test-concurrency=1 tests/*.test.js
```

---

## 3. Test Suites & Verification Results

```text
▶ Backend Server Configuration & Route Contracts
  ✔ Server app.js defines essential middleware and health check
  ✔ Database schema defines tables for users, departments, and students
  ✔ GitHub integration service is configured with correct defaults
✔ Backend Server Configuration & Route Contracts (3 tests)

▶ Project Architecture & Directory Structure Validation
  ✔ Required high-level project directories exist
  ✔ Required root configuration and baseline files exist
  ✔ .gitignore protects against committing sensitive and large files
  ✔ package.json contains valid scripts and metadata
✔ Project Architecture & Directory Structure Validation (4 tests)

▶ Authentication & Access Control Security Suite
  ✔ POST /api/auth/login succeeds with valid admin credentials
  ✔ POST /api/auth/login fails with invalid password (401 Unauthorized)
  ✔ POST /api/auth/login fails when identifier is not registered (401)
  ✔ POST /api/auth/login fails when missing body fields (400 Bad Request)
  ✔ Protected endpoint /api/students rejects request without Authorization header
✔ Authentication & Access Control Security Suite (5 tests)

▶ Department Management & Referential Integrity Suite
  ✔ GET /api/departments returns all academic departments with student counts
  ✔ POST /api/departments creates new department with unique code and name
  ✔ POST /api/departments rejects duplicate department code with 409 Conflict
  ✔ DELETE /api/departments/:id blocks deletion if students are enrolled (Safe Delete Guard)
✔ Department Management & Referential Integrity Suite (4 tests)

▶ GitHub Automation & Community Templates Validation
  ✔ Issue template directory and files exist with proper frontmatter
  ✔ Pull Request template exists and contains comprehensive checklist
  ✔ GitHub Actions CI workflow file exists with build and test jobs
✔ GitHub Automation & Community Templates Validation (3 tests)

▶ Academic Analytics & Data Export Suite
  ✔ GET /api/reports/dashboard-stats provides aggregated institutional intelligence
  ✔ GET /api/reports/export/students.csv outputs valid RFC-4180 CSV file
✔ Academic Analytics & Data Export Suite (2 tests)

▶ Student Management System - CRUD & Validation Suite
  ✔ GET /api/students returns seeded student directory with pagination metadata
  ✔ POST /api/students successfully creates a new student when authenticated
  ✔ POST /api/students rejects duplicate student_id with 409 Conflict
  ✔ POST /api/students rejects missing mandatory fields with 400 Bad Request
  ✔ GET /api/students with search filter finds specific student by ID or Name
  ✔ GET /api/students with department filter returns only matching students
  ✔ PUT /api/students/:id updates student record accurately
  ✔ DELETE /api/students/:id removes student record safely
✔ Student Management System - CRUD & Validation Suite (8 tests)

▶ Five-Member Team Responsibilities & Roster Validation
  ✔ docs/TEAM_CONTRIBUTIONS.md documents all 5 members with exact roll numbers
  ✔ Application mock data contains all 5 team members with valid handles
✔ Five-Member Team Responsibilities & Roster Validation (2 tests)

--------------------------------------------------------------------------------
Summary: 31 tests passed | 0 failed | 0 skipped | 100% Pass Rate
--------------------------------------------------------------------------------
```

---

## 4. Test Coverage Summary

| Area | Suite | Coverage Target | Status |
| :--- | :--- | :--- | :--- |
| **Authentication** | `tests/authentication.test.js` | Login, wrong password, JWT header, protected routes | 100% Passing |
| **Student CRUD** | `tests/studentManagement.test.js` | Create, read, update, delete, search, filter, 409 collisions | 100% Passing |
| **Departments** | `tests/departmentOperations.test.js` | Listing, counts, duplicates, safe deletion constraint | 100% Passing |
| **Reports** | `tests/reportsAndAnalytics.test.js` | Aggregation statistics, RFC-4180 CSV streaming | 100% Passing |
| **Architecture** | `tests/architecture.test.js` | Folder structures, package metadata, `.gitignore` rules | 100% Passing |
| **Team Roster** | `tests/teamContributions.test.js` | 5-member Woxsen roll numbers and documentation | 100% Passing |
| **GitHub Workflows** | `tests/githubWorkflows.test.js` | Issue templates, PR checklists, CI pipeline syntax | 100% Passing |
| **Server Contracts** | `tests/apiEndpoints.test.js` | Health checks, CORS, Helmet, schema tables | 100% Passing |
