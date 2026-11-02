# Code Review Guide & Demonstration Protocol

**Course Code:** 24TU05IT01  
**Course Title:** Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project Title:** GitHub as an Industry Standard for Collaborative Software Development  

---

## 1. Principles of Effective Code Review

Code review is a collaborative peer learning and quality assurance process. The primary objectives are:
1. **Defect Prevention:** Detecting logical bugs, security vulnerabilities, edge cases, and performance regressions before production.
2. **Architectural Consistency:** Ensuring compliance with project conventions, directory structures, and naming standards.
3. **Knowledge Transfer:** Sharing context across team members so no single person becomes a bottleneck.

---

## 2. Reviewer Checklist & Inspection Dimensions

When reviewing a Pull Request on GitHub, reviewers must systematically examine:

| Review Dimension | Questions to Ask |
| :--- | :--- |
| **Correctness** | Does the code fulfill the acceptance criteria defined in the linked issue? |
| **Security** | Are inputs sanitized? Are passwords securely hashed with `bcryptjs`? Are endpoints protected by JWT? |
| **Error Handling** | Are database connection errors caught gracefully? Are proper HTTP status codes returned (400, 401, 404, 409)? |
| **Testing** | Are new automated unit/integration tests added under `tests/`? Do all tests pass? |
| **Performance** | Are database queries optimized? Are database indexes utilized for frequent lookups? |
| **Readability** | Is code well-commented? Are variable and function names self-descriptive? |

---

## 3. Practical Code Review Demonstration Scenario

### Scenario: Reviewing Pull Request #2 ("feat: implement student CRUD operations")

#### Step 1: Inspecting the Diff
Reviewer navigates to the **Files changed** tab on GitHub and inspects the incoming diff in `server/controllers/studentController.js`:

```diff
+ export const createStudent = async (req, res, next) => {
+   try {
+     const { student_id, first_name, last_name, email, gpa } = req.body;
+     // Unvalidated GPA query
+     const [result] = await pool.query(
+       'INSERT INTO students (student_id, first_name, last_name, email, gpa) VALUES (?, ?, ?, ?, ?)',
+       [student_id, first_name, last_name, email, gpa]
+     );
```

#### Step 2: Providing Constructive Inline Comments
The reviewer clicks on the line for `gpa` and leaves a targeted comment:

> **Reviewer Comment (B. Abhinav - QA Specialist):**  
> *"Good implementation of the insert query! However, we need to enforce a validation check on `gpa` to ensure it falls within the standard 0.00 to 4.00 range. Currently, a negative number or value above 4.0 could be inserted into the database. Could you add validation before the query runs?"*

#### Step 3: Requesting Changes
The reviewer selects **Request changes** and provides a summary note:
> *"Great work overall! Requesting changes on the input validation for GPA and checking for duplicate student IDs. Once those validations are added, I will approve immediately."*

#### Step 4: Author Updating Code After Feedback
The PR author (`CH. Rishyant`) updates the controller to add boundary validation and pushes a new commit:
```diff
+     // Input validation added based on review feedback
+     const gpaNum = parseFloat(gpa);
+     if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0) {
+       return res.status(400).json({ success: false, error: 'GPA must be between 0.00 and 4.00' });
+     }
```

#### Step 5: Final Approval
The reviewer re-inspects the changes, verifies the automated CI check is green, and selects **Approve**:
> *"Thank you for adding the GPA validation and automated test! The changes look excellent. Approved for merge to main."*

#### Step 6: Merging After Approval
The lead developer merges the Pull Request using **Squash and Merge** or **Rebase and Merge**, preserving clean atomic history on `main`.
