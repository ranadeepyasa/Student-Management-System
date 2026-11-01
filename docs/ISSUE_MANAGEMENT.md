# GitHub Issues & Defect Tracking Guidelines

**Project Title**: GitHub as an Industry Standard for Collaborative Software Development  
**Lead Contributor**: B. Abhinav (24WU0102224)  
**Repository**: [ranadeepyasa/Student-Management-System](https://github.com/ranadeepyasa/Student-Management-System)  

---

## 1. Defect Tracking Lifecycle

GitHub Issues provide a transparent, searchable record of defects, enhancements, and tasks. Our project enforces a five-stage lifecycle:

```
[ New Issue Created ]
         |
         v
  [ Triaged & Labeled ] ---> (Applied priority, component & type tags)
         |
         v
 [ Assigned to Member ] ---> (Branch created: feature/ or bugfix/)
         |
         v
 [ Pull Request Linked ] ---> ("Resolves #42")
         |
         v
  [ Closed & Verified ] ---> (Merged into main)
```

---

## 2. Issue Taxonomy & Label Dictionary

| Label | Color | Description |
| :--- | :--- | :--- |
| `bug` | `#d73a4a` | Something isn't working as expected or breaks functionality |
| `enhancement` | `#a2eeef` | New feature or improvement proposal |
| `documentation` | `#0075ca` | Improvements or additions to documentation or guides |
| `good first issue` | `#7057ff` | Good for newcomers or introductory academic tasks |
| `help wanted` | `#008672` | Extra attention is needed from team members |
| `priority: high` | `#b60205` | Blocks critical workflows; immediate resolution required |
| `priority: medium` | `#fbca04` | Important enhancement or bug affecting non-critical paths |
| `priority: low` | `#0e8a16` | Minor improvement or cosmetic modification |

---

## 3. Issue Templates

Our repository utilizes pre-configured issue templates located in `.github/ISSUE_TEMPLATE/`:
1. **Bug Report (`bug_report.md`)**:
   - Structured sections: Description, Steps to Reproduce, Expected vs Actual Behavior, Environment (OS, Node, Browser), and Screenshots.
2. **Feature Request (`feature_request.md`)**:
   - Structured sections: Problem Statement, Proposed Solution, Alternatives Considered, and Acceptance Criteria.

---

## 4. Closing Issues Automatically via Pull Requests

When a Pull Request addresses an open issue, link it using official GitHub closing keywords in the PR description:
- `Closes #1`
- `Fixes #2`
- `Resolves #3`

When the Pull Request is merged into the default branch (`main`), GitHub automatically closes the corresponding issue, maintaining a clean audit trail.
