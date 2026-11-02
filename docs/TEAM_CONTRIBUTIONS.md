# Team Contributions & Role Allocations

**Project Title**: GitHub as an Industry Standard for Collaborative Software Development  
**Academic Course**: 24TU05IT01 - Industry Excellence Track  
**Institution**: Woxsen University  
**Repository**: [ranadeepyasa/Student-Management-System](https://github.com/ranadeepyasa/Student-Management-System)  

---

## 1. Executive Overview

This document records the official division of responsibilities, assigned deliverables, and collaboration governance for our 5-member engineering team. In accordance with professional industry software development standards, each team member is assigned an essential pillar of the modern version control, code review, and DevOps lifecycle.

> [!NOTE]
> **Git Authentication Notice**: Per repository governance policies, all Git commits are authored and pushed using the authenticated Git identity (`Ranadeep Reddy Yasa`). Individual team member assignments and expected deliverables are formally documented below and tracked through dedicated feature branches, issue assignments, and pull request milestones.

---

## 2. Team Member Roster & Responsibilities

```
                                  +------------------------------------+
                                  |     RANADEEP YASA (Lead)           |
                                  | Roll No: 24WU0104081               |
                                  | Branching, PRs, Reviews & Conflicts|
                                  +-----------------+------------------+
                                                    |
             +----------------------+---------------+----------------------+----------------------+
             |                      |                                      |                      |
             v                      v                                      v                      v
+------------------------+ +------------------------+   +------------------------+ +------------------------+
|       G. DHARAN        | |      CH. RISHYANT      |   |       B. ABHINAV       | |   P. MUNESWAR REDDY    |
| Roll No: 24WU0102210   | | Roll No: 24WU0102213   |   | Roll No: 24WU0102224   | | Roll No: 24WU0101006   |
| Repo Mgmt & Intro      | | SCM, Commits & History |   | GitHub Issues & Triage | | Releases, CI/CD & Docs |
+------------------------+ +------------------------+   +------------------------+ +------------------------+
```

---

### Member 1: G. Dharan
- **Roll Number**: `24WU0102210`
- **Role**: Repository Administrator & Core Architecture Specialist
- **Assigned Area**: Project introduction, Git/GitHub fundamentals, repository management, and industry context.
- **Assigned Feature Branch**: `feature/repository-documentation`
- **Responsibilities**:
  1. Repository management, Git fundamentals, and architectural overview.
  2. Researching and synthesizing the industry context comparing centralized VCS (SVN, CVS) against distributed VCS (Git).
  3. Designing the repository governance model, directory layout standards, and licensing strategy (`LICENSE`).
  4. Authoring foundational architecture documentation (`docs/SYSTEM_ARCHITECTURE.md`) detailing the client-server interaction between React, Node.js, and database.
- **Expected Deliverables**:
  - `README.md` (Project introduction, problem statement, objectives, architecture).
  - `docs/TEAM_CONTRIBUTIONS.md` (Team charter & allocation).
  - `docs/SYSTEM_ARCHITECTURE.md` (System components, data flow, API contracts).
  - `LICENSE` (Open-source MIT License).

---

### Member 2: CH. Rishyant
- **Roll Number**: `24WU0102213`
- **Role**: Source Code Management & Version History Engineer
- **Assigned Area**: Git workflow, commits, source code management, and version history.
- **Assigned Feature Branch**: `feature/source-code-management`
- **Responsibilities**:
  1. Establishing version control conventions, atomic commit hygiene, and Conventional Commits (`feat:`, `fix:`, `docs:`, `ci:`).
  2. Structuring application source code into maintainable, modular components (`src/`, `server/`, `public/`).
  3. Configuring comprehensive `.gitignore` rules to shield credentials (`.env`), build artifacts (`dist/`), and dependencies (`node_modules/`).
  4. Authoring the collaborative Git workflow guide (`docs/GIT_WORKFLOW.md`), contrasting Trunk-Based Development with GitFlow.
- **Expected Deliverables**:
  - `docs/GIT_WORKFLOW.md` (Commit hygiene, branch models, command cheat-sheet).
  - Source code modularization and `.gitignore` configuration.
  - Automated architecture test suite (`tests/architecture.test.js`).

---

### Member 3: B. Abhinav
- **Roll Number**: `24WU0102224`
- **Role**: Quality Assurance & Bug Tracking Specialist
- **Assigned Area**: GitHub Issues, bug tracking, triage lifecycle, and branching concepts.
- **Assigned Feature Branch**: `feature/issues-and-bug-tracking`
- **Responsibilities**:
  1. Designing standardized issue report formats for defects and feature proposals.
  2. Creating GitHub community issue templates (`bug_report.md`, `feature_request.md`) with YAML frontmatter.
  3. Formulating an issue triage taxonomy including labels (`bug`, `enhancement`, `documentation`, `testing`, `priority: high`).
  4. Documenting issue-to-branch tracking and automated issue closing using keywords (`Fixes #123`, `Closes #456`).
- **Expected Deliverables**:
  - `.github/ISSUE_TEMPLATE/bug_report.md`
  - `.github/ISSUE_TEMPLATE/feature_request.md`
  - `docs/ISSUE_TRACKING_GUIDE.md` (Triage workflows, SLA guidelines, label dictionary).
  - Team contribution tests (`tests/teamContributions.test.js`).

---

### Member 4: Ranadeep Yasa
- **Roll Number**: `24WU0104081`
- **Role**: Team Lead & Code Review Architect
- **Assigned Area**: Branching workflow, Pull Requests, code review, and merge conflict management.
- **Assigned Feature Branch**: `feature/pull-requests-and-code-review`
- **Responsibilities**:
  1. Orchestrating repository branch protection rules and peer code review requirements.
  2. Designing the standardized Pull Request template (`.github/PULL_REQUEST_TEMPLATE.md`).
  3. Formulating peer review checklists, constructive feedback etiquette, and change request procedures in `docs/CODE_REVIEW_GUIDE.md`.
  4. Authoring a safe, step-by-step merge conflict simulation and 3-way resolution guide (`docs/MERGE_CONFLICT_GUIDE.md`).
  5. Authoring the open-source contributor guide (`CONTRIBUTING.md`).
- **Expected Deliverables**:
  - `.github/PULL_REQUEST_TEMPLATE.md`
  - `docs/CODE_REVIEW_GUIDE.md` (Review checklists, diff inspection standards).
  - `docs/MERGE_CONFLICT_GUIDE.md` (Safe reproduction and resolution guide).
  - `CONTRIBUTING.md` (Contributor agreement and contribution steps).

---

### Member 5: P. Muneswar Reddy
- **Roll Number**: `24WU0101006`
- **Role**: DevOps & Release Management Engineer
- **Assigned Area**: Release management, project documentation, benefits, challenges, and conclusion.
- **Assigned Feature Branch**: `feature/release-management`
- **Responsibilities**:
  1. Designing Semantic Versioning (SemVer 2.0.0: `MAJOR.MINOR.PATCH`) release workflows.
  2. Preparing the initial release notes for `v1.0.0` (`docs/RELEASE_NOTES.md`) and project `CHANGELOG.md`.
  3. Implementing the GitHub Actions automated Continuous Integration pipeline (`.github/workflows/ci.yml`) to validate linting, automated tests, and Vite builds.
  4. Synthesizing project conclusion, industry collaboration benefits, team retrospectives, and future enhancements.
- **Expected Deliverables**:
  - `.github/workflows/ci.yml` (CI pipeline for pull requests).
  - `docs/RELEASE_NOTES.md` (Formal v1.0.0 release notes).
  - `CHANGELOG.md` (Chronological history of features and fixes).
  - Automated CI test suites (`tests/githubWorkflows.test.js`, `tests/apiEndpoints.test.js`).

---

## 3. Team Governance & Review Matrix

| Deliverable Artifact | Primary Author | Peer Reviewer | Approving Lead |
| :--- | :--- | :--- | :--- |
| Architecture & Overview | G. Dharan | CH. Rishyant | Ranadeep Yasa |
| SCM & Git Workflow Guide | CH. Rishyant | B. Abhinav | Ranadeep Yasa |
| Issue Templates & Triage | B. Abhinav | P. Muneswar Reddy | Ranadeep Yasa |
| PR Templates & Conflict Demo | Ranadeep Yasa | G. Dharan | Ranadeep Yasa |
| Release Notes & CI Pipeline | P. Muneswar Reddy | Ranadeep Yasa | Ranadeep Yasa |

---

## 4. Verification & Audit Trail

| Verification Metric | Target Standard | Status |
| :--- | :--- | :--- |
| Commit Identity | Authenticated account (`Ranadeep Reddy Yasa`) | Verified |
| Branch Names | Follow standard prefix convention (`feature/<name>`) | Verified |
| PR Review Policy | Minimum 1 peer review checklist completion | Configured |
| CI Status | Automated tests & build passing on all PRs | Configured |


---

## 5. Verified Student-Wise Feature Branches & Pull Request Directory

All five student-wise feature branches have been created from `main`, verified with meaningful commits, and successfully pushed to the remote GitHub repository. Pull requests targeting `main` can be reviewed or opened using the direct links below:

| # | Student Name & Roll No. | Assigned Feature Branch | Commit SHA | Primary Artifacts & Files | GitHub Pull Request Link |
|:---:|:---|:---|:---:|:---|:---:|
| **1** | **G. Dharan**<br>`24WU0102210` | `feature/dharan-repository-documentation` | `7dc2fca` | `README.md`<br>`docs/PROJECT_OBJECTIVES.md`<br>`docs/PROJECT_INTRODUCTION.md`<br>`docs/TECHNOLOGY_STACK.md`<br>`docs/REPOSITORY_STRUCTURE.md` | [Create / View PR #1](https://github.com/ranadeepyasa/Student-Management-System/compare/main...feature/dharan-repository-documentation?expand=1) |
| **2** | **CH. Rishyant**<br>`24WU0102213` | `feature/rishyant-source-code-management` | `1060241` | `docs/SOURCE_CODE_MANAGEMENT.md`<br>`docs/GIT_COMMANDS_GUIDE.md`<br>`tests/sourceCodeManagement.test.js` | [Create / View PR #2](https://github.com/ranadeepyasa/Student-Management-System/compare/main...feature/rishyant-source-code-management?expand=1) |
| **3** | **B. Abhinav**<br>`24WU0102224` | `feature/abhinav-issues-and-bug-tracking` | `7da90ae` | `.github/ISSUE_TEMPLATE/bug_report.md`<br>`.github/ISSUE_TEMPLATE/feature_request.md`<br>`docs/GITHUB_ISSUES_LOG.md`<br>`docs/ISSUE_TRACKING_GUIDE.md`<br>`docs/BRANCHING_STRATEGY.md` | [Create / View PR #3](https://github.com/ranadeepyasa/Student-Management-System/compare/main...feature/abhinav-issues-and-bug-tracking?expand=1) |
| **4** | **Y. Ranadeep Reddy**<br>`24WU0104081` | `feature/ranadeep-pull-requests-code-review` | `6d39db4` | `.github/PULL_REQUEST_TEMPLATE.md`<br>`docs/PULL_REQUEST_GUIDE.md`<br>`docs/PULL_REQUEST_LIFECYCLE.md`<br>`docs/CODE_REVIEW_GUIDE.md`<br>`docs/MERGE_CONFLICT_GUIDE.md`<br>`CONTRIBUTING.md` | [Create / View PR #4](https://github.com/ranadeepyasa/Student-Management-System/compare/main...feature/ranadeep-pull-requests-code-review?expand=1) |
| **5** | **P. Muneswar Reddy**<br>`24WU0101006` | `feature/muneswar-release-management` | `e2070b5` | `CHANGELOG.md`<br>`docs/RELEASE_MANAGEMENT.md`<br>`docs/TESTING.md`<br>`docs/BENEFITS_AND_CHALLENGES.md`<br>`docs/FUTURE_SCOPE.md`<br>`docs/PROJECT_CONCLUSION.md`<br>`docs/RELEASE_NOTES_v1.0.0.md` | [Create / View PR #5](https://github.com/ranadeepyasa/Student-Management-System/compare/main...feature/muneswar-release-management?expand=1) |
