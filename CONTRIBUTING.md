# Contributing to the Student Management System

Thank you for your interest in contributing to the **Student Management System** developed under Course `24TU05IT01` (Industry Excellence Track) at **Woxsen University**.

To maintain industry-grade engineering standards and seamless collaboration across our team, all contributors must adhere to the following workflow conventions.

---

## 1. Code of Conduct & Academic Integrity

- All code submitted must be original or properly attributed open-source software under compatible licenses.
- Respectful, constructive feedback is required during all code reviews and issue triage discussions.
- All team commits must be verified through automated CI before merging into `main`.

---

## 2. Collaborative Branching Workflow

We utilize a structured feature-branch workflow rooted in `main`:

```text
main (Protected, stable integration branch)
 ├── feature/repository-documentation    (G. Dharan - 24WU0102210)
 ├── feature/source-code-management      (CH. Rishyant - 24WU0102213)
 ├── feature/issues-and-bug-tracking     (B. Abhinav - 24WU0102224)
 ├── feature/pull-requests-and-code-review (Y. Ranadeep Reddy - 24WU0104081)
 └── feature/release-management          (P. Muneswar Reddy - 24WU0101006)
```

### Branch Naming Conventions:
- `feature/<kebab-case-name>`: For new capabilities or modules.
- `fix/<kebab-case-name>`: For bug fixes and patches.
- `docs/<kebab-case-name>`: For technical documentation updates.
- `test/<kebab-case-name>`: For unit or integration test additions.

---

## 3. Commit Message Hygiene (Conventional Commits)

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<scope>): <short description in present tense>

[optional body explaining motivation and technical details]

[optional footer referencing issue, e.g., Closes #12]
```

### Allowed Types:
- `feat`: A new feature or user-facing capability.
- `fix`: A bug fix or defect correction.
- `docs`: Documentation updates only.
- `style`: Formatting, missing semicolons, whitespace changes.
- `refactor`: Code refactoring without changing functionality.
- `test`: Adding or correcting automated tests.
- `chore`: Maintenance tasks, dependency bumps, tooling configs.
- `ci`: CI/CD workflow configuration updates.

---

## 4. Pull Request Standards & Quality Checklist

Before submitting a Pull Request targeting `main`:
1. Ensure your local branch is rebased on the latest `origin/main`.
2. Run the test suite: `npm test` and ensure all 31 tests pass.
3. Validate the production build: `npm run build`.
4. Ensure `.env` or credential files are never committed.
5. Fill out `.github/PULL_REQUEST_TEMPLATE.md` with:
   - Clear summary of changes.
   - Reference to associated GitHub Issue (e.g., `Closes #3`).
   - Test execution evidence.
   - Completed PR checklist.

---

## 5. Review & Approval Protocol

- Every PR requires at least one peer code review before integration.
- The repository administrator / Lead (`Ranadeep Yasa`) must sign off on merges to `main`.
- Direct pushes to `main` are strictly forbidden for untracked work.
