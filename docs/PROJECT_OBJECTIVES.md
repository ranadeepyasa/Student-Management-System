# Project Objectives & Academic Charter

**Course Code:** 24TU05IT01  
**Course Title:** Industry Excellence Track  
**Academic Institution:** Woxsen University, School of Technology  
**Project Title:** GitHub as an Industry Standard for Collaborative Software Development  
**Lead Repository:** [ranadeepyasa/Student-Management-System](https://github.com/ranadeepyasa/Student-Management-System)  

---

## 1. Academic Rationale & Curriculum Motivation

In modern software engineering, individual programming prowess is insufficient without mastery of collaborative infrastructure. Professional software organizations depend on distributed version control systems (VCS), automated Continuous Integration and Continuous Deployment (CI/CD) pipelines, structured code review protocols, and disciplined issue tracking to deliver scalable, reliable systems.

The **Industry Excellence Track (Course 24TU05IT01)** at Woxsen University was designed to bridge the chasm between textbook academic coding and industry-standard collaborative practices. This project demonstrates this transformation by utilizing GitHub as the operational backbone for developing an enterprise-grade **Student Management System**.

---

## 2. Core Educational Objectives

### A. Technical Competence in Version Control
1. **Mastery of Distributed VCS Principles:** Understanding Directed Acyclic Graphs (DAG), SHA-1 object models, working tree states, staging index, and remote synchronizations (`fetch`, `pull`, `push`).
2. **Branching Strategy Execution:** Practical implementation of feature-branch workflows, trunk-based integration, and branch protection rules.
3. **Merge Conflict Resolution:** Diagnosing 3-way merge conflicts (`ours`, `theirs`, `base`), understanding diff markers, and executing safe resolutions without regression.

### B. Full-Stack Software Engineering
1. **Architecture Decoupling:** Designing a modern client-server architecture using React 18, Vite, Node.js 24, and Express 4.
2. **Database Normalization & Constraints:** Implementing relational schemas with primary keys, unique constraints, foreign keys, and referential safety checks.
3. **Dual-Engine Persistence:** Developing a database adapter supporting both production MySQL 8.x and zero-dependency native SQLite (`node:sqlite`).
4. **Security & Authentication:** Implementing JWT token issuance, password salting/hashing (`bcryptjs`), CORS policies, and HTTP security headers (`helmet`).

### C. Quality Assurance & Continuous Integration
1. **Automated Unit & Integration Testing:** Authoring 31+ automated tests covering CRUD operations, security access control, referential integrity, and community templates.
2. **CI/CD Pipeline Construction:** Configuring automated GitHub Actions workflows triggered on pull requests and pushes across multi-version matrix environments (Node 20, 22, 24).
3. **Zero-Defect Release Standards:** Enforcing test pass gates and build verification before artifact release.

### D. Collaborative Governance & Peer Review
1. **Role Specialization:** Structuring a 5-member engineering team with designated workstreams and measurable accountability.
2. **Issue Triage & Lifecycle:** Utilizing standardized YAML templates and taxonomies for bugs, enhancements, and milestones.
3. **Code Review Protocols:** Practicing constructive peer code inspections, line-by-line diff analyses, and formal approval criteria.
4. **Semantic Release Management:** Implementing Semantic Versioning (`v1.0.0`) and maintaining comprehensive change histories (`CHANGELOG.md`).

---

## 3. Measurable Deliverables & Success Metrics

| Dimension | Target Metric | Achieved Status |
| :--- | :--- | :--- |
| **Working Application** | Complete Student Management System (CRUD, Depts, Reports, Auth) | **100% Implemented & Verified** |
| **Relational Database** | Dual-engine support (MySQL + SQLite) with full schema constraints | **100% Tested** |
| **Automated Tests** | >= 20 comprehensive unit & integration tests | **31 Tests Passing (100% Pass Rate)** |
| **CI Automation** | Multi-version GitHub Actions workflow (`ci.yml`) | **Configured & Validated** |
| **Team Branches** | 5 dedicated feature branches for team members | **Created & Documented** |
| **GitHub Issues** | 8 structured milestone issues with YAML templates | **Authored & Documented** |
| **Documentation** | 18 technical markdown guides covering all phases | **100% Complete** |
| **Release Management** | Stable `v1.0.0` release bundle with CHANGELOG | **Packaged & Tagged** |
