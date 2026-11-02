# Collaborative Git Workflow Standards & Version Control Guide

**Course Code:** 24TU05IT01  
**Course Title:** Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project Title:** GitHub as an Industry Standard for Collaborative Software Development  

---

## 1. Version Control Philosophy

In an industry software engineering context, version control is not merely a backup mechanism; it is the fundamental collaboration framework, compliance ledger, and quality audit trail.

This repository enforces **Trunk-Based Development with Short-Lived Feature Branches**:
- `main` serves as the single source of truth and represents stable, deployable software.
- Developers branch off `main` into short-lived feature branches (`feature/*`, `fix/*`, `docs/*`).
- Changes are integrated back into `main` exclusively through Pull Requests with automated CI validation and peer code review.

```text
main:  ●────────●────────●────────● (v1.0.0 Release Tagged)
        \      / \      / \      /
feat/docs:●──●  \  \    /   \    /
                 feat/scm:●   \  /
                               feat/issues:●
```

---

## 2. Branch Naming Standards

All branches must use descriptive, kebab-case identifiers prefixed with the workstream type:

| Prefix | Intended Purpose | Example |
| :--- | :--- | :--- |
| `feature/` | New user-facing modules or capabilities | `feature/student-search-filters` |
| `fix/` | Bug fixes and defect corrections | `fix/department-delete-constraint` |
| `docs/` | Technical documentation and architectural guides | `docs/repository-documentation` |
| `test/` | Automated test suite enhancements | `test/crud-validation-suite` |
| `ci/` | Continuous integration and release pipeline changes | `ci/github-actions-matrix` |

---

## 3. Atomic Commits & Conventional Commits

Commits must be **atomic** (representing a single logical change) and follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```text
<type>(<scope>): <imperative summary>

[optional detailed body]

[optional footer: Closes #issue_number]
```

### Commit Types:
- `feat`: Implementation of new feature or module.
- `fix`: Patch resolving a bug or defect.
- `docs`: Documentation updates.
- `refactor`: Internal code reorganization without changing external behavior.
- `test`: Adding or updating automated tests.
- `chore`: Dependency updates, tooling configuration, scripts.
- `ci`: Changes to GitHub Actions workflows.

---

## 4. Everyday Git Commands Quick Reference

### Starting a New Task:
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### Staging & Committing:
```bash
git status
git diff
git add <specific-files>
git commit -m "feat(student): add cumulative gpa validation filter"
```

### Syncing with Upstream:
```bash
git fetch origin
git rebase origin/main
```

### Pushing Branch:
```bash
git push -u origin feature/your-feature-name
```
