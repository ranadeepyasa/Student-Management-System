# Git & GitHub Industry Workflow Standards

**Project Title**: GitHub as an Industry Standard for Collaborative Software Development  
**Lead Contributor**: CH. Rishyant (24WU0102213)  
**Repository**: [ranadeepyasa/Student-Management-System](https://github.com/ranadeepyasa/Student-Management-System)  

---

## 1. Industry Context & Collaboration Strategy

Modern software engineering organizations rely on distributed version control systems (DVCS) like Git to enable safe concurrent development across distributed teams. The core philosophy centers on **isolation, traceability, and continuous verification**:
- **Main is always deployable**: The `main` branch represents production-ready, passing code. Direct commits to `main` are restricted.
- **Short-lived feature branches**: All new capabilities, bug fixes, or documentation tasks originate from a dedicated branch created from `main`.
- **Peer review via Pull Requests**: Code changes must be reviewed and validated before merging.
- **Continuous Integration (CI)**: Automated checks run on every pull request to prevent regressions.

```
       (feature/source-code-management)
               o---o---o
              /         \  (Pull Request & Code Review)
---o---------o-----------o-----------------o---> main (Production)
    \                   /
     o---o-------------o
       (feature/repository-documentation)
```

---

## 2. Branching Naming Conventions

All branches must adhere to semantic prefixes reflecting their intent:

| Prefix | Usage | Example |
| :--- | :--- | :--- |
| `feature/` | New functional capability or enhancement | `feature/source-code-management` |
| `bugfix/` | Resolution of an identified software defect | `bugfix/fix-token-expiration` |
| `docs/` | Purely documentation updates or guides | `docs/update-architecture-diagram` |
| `refactor/` | Code structure change with no behavioral delta | `refactor/modularize-router` |
| `release/` | Release preparation, version bump & tags | `release/v1.0.0` |

---

## 3. Commit Message Hygiene (Conventional Commits)

Commits must follow the **Conventional Commits 1.0.0** specification:
```
<type>(<optional scope>): <short description in present tense>

[optional body explaining motivation and context]

[optional footer referencing issue numbers, e.g., Closes #12]
```

### Supported Types:
- `feat`: A new feature for the user or system
- `fix`: A bug fix
- `docs`: Documentation-only modifications
- `style`: Formatting, missing semicolons, no code changes
- `refactor`: Refactoring production code without changing behavior
- `test`: Adding missing tests or correcting existing tests
- `chore`: Maintenance tasks, dependencies, build scripts
- `ci`: Changes to CI/CD configuration files or scripts

### Examples:
- `docs: add project introduction and objectives`
- `feat: improve source code organization and modular layout`
- `docs: add issue tracking workflow and triage guidelines`
- `feat: add pull request contribution guidelines and checklist`
- `ci: configure automated test and build pipeline in GitHub Actions`

---

## 4. Standard Developer Workflow Walkthrough

### Step 1: Synchronize with Remote Main
```bash
git checkout main
git pull origin main
```

### Step 2: Create a Feature Branch
```bash
git checkout -b feature/my-feature-name
```

### Step 3: Implement Atomic Commits
```bash
git add <files>
git commit -m "feat: implement student attendance tracking module"
```

### Step 4: Rebase or Merge Latest Main
```bash
git fetch origin
git rebase origin/main
```

### Step 5: Push Branch & Open Pull Request
```bash
git push -u origin feature/my-feature-name
```
Navigate to GitHub or use `gh pr create` to submit a Pull Request targeting `main`.
