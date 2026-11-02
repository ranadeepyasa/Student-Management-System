# Pull Request Lifecycle & Merge Protocol Manual

**Course Code:** 24TU05IT01 - Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project:** Student Management System  
**Lead Contributor:** Y. Ranadeep Reddy (`24WU0104081`)  
**Workstream:** Pull Requests, Code Review & Merge Conflict Management  

---

## 1. Overview of the Pull Request Model

A Pull Request (PR) is a formal mechanism to notify team members that a completed feature or bugfix branch is ready for integration into the main codebase. In industry-standard engineering, PRs protect the integrity of the production branch by enforcing:
- **Peer Code Review:** At least one authorized engineer must review and approve diffs.
- **Automated Verification:** All continuous integration (CI) tests and linting checks must pass.
- **Traceability:** PRs link directly to originating GitHub Issues and document design decisions.

---

## 2. Four Stages of the Pull Request Lifecycle

```
[ Stage 1: Proposed ] ----> [ Stage 2: Under Review ] ----> [ Stage 3: Revisions & Updates ] ----> [ Stage 4: Merged ]
   Developer pushes           Reviewer performs               Developer commits                 PR merged to main,
   branch & opens PR          diff inspection &               fixes & CI re-runs                branch deleted
                              leaves feedback
```

### Stage 1: Proposed (Opening a PR)
- Developer verifies all automated tests pass locally (`npm test`).
- Developer pushes feature branch: `git push origin feature/your-branch`.
- Developer opens PR on GitHub using `.github/PULL_REQUEST_TEMPLATE.md`:
  - Fills in Purpose, Implementation Summary, and Test Verification.
  - Completes the mandatory 6-point checklist.
  - Links relevant GitHub Issue (`Closes #2`).

### Stage 2: Under Review (Peer Code Inspection)
- Reviewer inspects the file diff tab.
- Reviewer verifies:
  1. Does the code follow project architectural boundaries?
  2. Are inputs validated and error paths handled?
  3. Are secrets and credentials protected?
  4. Are automated tests provided?
- Reviewer provides constructive, objective comments on specific code lines.

### Stage 3: Revisions & Updates
- If changes are requested, the author makes corrections locally.
- Author commits the fixes and pushes to the **same feature branch**:
  ```bash
  git add src/pages/StudentsPage.jsx
  git commit -m "fix(students): address review feedback on email uniqueness validation"
  git push origin feature/your-branch
  ```
- GitHub automatically appends the new commits to the existing PR thread and re-triggers CI builds.

### Stage 4: Merged & Closed
- Once approvals and CI checks are satisfied:
  - Lead engineer selects the merge strategy (Squash and Merge or Create a Merge Commit).
  - PR is marked `Merged`.
  - Feature branch is safely deleted from GitHub.

---

## 3. Merge Strategies Comparison

| Strategy | Git Command Equivalence | History Shape | Best Used For |
|---|---|---|---|
| **Merge Commit** | `git merge --no-ff feature` | Preserves all intermediate commits + 2-parent merge commit | Major architectural feature releases where granular historical commits are important. |
| **Squash and Merge** | `git merge --squash feature` | Condenses all feature branch commits into 1 clean commit on main | Feature branches with exploratory or messy intermediate commits. (Standard in this project) |
| **Rebase and Merge** | `git rebase main; git merge --ff-only` | Replays individual commits on top of main (linear history) | Strict linear git history policies without merge bubble commits. |

---

## 4. Conflict Resolution Rules

1. **Never Resolve Conflicts Blindly:** Understand both the upstream and local changes before accepting either side.
2. **Rebase or Merge Main into Feature Branch:**
   ```bash
   git checkout feature/your-branch
   git fetch origin
   git merge origin/main
   # Resolve markers in IDE, run tests, then commit
   git commit -m "merge: resolve merge conflicts with main"
   git push origin feature/your-branch
   ```
3. **Verify Locally:** Run `npm test` before concluding the merge.

---

## 5. Review Checklist for Approvers

- [ ] Does the branch name follow `feature/<student>-<feature-name>` convention?
- [ ] Are all commits atomic and descriptive with conventional commit prefixes?
- [ ] Are there any unhandled edge cases or regressions?
- [ ] Do automated tests cover newly introduced business logic?
- [ ] Does the UI strictly conform to the Orange & White design language?
