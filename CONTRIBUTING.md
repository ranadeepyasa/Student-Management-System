# Contributing to Student Management System

Thank you for your interest in contributing to our academic Project Based Learning initiative! We welcome contributions that maintain industry-standard version control and code quality practices.

---

## 1. Code of Conduct & Academic Integrity

This project is built as an academic demonstration of collaborative software engineering. All participants are expected to uphold respectful, inclusive, and constructive communication in issues, pull request discussions, and code reviews.

---

## 2. Getting Started

1. **Fork or Clone**:
   ```bash
   git clone https://github.com/ranadeepyasa/Student-Management-System.git
   cd Student-Management-System
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Local Development**:
   ```bash
   npm run dev
   ```

---

## 3. Contribution Workflow

1. **Check Existing Issues**: Review open issues before starting work to avoid duplication.
2. **Branch from Main**:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```
3. **Commit with Conventional Commits**:
   Follow `<type>: <description>` format (e.g., `feat: add course enrollment view`, `fix: handle empty student search`).
4. **Run Tests Locally**:
   Ensure all tests pass and the production bundle compiles:
   ```bash
   npm test
   npm run build
   ```
5. **Submit a Pull Request**:
   - Push your feature branch: `git push -u origin feature/your-feature-name`
   - Open a PR targeting `main`.
   - Fill out all required sections in the Pull Request template.
   - Link any related issues (`Closes #<issue_number>`).
   - Await peer code review and CI verification.
