# Practical Demonstration: Git Merge Conflict Simulation & Resolution

**Project Title**: GitHub as an Industry Standard for Collaborative Software Development  
**Lead Contributor**: Ranadeep Yasa (24WU0104081)  
**Repository**: [ranadeepyasa/Student-Management-System](https://github.com/ranadeepyasa/Student-Management-System)  

---

## 1. Executive Summary

A merge conflict occurs in Git when two concurrent branches modify the **same line of the same file** in different ways, or when one branch modifies a file that another branch deletes. Git cannot automatically decide which version takes precedence, so it pauses the merge process and requests human intervention.

This document presents a **safe, isolated demonstration** of how merge conflicts occur in collaborative team environments and provides the exact terminal commands to diagnose, inspect, and resolve them without compromising the production application.

---

## 2. Anatomy of a Merge Conflict

When Git detects a conflict during `git merge` or `git pull`, it decorates the affected file with standard 3-way conflict markers:

```
<<<<<<< HEAD (Current Branch / Target)
const API_BASE_URL = 'https://api.production.school.edu/v1';
=======
const API_BASE_URL = 'https://api-gateway.internal.school.edu/v2';
>>>>>>> feature/update-endpoints (Incoming Branch)
```

- `<<<<<<< HEAD`: Marks the start of the conflict and contains changes from your currently checked-out branch.
- `=======`: Separates the two competing sets of changes.
- `>>>>>>> <branch-name>`: Marks the end of the conflict and identifies the incoming branch.

---

## 3. Step-by-Step Hands-On Reproduction (Safe Sandbox)

To demonstrate merge conflict resolution safely, developers can run this simulated workflow in a dedicated demonstration directory or scratch branch:

### Step 1: Create a Demo Workspace
```bash
# Create an isolated temporary test directory
mkdir git-conflict-demo
cd git-conflict-demo
git init
git branch -M main
```

### Step 2: Establish the Common Ancestor Commit
Create `config.js` with baseline content:
```javascript
// config.js
export const SYSTEM_CONFIG = {
  appName: 'Student Management System',
  maxUploadLimitMb: 10,
  defaultTheme: 'light',
};
```
Commit the baseline:
```bash
git add config.js
git commit -m "chore: initialize system config baseline"
```

### Step 3: Developer A Modifies config.js on a Feature Branch
```bash
git checkout -b feature/increase-upload-limit
```
Developer A edits `maxUploadLimitMb` to `25`:
```javascript
// config.js
export const SYSTEM_CONFIG = {
  appName: 'Student Management System',
  maxUploadLimitMb: 25,
  defaultTheme: 'light',
};
```
Commit on Developer A's branch:
```bash
git commit -am "feat: increase max file upload limit to 25MB for coursework submissions"
```

### Step 4: Developer B Modifies the Same Line on Main
Meanwhile, Developer B switches back to `main` and updates the same parameter to `50` for administrative exports:
```bash
git checkout main
```
Developer B edits `config.js`:
```javascript
// config.js
export const SYSTEM_CONFIG = {
  appName: 'Student Management System',
  maxUploadLimitMb: 50,
  defaultTheme: 'light',
};
```
Commit on `main`:
```bash
git commit -am "feat: increase upload limit to 50MB for bulk grade exports"
```

### Step 5: Trigger the Merge Conflict
Now attempt to merge `feature/increase-upload-limit` into `main`:
```bash
git merge feature/increase-upload-limit
```
**Expected Git Terminal Output**:
```
Auto-merging config.js
CONFLICT (content): Merge conflict in config.js
Automatic merge failed; fix conflicts and then commit the result.
```

---

## 4. Conflict Inspection & Diagnostics

When the conflict occurs, check the status:
```bash
git status
```
**Output**:
```
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
	both modified:   config.js
```

Inspect the exact diff causing the collision:
```bash
git diff
```

---

## 5. Resolution Procedure

### Method 1: Manual Resolution (Industry Standard)
1. Open `config.js` in your editor.
2. Discuss with the team to understand both requirements (coursework upload vs bulk export).
3. Synthesize a unified solution (e.g., establishing role-specific limits):
```javascript
// config.js
export const SYSTEM_CONFIG = {
  appName: 'Student Management System',
  studentUploadLimitMb: 25,
  adminUploadLimitMb: 50,
  defaultTheme: 'light',
};
```
4. Save the file without any `<<<<<<<`, `=======`, or `>>>>>>>` markers.
5. Mark the conflict as resolved:
```bash
git add config.js
```
6. Complete the merge commit:
```bash
git commit -m "merge: resolve upload limit conflict by differentiating student and admin quotas"
```

### Method 2: Aborting if Unsure
If unexpected conflicts occur in production and need further team coordination before proceeding:
```bash
git merge --abort
```
This safely rolls back the repository to the pristine state prior to the merge attempt.

---

## 6. Proactive Conflict Prevention Strategies

1. **Keep Feature Branches Short-Lived**: Merge frequently back into `main` rather than letting long-running branches drift for weeks.
2. **Rebase Frequently**: Regularly run `git fetch origin && git rebase origin/main` to absorb upstream changes early.
3. **Modular Code Organization**: Decompose monolithic files into smaller, single-responsibility modules so multiple developers rarely edit the same lines.
4. **Active Communication**: Announce major refactorings or shared schema adjustments to the team in advance.
