import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  GraduationCap,
  Building,
  Calendar,
  Mail,
  Phone,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';
import { useDevFlow } from '../context/DevFlowContext';
import { api } from '../services/api';

export const StudentsPage = () => {
  const {
    students,
    departments,
    createStudent,
    updateStudent,
    deleteStudent,
    refreshAllData,
    currentUser,
  } = useDevFlow();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortField, setSortField] = useState('student_id');
  const [sortDirection, setSortDirection] = useState('asc');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'Male',
    department_id: '1',
    course: 'B.Tech Computer Science & Engineering',
    year_of_study: '1',
    admission_date: new Date().toISOString().split('T')[0],
    gpa: '3.50',
    status: 'Active',
    address: '',
    emergency_contact: '',
  });

  // Filtered & Sorted Students
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        const matchesSearch =
          !searchTerm ||
          student.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.course?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept =
          !selectedDept ||
          student.department_name === selectedDept ||
          String(student.department_id) === String(selectedDept);

        const matchesYear =
          !selectedYear || String(student.year_of_study) === String(selectedYear);

        const matchesStatus = !selectedStatus || student.status === selectedStatus;

        return matchesSearch && matchesDept && matchesYear && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField] || '';
        let valB = b[sortField] || '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [students, searchTerm, selectedDept, selectedYear, selectedStatus, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setFormData({
      student_id: `24WU${Math.floor(1000000 + Math.random() * 9000000)}`,
      first_name: '',
      last_name: '',
      email: '',
      phone: '+91 ',
      gender: 'Male',
      department_id: departments[0]?.id ? String(departments[0].id) : '1',
      course: 'B.Tech Computer Science & Engineering',
      year_of_study: '1',
      admission_date: new Date().toISOString().split('T')[0],
      gpa: '3.75',
      status: 'Active',
      address: '',
      emergency_contact: '+91 ',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      student_id: student.student_id || '',
      first_name: student.first_name || '',
      last_name: student.last_name || '',
      email: student.email || '',
      phone: student.phone || '',
      gender: student.gender || 'Male',
      department_id: student.department_id ? String(student.department_id) : '1',
      course: student.course || '',
      year_of_study: String(student.year_of_study || 1),
      admission_date: student.admission_date || '',
      gpa: String(student.gpa || 3.5),
      status: student.status || 'Active',
      address: student.address || '',
      emergency_contact: student.emergency_contact || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.student_id.trim()) errors.student_id = 'Student ID is required';
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errors.email = 'Valid academic email is required';
    }
    if (!formData.course.trim()) errors.course = 'Course name is required';
    const gpaNum = parseFloat(formData.gpa);
    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0) {
      errors.gpa = 'GPA must be between 0.00 and 4.00';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedDeptObj = departments.find(
      (d) => String(d.id) === String(formData.department_id)
    );
    const payload = {
      ...formData,
      department_name: selectedDeptObj ? selectedDeptObj.name : 'Engineering',
      department_id: parseInt(formData.department_id, 10),
      year_of_study: parseInt(formData.year_of_study, 10),
      gpa: parseFloat(formData.gpa),
    };

    if (editingStudent) {
      await updateStudent(editingStudent.id, payload);
    } else {
      await createStudent(payload);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      await deleteStudent(studentToDelete.id);
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span> Active
          </span>
        );
      case 'Inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Inactive
          </span>
        );
      case 'Suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-300">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Suspended
          </span>
        );
      case 'Graduated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span> Graduated
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 bg-white text-slate-900 font-sans">
      {/* Top Header Banner (Clean Orange & White) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-orange-50/70 border border-orange-200 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
            <GraduationCap className="w-4 h-4 text-orange-600" /> Academic Administration
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Directory & Records</h1>
          <p className="text-sm text-slate-600 mt-1">
            Enterprise student management module with full CRUD operations, multi-parameter filtering, and real database persistence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => refreshAllData()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-slate-700 hover:text-orange-700 text-sm font-medium transition shadow-2xs"
            title="Reload student records"
          >
            <RefreshCw className="w-4 h-4 text-orange-600" /> Refresh
          </button>

          <a
            href={api.getExportCsvUrl()}
            download="students_report.csv"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-slate-700 hover:text-orange-700 text-sm font-medium transition shadow-2xs"
          >
            <Download className="w-4 h-4 text-orange-600" /> Export CSV
          </a>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-xs transition"
          >
            <UserPlus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Enrolled</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{students.length}</p>
        </div>
        <div className="bg-white border border-orange-200 rounded-xl p-3 text-center shadow-2xs">
          <span className="text-xs text-orange-600 font-medium">Active Students</span>
          <p className="text-xl font-bold text-orange-600 mt-0.5">
            {students.filter((s) => s.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Inactive</span>
          <p className="text-xl font-bold text-slate-600 mt-0.5">
            {students.filter((s) => s.status === 'Inactive').length}
          </p>
        </div>
        <div className="bg-white border border-orange-200 rounded-xl p-3 text-center shadow-2xs">
          <span className="text-xs text-orange-600 font-medium">Suspended</span>
          <p className="text-xl font-bold text-orange-600 mt-0.5">
            {students.filter((s) => s.status === 'Suspended').length}
          </p>
        </div>
        <div className="bg-white border border-orange-200 rounded-xl p-3 text-center shadow-2xs">
          <span className="text-xs text-orange-600 font-medium">Graduated</span>
          <p className="text-xl font-bold text-orange-600 mt-0.5">
            {students.filter((s) => s.status === 'Graduated').length}
          </p>
        </div>
        <div className="bg-white border border-orange-200 rounded-xl p-3 text-center shadow-2xs">
          <span className="text-xs text-orange-600 font-medium">Avg CGPA</span>
          <p className="text-xl font-bold text-orange-600 mt-0.5">
            {(
              students.reduce((acc, s) => acc + (parseFloat(s.gpa) || 3.5), 0) /
              (students.length || 1)
            ).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-orange-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student ID, name, email, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-orange-500"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.code} - {d.name}
              </option>
            ))}
          </select>

          {/* Academic Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-orange-500"
          >
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-orange-500"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
            <option value="Graduated">Graduated</option>
          </select>
        </div>
      </div>

      {/* Main Student Records Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-orange-50/70 border-b border-orange-100 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <tr>
                <th
                  onClick={() => handleSort('student_id')}
                  className="py-3.5 px-4 cursor-pointer hover:text-orange-700 transition"
                >
                  <div className="flex items-center gap-1.5">
                    Student ID <ArrowUpDown className="w-3 h-3 text-orange-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('first_name')}
                  className="py-3.5 px-4 cursor-pointer hover:text-orange-700 transition"
                >
                  <div className="flex items-center gap-1.5">
                    Full Name <ArrowUpDown className="w-3 h-3 text-orange-600" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Department & Course</th>
                <th
                  onClick={() => handleSort('year_of_study')}
                  className="py-3.5 px-4 cursor-pointer hover:text-orange-700 transition"
                >
                  <div className="flex items-center gap-1.5">
                    Year <ArrowUpDown className="w-3 h-3 text-orange-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('gpa')}
                  className="py-3.5 px-4 cursor-pointer hover:text-orange-700 transition"
                >
                  <div className="flex items-center gap-1.5">
                    CGPA <ArrowUpDown className="w-3 h-3 text-orange-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3.5 px-4 cursor-pointer hover:text-orange-700 transition"
                >
                  <div className="flex items-center gap-1.5">
                    Status <ArrowUpDown className="w-3 h-3 text-orange-600" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-orange-50/30 transition group"
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-orange-600">
                      <Link
                        to={`/students/${student.id}`}
                        className="hover:underline hover:text-orange-700 flex items-center gap-1.5"
                      >
                        {student.student_id}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {student.first_name} {student.last_name}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{student.email}</span>
                          {student.phone && <span>• {student.phone}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="text-slate-800 font-medium">
                          {student.department_name}
                        </div>
                        <div className="text-xs text-slate-500">{student.course}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 font-medium border border-slate-200">
                        Year {student.year_of_study}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-orange-600">
                        {parseFloat(student.gpa || 3.5).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(student.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/students/${student.id}`}
                          className="p-1.5 rounded hover:bg-orange-50 text-slate-500 hover:text-orange-600 transition"
                          title="View Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openEditModal(student)}
                          className="p-1.5 rounded hover:bg-orange-50 text-slate-500 hover:text-orange-600 transition"
                          title="Edit Student"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setStudentToDelete(student);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600 transition"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="w-12 h-12 text-slate-300 mb-3" />
                      <h3 className="text-base font-semibold text-slate-900">No students found</h3>
                      <p className="text-sm text-slate-500 max-w-sm mt-1">
                        No student records match the active search criteria or filters. Try adjusting your query or clear filters.
                      </p>
                      {(searchTerm || selectedDept || selectedYear || selectedStatus) && (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedDept('');
                            setSelectedYear('');
                            setSelectedStatus('');
                          }}
                          className="mt-4 px-3.5 py-1.5 text-xs rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition font-medium"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filteredStudents.length} of {students.length} total students</span>
          <span className="font-medium text-orange-700">Woxsen University Academic Database</span>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-orange-600" />
                {editingStudent ? `Edit Student: ${editingStudent.student_id}` : 'Register New Student'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono"
                    placeholder="e.g. 24WU0104081"
                  />
                  {formErrors.student_id && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.student_id}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="e.g. Ranadeep"
                  />
                  {formErrors.first_name && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="e.g. Yasa"
                  />
                  {formErrors.last_name && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.last_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="student@woxsen.edu.in"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="+91 94401 23456"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code} - {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Degree / Course Program *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="e.g. B.Tech Computer Science & Engineering"
                  />
                  {formErrors.course && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.course}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Year of Study
                  </label>
                  <select
                    value={formData.year_of_study}
                    onChange={(e) => setFormData({ ...formData, year_of_study: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="1">Year 1 (Freshman)</option>
                    <option value="2">Year 2 (Sophomore)</option>
                    <option value="3">Year 3 (Junior)</option>
                    <option value="4">Year 4 (Senior)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cumulative GPA (0.0 - 4.0)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  {formErrors.gpa && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.gpa}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admission Date
                  </label>
                  <input
                    type="date"
                    value={formData.admission_date}
                    onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="City, State, Country"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="Parent / Guardian phone number"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium border border-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-xs transition"
                >
                  {editingStudent ? 'Save Changes' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-slate-900">Confirm Removal</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Are you sure you want to delete the student record for{' '}
              <strong className="text-slate-900">
                {studentToDelete.first_name} {studentToDelete.last_name}
              </strong>{' '}
              ({studentToDelete.student_id})? This action will remove academic history and cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setStudentToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium border border-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-xs transition"
              >
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
