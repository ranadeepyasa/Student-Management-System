# Pull Request Workflow & Submission Guide

**Course Code:** 24TU05IT01  
**Course Title:** Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project Title:** GitHub as an Industry Standard for Collaborative Software Development  
**Lead Contributor:** Y. Ranadeep Reddy (Roll Number: 24WU0104081)  
**Workstream:** Pull Requests, Code Review & Merge Conflict Management  

---

## 1. Pull Request Lifecycle

In professional software development, a **Pull Request (PR)** is a formal proposal to merge a set of changes from a feature branch into the target integration branch (`main`). It serves as the primary forum for collaborative code review, discussion, automated CI validation, and quality enforcement.

```text
Feature Branch -> Push to GitHub -> Open PR -> Automated CI Runs -> Peer Review -> Lead Approval -> Merge to main
```

---

## 2. Standard Pull Request Template

Every PR must be created using the standardized `.github/PULL_REQUEST_TEMPLATE.md` checklist:

```markdown
## Description
Provide a clear, detailed overview of the feature, fix, or documentation added.

### Academic Context
- **Course:** 24TU05IT01 - Industry Excellence Track
- **Institution:** Woxsen University
- **Assigned Team Member:** [Name and Roll No]
- **Assigned Feature Workstream:** [Branch Name]

---

## Type of Change
- [ ] Bug fix
- [x] New feature
- [ ] Documentation update
- [ ] CI/CD / DevOps improvement

---

## Related Issue
Closes #2 (e.g., Closes #2 for Student CRUD operations)

---

## Implementation Details
- Detail changes to frontend React components.
- Detail changes to Express routes, controllers, or database schemas.

---

## Testing Evidence
- [x] Unit & Integration tests executed locally: `npm test`
- [x] Production build verified: `npm run build`

---

## Pull Request Checklist
- [x] Code follows project standards.
- [x] Changes have been tested.
- [x] No sensitive information is included.
- [x] Documentation is updated.
- [x] No unrelated files were modified.
- [x] Application functionality is preserved.
```

---

## 3. Pull Request Best Practices

1. **Keep Pull Requests Scoped:** A PR should address a single feature or bug. Avoid bundling unrelated modifications.
2. **Link the Associated Issue:** Always include keywords such as `Closes #IssueNumber` or `Fixes #IssueNumber` so GitHub can automatically link the issue and close it upon merging.
3. **Never Bypass CI:** If the GitHub Actions CI pipeline reports a failure, investigate the logs immediately and push a fix to your feature branch; the PR will automatically re-run the checks.
4. **Respond to Review Feedback:** When peer reviewers request changes, address their feedback by making new commits on your branch; never force-push over an active review discussion.
