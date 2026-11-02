import pool from '../config/db.js';

// Get all departments with computed student counts
export const getAllDepartments = async (req, res, next) => {
  try {
    const [departments] = await pool.query(`
      SELECT d.*,
             (SELECT COUNT(*) FROM students s WHERE s.department_id = d.id OR s.department_name = d.name) as student_count,
             (SELECT COUNT(*) FROM students s WHERE (s.department_id = d.id OR s.department_name = d.name) AND s.status = 'Active') as active_student_count
      FROM departments d
      ORDER BY d.name ASC
    `);

    res.json({
      success: true,
      data: departments,
    });
  } catch (err) {
    next(err);
  }
};

// Get single department by ID
export const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM departments WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }

    const department = rows[0];

    // Fetch enrolled students
    const [students] = await pool.query(
      'SELECT id, student_id, first_name, last_name, email, course, year_of_study, status, gpa FROM students WHERE department_id = ? OR department_name = ? ORDER BY student_id ASC',
      [department.id, department.name]
    );

    res.json({
      success: true,
      data: {
        ...department,
        students,
        student_count: students.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Create a new department
export const createDepartment = async (req, res, next) => {
  try {
    const {
      code,
      name,
      head_of_department = '',
      email = '',
      phone = '',
      building = '',
      established_year = 2014,
    } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, error: 'Department code is required (e.g., CSE, AIDS)' });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Department name is required' });
    }

    // Check uniqueness
    const [existing] = await pool.query(
      'SELECT id, code, name FROM departments WHERE code = ? OR name = ?',
      [code.trim().toUpperCase(), name.trim()]
    );

    if (existing.length > 0) {
      if (existing[0].code.toUpperCase() === code.trim().toUpperCase()) {
        return res.status(409).json({ success: false, error: `Department code "${code.trim()}" already exists` });
      }
      return res.status(409).json({ success: false, error: `Department name "${name.trim()}" already exists` });
    }

    const insertSql = `
      INSERT INTO departments (code, name, head_of_department, email, phone, building, established_year)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(insertSql, [
      code.trim().toUpperCase(),
      name.trim(),
      head_of_department.trim(),
      email.trim(),
      phone.trim(),
      building.trim(),
      parseInt(established_year, 10) || 2014,
    ]);

    const [created] = await pool.query('SELECT * FROM departments WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Department registered successfully',
      data: created[0],
    });
  } catch (err) {
    next(err);
  }
};

// Update an existing department
export const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM departments WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }

    const current = existing[0];
    const {
      code = current.code,
      name = current.name,
      head_of_department = current.head_of_department,
      email = current.email,
      phone = current.phone,
      building = current.building,
      established_year = current.established_year,
    } = req.body;

    // Check duplicate code/name on other records
    const [duplicates] = await pool.query(
      'SELECT id FROM departments WHERE (code = ? OR name = ?) AND id != ?',
      [code.trim().toUpperCase(), name.trim(), id]
    );

    if (duplicates.length > 0) {
      return res.status(409).json({ success: false, error: 'Another department already uses this code or name' });
    }

    const updateSql = `
      UPDATE departments SET
        code = ?, name = ?, head_of_department = ?, email = ?,
        phone = ?, building = ?, established_year = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await pool.query(updateSql, [
      code.trim().toUpperCase(),
      name.trim(),
      head_of_department ? head_of_department.trim() : '',
      email ? email.trim() : '',
      phone ? phone.trim() : '',
      building ? building.trim() : '',
      parseInt(established_year, 10) || 2014,
      id,
    ]);

    // If name changed, update student denormalized department_name
    if (name.trim() !== current.name) {
      await pool.query('UPDATE students SET department_name = ? WHERE department_id = ?', [name.trim(), id]);
    }

    const [updated] = await pool.query('SELECT * FROM departments WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Department updated successfully',
      data: updated[0],
    });
  } catch (err) {
    next(err);
  }
};

// Safe delete department
export const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM departments WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }

    // Check if students are enrolled
    const [students] = await pool.query('SELECT COUNT(*) as count FROM students WHERE department_id = ?', [id]);
    const enrolledCount = students[0]?.count || 0;

    if (enrolledCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete department: ${enrolledCount} student(s) currently enrolled. Reassign or archive these students before deleting.`,
        enrolledCount,
      });
    }

    await pool.query('DELETE FROM departments WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Department ${existing[0].name} (${existing[0].code}) removed successfully`,
    });
  } catch (err) {
    next(err);
  }
};
