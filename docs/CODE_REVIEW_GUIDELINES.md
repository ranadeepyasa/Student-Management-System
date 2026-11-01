# Pull Request & Peer Code Review Guidelines

**Project Title**: GitHub as an Industry Standard for Collaborative Software Development  
**Lead Contributor**: Ranadeep Yasa (24WU0104081)  
**Repository**: [ranadeepyasa/Student-Management-System](https://github.com/ranadeepyasa/Student-Management-System)  

---

## 1. Principles of Effective Code Review

Code review is a cornerstone of collaborative software engineering. It ensures:
- **High Code Quality**: Detecting logical flaws, edge-case regressions, and security oversights before reaching production.
- **Shared Code Ownership**: Familiarizing multiple team members with different parts of the system.
- **Mentorship & Learning**: Providing constructive feedback and sharing idiomatic best practices.

---

## 2. Peer Review Checklist

Reviewers must inspect incoming Pull Requests against the following dimensions:

### A. Architectural & Design Integrity
- [ ] Does the change align with existing architecture and modular boundaries?
- [ ] Are dependencies minimized and justified?
- [ ] Does the implementation avoid unnecessary complexity or premature optimization?

### B. Functionality & Correctness
- [ ] Does the change solve the problem described in the linked issue?
- [ ] Are edge cases (null inputs, empty arrays, network dropouts) handled cleanly?
- [ ] Is error handling descriptive without leaking stack traces or sensitive info?

### C. Code Hygiene & Maintainability
- [ ] Are variable and function names self-documenting and semantic?
- [ ] Is dead, commented-out, or redundant code removed?
- [ ] Are existing comments and docstrings preserved unless specifically refactored?

### D. Security & Privacy
- [ ] Are all database queries parameterized to prevent SQL injection?
- [ ] Are no API tokens, secrets, or passwords hardcoded?
- [ ] Is input sanitized across API endpoints?

### E. Testing & CI Verification
- [ ] Have new automated unit or integration tests been included?
- [ ] Did the GitHub Actions CI pipeline pass with zero failures?
- [ ] Can the reviewer run the tests locally with `npm test` and verify passes?

---

## 3. Review Etiquette & Feedback Protocol

- **Be Respectful & Empathetic**: Critique the code, never the person.
- **Explain the "Why"**: Don't just say "Change this." Explain the potential bug, performance consequence, or edge case.
- **Differentiate Nitpicks**: Prefix non-blocking cosmetic comments with `nit:` so authors know what is optional.
- **Praise Good Work**: Acknowledge elegant algorithms, clean refactors, and thorough test suites!
