import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  Plus,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useDevFlow } from '../context/DevFlowContext';

export const DepartmentsPage = () => {
  const {
    departments,
    students,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    showToast,
  } = useDevFlow();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    head_of_department: '',
    email: '',
    phone: '',
    building: '',
    established_year: 2014,
  });

  const openAddModal = () => {
    setEditingDept(null);
    setFormData({
      code: '',
      name: '',
      head_of_department: '',
      email: '',
      phone: '+91 ',
      building: 'Academic Block, Floor 2',
      established_year: 2014,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({
      code: dept.code,
      name: dept.name,
      head_of_department: dept.head_of_department || '',
      email: dept.email || '',
      phone: dept.phone || '',
      building: dept.building || '',
      established_year: dept.established_year || 2014,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      showToast('Department code and name are required', 'error');
      return;
    }

    if (editingDept) {
      await updateDepartment(editingDept.id, formData);
    } else {
      await createDepartment(formData);
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = (dept) => {
    const studentCount = students.filter(
      (s) => s.department_id === dept.id || s.department_name === dept.name
    ).length;

    if (studentCount > 0) {
      showToast(
        `Safety Guard: Cannot delete ${dept.name}. There are ${studentCount} students actively enrolled. Reassign them first.`,
        'error'
      );
      return;
    }

    setDeptToDelete(dept);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deptToDelete) {
      await deleteDepartment(deptToDelete.id);
      setIsDeleteModalOpen(false);
      setDeptToDelete(null);
    }
  };

  return (
    <div className="space-y-6 bg-white text-slate-900 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-orange-50/70 border border-orange-200 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
            <Building className="w-4 h-4 text-orange-600" /> Academic Organization
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Departments</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage academic divisions, faculties, designated buildings, and enrolled student capacity.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const enrolledStudents = students.filter(
            (s) => s.department_id === dept.id || s.department_name === dept.name
          );
          const activeStudents = enrolledStudents.filter((s) => s.status === 'Active');

          return (
            <div
              key={dept.id}
              className="bg-orange-50/50 border border-orange-200 rounded-2xl p-6 shadow-xs hover:border-orange-300 hover:bg-orange-50/80 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200 font-bold">
                      {dept.code}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2 leading-snug">
                      {dept.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(dept)}
                      className="p-1.5 rounded hover:bg-orange-50 text-slate-500 hover:text-orange-600 transition"
                      title="Edit Department"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(dept)}
                      className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600 transition"
                      title="Delete Department"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 my-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-orange-600" />
                    <span>Head: <strong className="text-slate-900">{dept.head_of_department || 'Dr. Faculty Lead'}</strong></span>
                  </div>
                  {dept.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-orange-600" />
                      <span>{dept.email}</span>
                    </div>
                  )}
                  {dept.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-orange-600" />
                      <span>{dept.phone}</span>
                    </div>
                  )}
                  {dept.building && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      <span>{dept.building}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-orange-600" />
                    <span>Established: {dept.established_year || 2014}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-500">Enrollment Capacity</span>
                  <span className="font-semibold text-orange-600">
                    {activeStudents.length} Active / {enrolledStudents.length} Total
                  </span>
                </div>

                <Link
                  to={`/students?dept=${encodeURIComponent(dept.name)}`}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-xs font-semibold text-orange-700 border border-orange-200 transition"
                >
                  View Enrolled Students ({enrolledStudents.length}) <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {editingDept ? `Edit Department: ${editingDept.code}` : 'Register New Department'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Department Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 uppercase font-mono focus:outline-none focus:border-orange-500"
                    placeholder="e.g. CSE"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Established Year
                  </label>
                  <input
                    type="number"
                    value={formData.established_year}
                    onChange={(e) => setFormData({ ...formData, established_year: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                  placeholder="e.g. Computer Science & Engineering"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Head of Department (HOD)
                </label>
                <input
                  type="text"
                  value={formData.head_of_department}
                  onChange={(e) => setFormData({ ...formData, head_of_department: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                  placeholder="e.g. Dr. Hemachandran K"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                    placeholder="hod.cse@woxsen.edu.in"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Building Location & Lab Complex
                </label>
                <input
                  type="text"
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                  placeholder="Academic Block A, 3rd Floor"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-xs"
                >
                  {editingDept ? 'Save Changes' : 'Confirm Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deptToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-slate-900">Delete Department?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Are you sure you want to remove the department <strong className="text-slate-900">{deptToDelete.name}</strong> ({deptToDelete.code})?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
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
