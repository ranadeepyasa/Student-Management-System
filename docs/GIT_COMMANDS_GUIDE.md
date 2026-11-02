# Git Commands & Developer Reference Manual

**Course Code:** 24TU05IT01 — Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project:** Student Management System  
**Lead Contributor:** CH. Rishyant (`24WU0102213`)  

---

## 1. Daily Development Workflow Commands

### 1.1 Repository Initialization & Synchronization
```bash
# Clone the remote project repository
git clone https://github.com/ranadeepyasa/Student-Management-System.git
cd Student-Management-System

# Check remote repository URL
git remote -v

# Fetch latest branch references from GitHub
git fetch origin

# Switch to main branch and update local workspace
git checkout main
git pull origin main
```

### 1.2 Feature Branching & Staging
```bash
# Create and switch to a dedicated feature branch
git checkout -b feature/your-feature-name main

# Verify current working branch and unstaged changes
git status

# Inspect unstaged line-by-line diffs
git diff

# Stage specific modified files
git add src/pages/StudentsPage.jsx server/controllers/studentController.js

# Stage all project changes (excluding .gitignore items)
git add -A

# Commit staged changes with conventional commit message
git commit -m "feat(students): implement multi-field search and academic filters"
```

### 1.3 Pushing Changes & Tracking
```bash
# Push branch to GitHub and establish upstream tracking
git push -u origin feature/your-feature-name

# Review the recent commit history with compact graph
git log --oneline --graph --decorate -10
```

---

## 2. Collaborative Code Review & Merge Operations

### 2.1 Keeping Feature Branches Updated with `main`
```bash
# Switch to main and pull latest verified commits
git checkout main
git pull origin main

# Switch back to your feature branch
git checkout feature/your-feature-name

# Merge main into your feature branch to verify compatibility
git merge main

# Run test suite to verify no regressions occurred
npm test
```

### 2.2 Reverting Accidental Staging or Commits
```bash
# Unstage a file without losing workspace modifications
git restore --staged path/to/file.js

# Discard local uncommitted changes in a specific file
git restore path/to/file.js

# Soft reset the latest local commit (keeps changes staged)
git reset --soft HEAD~1
```

---

## 3. Branch Verification Cheat Sheet

| Command | Action |
| :--- | :--- |
| `git branch -a` | Lists all local and remote tracking branches |
| `git status` | Displays working tree status and untracked files |
| `git log -3 --stat` | Shows the last 3 commits with file modification summaries |
| `git diff main...HEAD` | Shows differences between current branch and `main` base |
