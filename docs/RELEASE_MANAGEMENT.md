# Release Management, Versioning & Tagging Guide

**Course Code:** 24TU05IT01 - Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project:** Student Management System  
**Lead Contributor:** P. Muneswar Reddy (`24WU0101006`)  
**Workstream:** Software Release Management, Versioning, CI/CD & Verification  

---

## 1. Release Engineering Objectives

In professional collaborative engineering, Release Management bridges software construction and production delivery. The primary goals are:
- Ensuring build reproducibility across environments.
- Enforcing semantic versioning (`vMAJOR.MINOR.PATCH`).
- Establishing strict gatekeeping criteria before artifacts are published or deployed.
- Maintaining an auditable changelog linked to GitHub tags and releases.

---

## 2. Semantic Versioning Specification (SemVer 2.0.0)

Given a version number `MAJOR.MINOR.PATCH`, increment the:
1. **MAJOR version** when you make incompatible API or architectural changes (e.g., transitioning from single-tier desktop to distributed cloud architecture).
2. **MINOR version** when you add functionality in a backward-compatible manner (e.g., adding CSV export, dark mode, or student bulk import).
3. **PATCH version** when you make backward-compatible bug fixes (e.g., fixing form validation or regex matching).

For our academic release:
- Baseline Release: `v1.0.0`
- Current Status: Stable production-ready baseline.

---

## 3. Git Tagging and Release Protocol

### 3.1 Annotated Tags
Annotated tags store the tagger name, email, date, and a cryptographic checksum message.

```bash
# Create annotated tag for release v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0: Student Management System & Collaborative GitHub Workflow"

# Verify tag signature and metadata
git show v1.0.0

# Push tag to upstream GitHub remote
git push origin v1.0.0
```

### 3.2 GitHub Releases
GitHub Releases package Git tags with binary build artifacts, release notes, and markdown changelogs:
1. Navigate to `Releases -> Draft a new release`.
2. Choose tag `v1.0.0`.
3. Release Title: `v1.0.0 - Production Baseline Release`.
4. Attach `dist/` production assets and link the corresponding milestone and pull requests.

---

## 4. Pre-Release Verification Checklist (Gatekeeper Quality Gates)

Before tagging and publishing any release, the following quality gates must pass 100%:

| Gate | Verification Command | Acceptance Standard | Status |
|---|---|---|---|
| **Automated Unit & Integration Tests** | `npm test` | 31/31 passing, 0 errors, 100% pass rate | PASSED |
| **Production Build Compilation** | `npm run build` | Zero syntax or bundling errors; outputs optimized bundle | PASSED |
| **Linting & Code Formatting** | `npm run lint` (or syntax audit) | Clean code, no unused imports or syntax violations | PASSED |
| **Documentation Completeness** | Manual audit | `README.md`, `CHANGELOG.md`, all 5 workstream guides present | PASSED |
| **Zero Security Vulnerabilities** | `npm audit` | 0 high/critical vulnerabilities in production dependencies | PASSED |

---

## 5. Rollback Strategy & Emergency Hotfix Protocol

In the event of a critical defect in production:
1. **Identify the Failing Commit:** Use `git bisect` or inspect error telemetry.
2. **Execute Revert:** Never rewrite published main history. Use `git revert <commit-sha>`.
3. **Hotfix Branch Creation:**
   ```bash
   git checkout -b hotfix/v1.0.1 main
   # Apply hotfix, verify with npm test
   git commit -m "fix: emergency hotfix for auth session expiry"
   git checkout main
   git merge hotfix/v1.0.1
   git tag -a v1.0.1 -m "Release v1.0.1: Emergency auth patch"
   git push origin main --tags
   ```
