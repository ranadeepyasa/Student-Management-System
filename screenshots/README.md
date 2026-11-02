# Presentation Screenshots & Visual Evidence Directory

**Course Code:** 24TU05IT01  
**Course Title:** Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project:** Student Management System & GitHub Collaborative Development Demonstration  

---

## Screenshot Inventory & Evidence Index

This directory documents the genuine visual evidence and screen captures for the final course presentation and viva demonstration.

| Ref # | Screenshot Target | Route / Interface | Description | Evidence File |
| :--- | :--- | :--- | :--- | :--- |
| **SCR-01** | **Admin Authentication** | Modal / `/api/auth/login` | Secure administrator login modal with validation feedback | `screenshots/01_admin_login.png` |
| **SCR-02** | **Executive Dashboard** | `/` | KPI summary cards, Recharts department & status charts, recent student table | `screenshots/02_executive_dashboard.png` |
| **SCR-03** | **Student Directory** | `/students` | Paginated records table, multi-criteria filters (dept, year, status), search bar | `screenshots/03_student_directory.png` |
| **SCR-04** | **Student Registration**| `/students` (Modal) | Validated student registration form with academic constraints | `screenshots/04_student_registration_form.png` |
| **SCR-05** | **Student Profile Details**| `/students/24WU0104081` | Dedicated profile view with academic standings, GPA, contact, and department card | `screenshots/05_student_profile_details.png` |
| **SCR-06** | **Academic Departments** | `/departments` | Department cards with capacity metrics and safe delete guard | `screenshots/06_department_management.png` |
| **SCR-07** | **Reports & Analytics** | `/reports` | Cohort distribution, department breakdown, and CSV download trigger | `screenshots/07_reports_analytics.png` |
| **SCR-08** | **GitHub Repository Overview** | `github.com/...` | Main repository view, verified commit badges, and clean directory structure | `screenshots/08_github_repository.png` |
| **SCR-09** | **5 Feature Branches** | GitHub Branch View | All 5 workstream branches mapped to team members | `screenshots/09_github_branches.png` |
| **SCR-10** | **Commit Graph & History**| `git log --graph` | Clean atomic Conventional Commits history | `screenshots/10_git_commit_graph.png` |
| **SCR-11** | **GitHub Milestone Issues**| `/issues` | The 8 milestone issues with labels, descriptions, and assignees | `screenshots/11_github_issues.png` |
| **SCR-12** | **Pull Requests Dashboard**| `/pulls` | Feature branch PRs with description, related issue links, and checklists | `screenshots/12_pull_requests.png` |
| **SCR-13** | **Code Review Inspection** | PR Review View | Line-by-line diff review, comments, change requests, and approval | `screenshots/13_code_review.png` |
| **SCR-14** | **GitHub Actions CI Pipeline**| GitHub Actions Tab | Multi-matrix build, lint, and 31 automated tests passing | `screenshots/14_github_actions_ci.png` |
| **SCR-15** | **v1.0.0 Stable Release** | GitHub Releases Tab | Release `v1.0.0` with assets, changelog, and distribution bundles | `screenshots/15_github_release_v1.0.0.png` |

---

## Quick Command to Run Locally for Presentation Live Demo:

```bash
# 1. Start Backend API Server
cd server
npm start

# 2. In a second terminal, start React Frontend
npm run dev
# Browser opens at http://localhost:5173
```
