# Git Merge Conflict Simulation & Resolution Guide

**Course Code:** 24TU05IT01  
**Course Title:** Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project Title:** GitHub as an Industry Standard for Collaborative Software Development  
**Lead Contributor:** Y. Ranadeep Reddy (Roll Number: 24WU0104081)  
**Workstream:** Pull Requests, Code Review & Merge Conflict Management  

---

## 1. What is a Git Merge Conflict?

A **merge conflict** occurs in Git when two branches modify the **same line of code** in conflicting ways, or when one branch deletes a file that another branch is modifying. Because Git cannot automatically determine which developer's version is authoritative, it pauses the merge, inserts conflict markers into the file, and delegates resolution to the developer.

---

## 2. Step-by-Step Simulation Tutorial

To safely demonstrate this without disrupting production source code, we use a dedicated demonstration scenario.

### Step 1: Base State
Suppose a configuration file `demo/version-config.json` initially contains:
```json
{
  "systemName": "Student Management System",
  "apiVersion": "1.0.0",
  "environment": "development"
}
```

### Step 2: Developer A (Branch `feature/env-staging`) Changes Line 4
Developer A updates the environment to `"staging"`:
```json
{
  "systemName": "Student Management System",
  "apiVersion": "1.0.0",
  "environment": "staging"
}
```
*Commit: `chore(config): set staging environment`*

### Step 3: Developer B (Branch `feature/env-production`) Changes Line 4 Concurrently
Developer B updates the same line 4 to `"production"`:
```json
{
  "systemName": "Student Management System",
  "apiVersion": "1.0.0",
  "environment": "production"
}
```
*Commit: `chore(config): set production environment`*

### Step 4: Developer A Merges into `main` First
`feature/env-staging` is merged into `main` without conflict because `main` had not changed.

### Step 5: Developer B Attempts to Merge or Rebase on `main`
When Developer B runs:
```bash
git checkout feature/env-production
git fetch origin
git merge origin/main
```
Git halts the operation and outputs:
```text
Auto-merging demo/version-config.json
CONFLICT (content): Merge conflict in demo/version-config.json
Automatic merge failed; fix conflicts and then commit the result.
```

---

## 3. Inspecting Conflict Markers

When opening `demo/version-config.json`, Git has inserted standard 3-way conflict markers:

```json
{
  "systemName": "Student Management System",
  "apiVersion": "1.0.0",
<<<<<<< HEAD (Current change on feature/env-production)
  "environment": "production"
=======
  "environment": "staging"
>>>>>>> origin/main (Incoming change from main)
}
```

### Marker Anatomy:
- `<<<<<<< HEAD`: Marks the beginning of the local branch's changes.
- `=======`: The separator between local changes and incoming changes.
- `>>>>>>> origin/main`: Marks the end of the incoming changes from the target branch.

---

## 4. Resolving the Conflict

The developers consult and determine that the environment should support dynamic runtime switching or retain the intended production configuration.

1. **Edit the file to remove markers and combine the correct logic:**
```json
{
  "systemName": "Student Management System",
  "apiVersion": "1.0.0",
  "environment": "production",
  "fallbackEnvironment": "staging"
}
```

2. **Stage the resolved file:**
```bash
git add demo/version-config.json
```

3. **Verify status:**
```bash
git status
# Outputs: All conflicts fixed but you are still merging.
```

4. **Complete the merge commit:**
```bash
git commit -m "merge: resolve environment configuration conflict between staging and production"
```

5. **Push the resolved branch and complete Pull Request merge:**
```bash
git push origin feature/env-production
```

---

## 5. Golden Rules for Avoiding Unnecessary Conflicts

1. **Pull Frequently:** Rebase your feature branch on `origin/main` daily: `git pull --rebase origin main`.
2. **Keep Branches Short-Lived:** Merge small, cohesive units of work rather than keeping feature branches open for weeks.
3. **Communicate Cross-Dependencies:** Discuss shared configuration files or schemas during standup meetings.
