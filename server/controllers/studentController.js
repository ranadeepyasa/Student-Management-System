import pool from '../config/db.js';

// Get all students with search, filter, sort, and pagination
export const getAllStudents = async (req, res, next) => {
  try {
    const {
      search = '',
      department = '',
      year = '',
      status = '',
      sortBy = 'student_id',
      order = 'ASC',
      page = 1,
      limit = 100,
    } = req.query;

    let whereClauses = [];
    let params = [];

    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereClauses.push('(student_id LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)');
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (department.trim()) {
      whereClauses.push('(department_name = ? OR department_id = ?)');
      params.push(department.trim(), department.trim());
    }

    if (year) {
      whereClauses.push('year_of_study = ?');
      params.push(parseInt(year, 10));
    }

    if (status.trim()) {
      whereClauses.push('status = ?');
      params.push(status.trim());
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Validate sort column to prevent injection
    const allowedSortCols = ['id', 'student_id', 'first_name', 'last_name', 'email', 'year_of_study', 'gpa', 'admission_date', 'status'];
    const safeSortBy = allowedSortCols.includes(sortBy) ? sortBy : 'student_id';
    const safeOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // Count total records
    const countSql = `SELECT COUNT(*) as total FROM students ${whereSql}`;
    const [countRows] = await pool.query(countSql, params);
    const totalRecords = countRows[0]?.total || 0;

    // Fetch records
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const selectSql = `
      SELECT id, student_id, first_name, last_name, email, phone, gender,
             department_id, department_name, course, year_of_study,
             admission_date, gpa, status, address, emergency_contact,
             created_at, updated_at
      FROM students
      ${whereSql}
      ORDER BY ${safeSortBy} ${safeOrder}
      LIMIT ? OFFSET ?
    `;

    const [students] = await pool.query(selectSql, [...params, parseInt(limit, 10), offset]);

    res.json({
      success: true,
      data: students,
      pagination: {
        total: totalRecords,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(totalRecords / parseInt(limit, 10)) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get single student by ID or student_id
export const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);

    const query = isNumeric
      ? 'SELECT * FROM students WHERE id = ?'
      : 'SELECT * FROM students WHERE student_id = ?';

    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Student record not found' });
    }

    const student = rows[0];

    // Fetch related department details if department_id exists
    let departmentDetails = null;
    if (student.department_id) {
      const [deptRows] = await pool.query('SELECT * FROM departments WHERE id = ?', [student.department_id]);
      if (deptRows.length > 0) {
        departmentDetails = deptRows[0];
      }
    }

    res.json({
      success: true,
      data: {
        ...student,
        departmentDetails,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Create a new student record
export const createStudent = async (req, res, next) => {
  try {
    const {
      student_id,
      first_name,
      last_name,
      email,
      phone = '',
      gender = 'Prefer not to say',
      department_id,
      department_name,
      course,
      year_of_study = 1,
      admission_date = new Date().toISOString().split('T')[0],
      gpa = 3.50,
      status = 'Active',
      address = '',
      emergency_contact = '',
    } = req.body;

    // Field Validations
    if (!student_id || !student_id.trim()) {
      return res.status(400).json({ success: false, error: 'Student ID is required' });
    }
    if (!first_name || !first_name.trim()) {
      return res.status(400).json({ success: false, error: 'First name is required' });
    }
    if (!last_name || !last_name.trim()) {
      return res.status(400).json({ success: false, error: 'Last name is required' });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email address is required' });
    }
    if (!course || !course.trim()) {
      return res.status(400).json({ success: false, error: 'Course name is required' });
    }

    // Check unique student_id and email
    const [existing] = await pool.query(
      'SELECT id, student_id, email FROM students WHERE student_id = ? OR email = ?',
      [student_id.trim(), email.trim()]
    );

    if (existing.length > 0) {
      if (existing[0].student_id === student_id.trim()) {
        return res.status(409).json({ success: false, error: `Student with ID "${student_id.trim()}" already exists` });
      }
      return res.status(409).json({ success: false, error: `Student with email "${email.trim()}" already exists` });
    }

    // Resolve department_name if department_id is given
    let resolvedDeptName = department_name || 'General Engineering';
    let resolvedDeptId = department_id ? parseInt(department_id, 10) : null;
    if (resolvedDeptId) {
      const [deptRows] = await pool.query('SELECT name FROM departments WHERE id = ?', [resolvedDeptId]);
      if (deptRows.length > 0) {
        resolvedDeptName = deptRows[0].name;
      }
    }

    const insertSql = `
      INSERT INTO students (
        student_id, first_name, last_name, email, phone, gender,
        department_id, department_name, course, year_of_study,
        admission_date, gpa, status, address, emergency_contact
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(insertSql, [
      student_id.trim(),
      first_name.trim(),
      last_name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      gender,
      resolvedDeptId,
      resolvedDeptName,
      course.trim(),
      parseInt(year_of_study, 10) || 1,
      admission_date,
      parseFloat(gpa) || 3.50,
      status,
      address.trim(),
      emergency_contact.trim(),
    ]);

    // Record activity log
    try {
      await pool.query(
        'INSERT INTO activity_logs (action_type, entity_type, entity_id, target_name, description) VALUES (?, ?, ?, ?, ?)',
        ['create', 'student', result.insertId, `${first_name.trim()} ${last_name.trim()}`, `Registered new student ${student_id.trim()}`]
      );
    } catch {
      // Non-blocking log
    }

    const [created] = await pool.query('SELECT * FROM students WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Student record created successfully',
      data: created[0],
    });
  } catch (err) {
    next(err);
  }
};

// Update an existing student
export const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Student record not found' });
    }

    const current = existing[0];
    const {
      student_id = current.student_id,
      first_name = current.first_name,
      last_name = current.last_name,
      email = current.email,
      phone = current.phone,
      gender = current.gender,
      department_id = current.department_id,
      department_name = current.department_name,
      course = current.course,
      year_of_study = current.year_of_study,
      admission_date = current.admission_date,
      gpa = current.gpa,
      status = current.status,
      address = current.address,
      emergency_contact = current.emergency_contact,
    } = req.body;

    // Check unique conflict on student_id or email
    const [duplicates] = await pool.query(
      'SELECT id, student_id, email FROM students WHERE (student_id = ? OR email = ?) AND id != ?',
      [student_id.trim(), email.trim(), id]
    );

    if (duplicates.length > 0) {
      if (duplicates[0].student_id === student_id.trim()) {
        return res.status(409).json({ success: false, error: `Student ID "${student_id.trim()}" is already assigned to another student` });
      }
      return res.status(409).json({ success: false, error: `Email "${email.trim()}" is already assigned to another student` });
    }

    let resolvedDeptName = department_name;
    let resolvedDeptId = department_id ? parseInt(department_id, 10) : null;
    if (resolvedDeptId && resolvedDeptId !== current.department_id) {
      const [deptRows] = await pool.query('SELECT name FROM departments WHERE id = ?', [resolvedDeptId]);
      if (deptRows.length > 0) {
        resolvedDeptName = deptRows[0].name;
      }
    }

    const updateSql = `
      UPDATE students SET
        student_id = ?, first_name = ?, last_name = ?, email = ?,
        phone = ?, gender = ?, department_id = ?, department_name = ?,
        course = ?, year_of_study = ?, admission_date = ?, gpa = ?,
        status = ?, address = ?, emergency_contact = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await pool.query(updateSql, [
      student_id.trim(),
      first_name.trim(),
      last_name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      gender,
      resolvedDeptId,
      resolvedDeptName,
      course.trim(),
      parseInt(year_of_study, 10),
      admission_date,
      parseFloat(gpa),
      status,
      address ? address.trim() : '',
      emergency_contact ? emergency_contact.trim() : '',
      id,
    ]);

    const [updated] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Student record updated successfully',
      data: updated[0],
    });
  } catch (err) {
    next(err);
  }
};

// Delete a student
export const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT id, student_id, first_name, last_name FROM students WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Student record not found' });
    }

    const student = existing[0];
    await pool.query('DELETE FROM students WHERE id = ?', [id]);

    // Record activity log
    try {
      await pool.query(
        'INSERT INTO activity_logs (action_type, entity_type, entity_id, target_name, description) VALUES (?, ?, ?, ?, ?)',
        ['delete', 'student', id, `${student.first_name} ${student.last_name}`, `Deleted student ${student.student_id}`]
      );
    } catch {
      // Non-blocking
    }

    res.json({
      success: true,
      message: `Student ${student.student_id} (${student.first_name} ${student.last_name}) removed successfully`,
    });
  } catch (err) {
    next(err);
  }
};
