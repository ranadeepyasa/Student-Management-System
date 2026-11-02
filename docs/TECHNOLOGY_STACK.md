# Technology Stack & Toolchain Specification

**Course Code:** 24TU05IT01 — Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project:** Student Management System — Collaborative Development  
**Lead Contributor:** G. Dharan (`24WU0102210`)  

---

## 1. System Architecture Tiering

The Student Management System is architected as a decoupled, multi-tier full-stack application designed for high maintainability, low friction local development, and zero-configuration CI/CD testing.

```
+-------------------------------------------------------+
|                   Client Presentation Tier             |
|  React 18 + Vite 8 + Tailwind CSS + Recharts + Lucide |
+---------------------------+---------------------------+
                            | JSON / REST API (CORS)
+---------------------------v---------------------------+
|                   Application Server Tier              |
|   Node.js 24 + Express 4 + JWT + Helmet + Bcrypt.js   |
+---------------------------+---------------------------+
                            | Relational SQL Queries
+---------------------------v---------------------------+
|                   Data Persistence Tier                |
|   MySQL 8.0 (Production) / Node.js 24 SQLite (Local/CI)|
+-------------------------------------------------------+
```

---

## 2. Frontend Technology Stack

| Technology | Version | Purpose in Project |
| :--- | :--- | :--- |
| **React** | `^18.3.1` | Component-based UI rendering, state management, and declarative DOM updates. |
| **Vite** | `^8.3.5` | Next-generation frontend build tooling offering sub-second Hot Module Replacement (HMR). |
| **Tailwind CSS** | `^3.4.19` | Utility-first styling framework configured for a strictly Orange & White light theme. |
| **React Router** | `^7.18.5` | Client-side routing with deep-link navigation across dashboard, students, and departments. |
| **Recharts** | `^3.10.1` | Composable SVG data visualizations for department enrollments, student status, and GPA trends. |
| **Lucide React** | `^1.66.0` | Accessible, unified vector icons for navigation, data tables, and modal triggers. |

---

## 3. Backend Technology Stack

| Technology | Version | Purpose in Project |
| :--- | :--- | :--- |
| **Node.js** | `v20.x` to `v24.x` | Asynchronous JavaScript runtime environment powering server processes. |
| **Express.js** | `^4.21.2` | Fast, minimalist HTTP web framework managing REST routing and middleware. |
| **Bcrypt.js** | `^2.4.3` | One-way cryptographic password hashing using 10 salt rounds for administrator passwords. |
| **JSON Web Token (JWT)** | `^9.0.2` | Stateless authentication tokens securing administrative endpoints. |
| **Helmet** | `^8.0.0` | HTTP header security hardening against XSS, clickjacking, and MIME-type sniffing. |
| **Express Rate Limit** | `^7.5.0` | IP-based request rate limiting mitigating denial-of-service and brute force attempts. |
| **Morgan** | `^1.10.0` | Standardized HTTP request logger for debugging and API performance auditing. |

---

## 4. Database & Persistence Tier

The application uses an intelligent dual-engine persistence adapter (`server/config/db.js`):
1. **Primary Enterprise Engine (MySQL 8.x):**
   - Configured via `.env` variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`).
   - Uses connection pooling (`mysql2/promise`) for high-concurrency production deployments.
2. **Embedded Zero-Config Engine (Node.js 24 SQLite):**
   - Built directly into Node.js 24 (`node:sqlite`).
   - Employs Write-Ahead Logging (`PRAGMA journal_mode = WAL;`) and high concurrency timeouts (`PRAGMA busy_timeout = 10000;`).
   - Enables seamless automated testing on GitHub Actions and laptops without requiring a local MySQL daemon.

---

## 5. DevOps & CI/CD Toolchain

- **Git 2.x:** Distributed version control system tracking atomic commits and branch workstreams.
- **GitHub Actions:** Cloud CI runner executing automated test matrices across Node 20.x, 22.x, and 24.x on Ubuntu.
- **Node.js Native Test Runner:** Zero-dependency test harness executing 31 unit, integration, and security tests.
- **Semantic Versioning (SemVer 2.0.0):** Strict release tagging (`v1.0.0`) tracking features, fixes, and breaking changes.
