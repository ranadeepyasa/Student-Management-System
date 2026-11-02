import pool from '../config/db.js';

// Comprehensive Academic Dashboard Statistics
export const getStudentDashboardStats = async (req, res, next) => {
  try {
    // 1. Overall counts
    const [totalStudentsRows] = await pool.query('SELECT COUNT(*) as total FROM students');
    const [activeStudentsRows] = await pool.query("SELECT COUNT(*) as active FROM students WHERE status = 'Active'");
    const [inactiveStudentsRows] = await pool.query("SELECT COUNT(*) as inactive FROM students WHERE status = 'Inactive'");
    const [suspendedStudentsRows] = await pool.query("SELECT COUNT(*) as suspended FROM students WHERE status = 'Suspended'");
    const [graduatedStudentsRows] = await pool.query("SELECT COUNT(*) as graduated FROM students WHERE status = 'Graduated'");
    const [departmentsRows] = await pool.query('SELECT COUNT(*) as total FROM departments');
    const [avgGpaRows] = await pool.query('SELECT AVG(gpa) as avg_gpa FROM students');

    const totalStudents = totalStudentsRows[0]?.total || 0;
    const activeStudents = activeStudentsRows[0]?.active || 0;
    const inactiveStudents = inactiveStudentsRows[0]?.inactive || 0;
    const suspendedStudents = suspendedStudentsRows[0]?.suspended || 0;
    const graduatedStudents = graduatedStudentsRows[0]?.graduated || 0;
    const totalDepartments = departmentsRows[0]?.total || 0;
    const averageGpa = parseFloat(avgGpaRows[0]?.avg_gpa || 3.5).toFixed(2);

    // 2. Department-wise distribution
    const [departmentDistribution] = await pool.query(`
      SELECT COALESCE(d.name, s.department_name) as department,
             COALESCE(d.code, 'GEN') as code,
             COUNT(s.id) as student_count,
             SUM(CASE WHEN s.status = 'Active' THEN 1 ELSE 0 END) as active_count
      FROM students s
      LEFT JOIN departments d ON s.department_id = d.id
      GROUP BY department, code
      ORDER BY student_count DESC
    `);

    // 3. Year-wise distribution
    const [yearDistribution] = await pool.query(`
      SELECT year_of_study as year,
             COUNT(id) as count,
             SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_count
      FROM students
      GROUP BY year_of_study
      ORDER BY year_of_study ASC
    `);

    // 4. Status breakdown
    const [statusBreakdown] = await pool.query(`
      SELECT status, COUNT(id) as count
      FROM students
      GROUP BY status
    `);

    // 5. Recent student registrations (last 5)
    const [recentRegistrations] = await pool.query(`
      SELECT id, student_id, first_name, last_name, email, department_name, course, year_of_study, admission_date, status
      FROM students
      ORDER BY id DESC
      LIMIT 6
    `);

    res.json({
      success: true,
      data: {
        summary: {
          totalStudents,
          activeStudents,
          inactiveStudents,
          suspendedStudents,
          graduatedStudents,
          totalDepartments,
          averageGpa: parseFloat(averageGpa),
        },
        departmentDistribution,
        yearDistribution,
        statusBreakdown,
        recentRegistrations,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Department-wise detailed analytical report
export const getDepartmentReport = async (req, res, next) => {
  try {
    const [report] = await pool.query(`
      SELECT d.id, d.code, d.name, d.head_of_department, d.email, d.building,
             COUNT(s.id) as total_students,
             SUM(CASE WHEN s.status = 'Active' THEN 1 ELSE 0 END) as active_students,
             AVG(s.gpa) as avg_gpa
      FROM departments d
      LEFT JOIN students s ON s.department_id = d.id OR s.department_name = d.name
      GROUP BY d.id, d.code, d.name, d.head_of_department, d.email, d.building
      ORDER BY total_students DESC
    `);

    res.json({
      success: true,
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

// Year-wise detailed report
export const getYearReport = async (req, res, next) => {
  try {
    const [report] = await pool.query(`
      SELECT year_of_study,
             COUNT(id) as total_students,
             SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_students,
             SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) as inactive_students,
             AVG(gpa) as average_gpa
      FROM students
      GROUP BY year_of_study
      ORDER BY year_of_study ASC
    `);

    res.json({
      success: true,
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

// CSV Export of student directory
export const exportStudentsCsv = async (req, res, next) => {
  try {
    const [students] = await pool.query(`
      SELECT student_id, first_name, last_name, email, phone, gender,
             department_name, course, year_of_study, admission_date,
             gpa, status, address, emergency_contact
      FROM students
      ORDER BY student_id ASC
    `);

    const headers = [
      'Student ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Gender',
      'Department',
      'Course',
      'Year of Study',
      'Admission Date',
      'GPA',
      'Status',
      'Address',
      'Emergency Contact',
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = students.map((s) => [
      escapeCsv(s.student_id),
      escapeCsv(s.first_name),
      escapeCsv(s.last_name),
      escapeCsv(s.email),
      escapeCsv(s.phone),
      escapeCsv(s.gender),
      escapeCsv(s.department_name),
      escapeCsv(s.course),
      escapeCsv(s.year_of_study),
      escapeCsv(s.admission_date),
      escapeCsv(s.gpa),
      escapeCsv(s.status),
      escapeCsv(s.address),
      escapeCsv(s.emergency_contact),
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="students_report.csv"');
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};
