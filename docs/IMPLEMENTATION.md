# Implementation Details & Application Walkthrough

**Course Code:** 24TU05IT01  
**Course Title:** Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project Title:** GitHub as an Industry Standard for Collaborative Software Development  

---

## 1. Overview of Implemented Modules

This document details the complete technical implementation of all core application modules in the **Student Management System**, showing how business logic, database queries, and user interfaces are connected.

---

## 2. Authentication & Security Implementation

### Backend (`server/controllers/authController.js`)
- **Password Salting & Hashing:** Utilizes `bcryptjs` with 10 salt rounds to hash admin passwords before persistence. Plaintext passwords are never stored in the database.
- **JWT Token Generation:** Signs claims (`userId`, `username`, `email`, `role`) with a cryptographically secure secret and 7-day expiration.
- **Sanitized Response:** Strips `password_hash` from user objects before returning them to clients.
- **Authentication Guard (`server/middleware/auth.js`):** Intercepts requests, parses `Authorization: Bearer <token>`, verifies signature with `jwt.verify`, and attaches `req.user` to the request object.

### Frontend (`src/context/DevFlowContext.jsx` & `src/components/common/AuthModal.jsx`)
- Stores tokens securely in browser `localStorage`.
- Includes modal interface for admin credentials authentication and persona switching across the 5 student team roles.

---

## 3. Student Management CRUD Implementation

### A. Create Student (`POST /api/students`)
- **Validation Pipeline:**
  1. Checks non-empty `student_id`, `first_name`, `last_name`, `course`.
  2. Validates institutional email format (`@woxsen.edu.in`).
  3. Validates cumulative GPA range (`0.00` to `4.00`).
  4. Enforces database uniqueness on `student_id` and `email` (returns 409 Conflict if violated).
  5. Denormalizes `department_name` by looking up `department_id`.
- **Audit Logging:** Inserts an entry into `activity_logs` tracking the creation event.

### B. Read & Filter Students (`GET /api/students`)
- Supports dynamic SQL query composition:
  - Substring search: `(student_id LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)`.
  - Department filter: `(department_name = ? OR department_id = ?)`.
  - Academic year filter: `year_of_study = ?`.
  - Enrollment status filter: `status = ?`.
  - Sorting: Whitelisted column validation (`student_id`, `first_name`, `gpa`, `admission_date`) with direction (`ASC` / `DESC`).
  - Pagination: `LIMIT ? OFFSET ?` with computed `totalPages` metadata.

### C. Update Student (`PUT /api/students/:id`)
- Checks record existence (404 if missing).
- Ensures updated `student_id` or `email` does not collide with other students (`id != ?`).
- Updates fields and triggers `updated_at = CURRENT_TIMESTAMP`.

### D. Delete Student (`DELETE /api/students/:id`)
- Removes record from database.
- Records deletion in `activity_logs`.
- UI requires explicit confirmation through a two-step modal dialog.

---

## 4. Academic Department Management

### Referential Safety Constraint
To prevent orphaned student records, `server/controllers/departmentController.js` enforces a strict delete guard:
```javascript
const [students] = await pool.query('SELECT COUNT(*) as count FROM students WHERE department_id = ?', [id]);
const enrolledCount = students[0]?.count || 0;

if (enrolledCount > 0) {
  return res.status(400).json({
    success: false,
    error: `Cannot delete department: ${enrolledCount} student(s) currently enrolled. Reassign or archive these students before deleting.`,
    enrolledCount,
  });
}
```

---

## 5. Reporting & CSV Export Implementation

### RFC-4180 Compliant CSV Export (`/api/reports/export/students.csv`)
- Generates a downloadable CSV stream directly from the database:
```javascript
const escapeCsv = (val) => {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
};
```
- Sets headers:
  - `Content-Type: text/csv; charset=utf-8`
  - `Content-Disposition: attachment; filename="students_report.csv"`

---

## 6. Real-Time Collaboration & WebSockets

- Powered by `socket.io` (server) and `socket.io-client` (browser).
- Broadcasts real-time events (`student:new`, `student:updated`, `student:deleted`, `issue:new`, `pr:new`) across all connected browser tabs.
