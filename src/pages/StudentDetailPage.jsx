import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Building,
  Mail,
  Phone,
  Calendar,
  Award,
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  ShieldAlert,
  CheckCircle,
  Clock,
  User,
  BookOpen,
} from 'lucide-react';
import { useDevFlow } from '../context/DevFlowContext';
import { api } from '../services/api';

export const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, departments, updateStudent, deleteStudent } = useDevFlow();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({});

  useEffect(() => {
    async function loadStudent() {
      setLoading(true);
      try {
        // Try API first
        const res = await api.getStudentById(id);
        if (res.success && res.data) {
          setStudent(res.data);
          setFormData(res.data);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to context
      }

      const found = students.find(
        (s) => String(s.id) === String(id) || s.student_id === id
      );
      if (found) {
        setStudent(found);
        setFormData(found);
      } else {
        setError('Student profile not found in academic records.');
      }
      setLoading(false);
    }

    loadStudent();
  }, [id, students]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!student) return;

    const selectedDeptObj = departments.find(
      (d) => String(d.id) === String(formData.department_id)
    );
    const payload = {
      ...formData,
      department_name: selectedDeptObj ? selectedDeptObj.name : student.department_name,
      department_id: parseInt(formData.department_id, 10),
      year_of_study: parseInt(formData.year_of_study, 10),
      gpa: parseFloat(formData.gpa),
    };

    await updateStudent(student.id, payload);
    setStudent({ ...student, ...payload });
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    if (!student) return;
    await deleteStudent(student.id);
    navigate('/students');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-slate-500 font-medium">Loading student profile record...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-lg mx-auto mt-12 shadow-xs">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-2">Student Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">{error || 'Unable to locate student profile.'}</p>
        <Link
          to="/students"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Student Directory
        </Link>
      </div>
    );
  }

  const deptInfo = departments.find(
    (d) => d.id === student.department_id || d.name === student.department_name
  );

  return (
    <div className="space-y-6 bg-white text-slate-900 font-sans">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-orange-600 transition">Dashboard</Link>
        <span>/</span>
        <Link to="/students" className="hover:text-orange-600 transition">Students</Link>
        <span>/</span>
        <span className="text-orange-600 font-medium font-mono">{student.student_id}</span>
      </div>

      {/* Main Profile Header Card (Pure White with Orange accents) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-orange-500"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
              {student.first_name?.[0]}{student.last_name?.[0]}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-slate-900">
                  {student.first_name} {student.last_name}
                </h1>
                <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200 font-semibold">
                  {student.student_id}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    student.status === 'Active'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : student.status === 'Suspended'
                      ? 'bg-orange-100 text-orange-800 border border-orange-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {student.status}
                </span>
              </div>

              <p className="text-sm text-slate-600 mt-1 flex items-center gap-2 font-medium">
                <span>{student.course}</span>
                <span>•</span>
                <span>Year {student.year_of_study}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-orange-600" /> {student.email}
                </span>
                {student.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-600" /> {student.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" /> Enrolled: {student.admission_date}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-xs transition"
            >
              <Edit className="w-4 h-4" /> Edit Profile
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-slate-200 text-sm font-medium transition"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Grid Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic Details */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-sm font-bold text-slate-900">
            <BookOpen className="w-4 h-4 text-orange-600" /> Academic Information
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Department</span>
              <span className="font-semibold text-slate-900">{student.department_name}</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Degree & Major</span>
              <span className="font-semibold text-slate-900">{student.course}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500 block">Academic Year</span>
                <span className="font-semibold text-slate-900">Year {student.year_of_study}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Cumulative GPA</span>
                <span className="text-lg font-bold text-orange-600">
                  {parseFloat(student.gpa || 3.5).toFixed(2)} / 4.00
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Academic Standing</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 font-semibold mt-1">
                <CheckCircle className="w-3.5 h-3.5 text-orange-600" /> Good Standing (Eligible for Honors)
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Personal Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-sm font-bold text-slate-900">
            <User className="w-4 h-4 text-orange-600" /> Personal & Contact Info
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Gender</span>
              <span className="font-semibold text-slate-900">{student.gender || 'Not specified'}</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Institutional Email</span>
              <span className="font-semibold text-slate-900">{student.email}</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Phone Number</span>
              <span className="font-semibold text-slate-900">{student.phone || 'None listed'}</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Permanent Address</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                {student.address || 'Hyderabad, Telangana, India'}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Emergency Contact</span>
              <span className="font-semibold text-slate-900">
                {student.emergency_contact || '+91 98480 11223'}
              </span>
            </div>
          </div>
        </div>

        {/* Department Information Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-sm font-bold text-slate-900">
            <Building className="w-4 h-4 text-orange-600" /> Affiliated Department
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Department Name</span>
              <span className="font-semibold text-slate-900">
                {deptInfo ? deptInfo.name : student.department_name}
              </span>
            </div>

            {deptInfo && (
              <>
                <div>
                  <span className="text-xs text-slate-500 block">Department Code</span>
                  <span className="font-mono font-bold text-orange-600">{deptInfo.code}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block">Head of Department (HOD)</span>
                  <span className="font-semibold text-slate-900">{deptInfo.head_of_department}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block">Department Building & Lab</span>
                  <span className="font-semibold text-slate-900">{deptInfo.building}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block">Contact Email</span>
                  <span className="font-semibold text-slate-900">{deptInfo.email}</span>
                </div>
              </>
            )}

            <div className="pt-2">
              <Link
                to="/departments"
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold underline"
              >
                View all department faculties & courses →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Student Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Edit Student Details</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name || ''}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name || ''}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Status</label>
                  <select
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={formData.gpa || ''}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-xs transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Student Record?</h3>
            <p className="text-sm text-slate-600 mb-4">
              Are you sure you want to remove <strong className="text-slate-900">{student.first_name} {student.last_name}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
