import React, { useState, useMemo } from 'react';
import {
  Users,
  Mail,
  GitCommit,
  FolderGit2,
  Edit,
  Trash2,
  UserPlus,
  Search,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { useDevFlow } from '../context/DevFlowContext';

const WORKSTREAM_OPTIONS = [
  'Branching Workflow & Code Review',
  'Git/GitHub Fundamentals & Repo Management',
  'Source Code Management & Commits',
  'Quality Assurance & Issue Tracking',
  'Release Management & CI/CD Pipelines',
  'Full Stack Engineering',
];

export const TeamPage = () => {
  const {
    teamMembers,
    updateTeamMember,
    addTeamMember,
    deleteTeamMember,
    showToast,
  } = useDevFlow();

  const [selectedDept, setSelectedDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    rollNumber: '',
    role: '',
    department: 'Branching Workflow & Code Review',
    email: '',
    status: 'online',
    commitsCount: 100,
    activeRepos: 3,
  });

  const departments = useMemo(() => {
    return ['all', ...Array.from(new Set(teamMembers.map((m) => m.department)))];
  }, [teamMembers]);

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((m) => {
      const matchesDept = selectedDept === 'all' || m.department === selectedDept;
      const matchesSearch =
        !searchQuery ||
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.handle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [teamMembers, selectedDept, searchQuery]);

  // Helper for clean initials monogram (No profile pictures)
  const getInitials = (name = '') => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      handle: member.handle || '',
      rollNumber: member.rollNumber || '',
      role: member.role || '',
      department: member.department || WORKSTREAM_OPTIONS[0],
      email: member.email || '',
      status: member.status || 'online',
      commitsCount: member.commitsCount || 0,
      activeRepos: member.activeRepos || 1,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.handle.trim()) {
      showToast('Name and GitHub handle are required', 'error');
      return;
    }
    updateTeamMember(editingMember.id, {
      ...formData,
      commitsCount: parseInt(formData.commitsCount, 10) || 0,
      activeRepos: parseInt(formData.activeRepos, 10) || 1,
    });
    setIsEditModalOpen(false);
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      handle: '',
      rollNumber: `24WU010${Math.floor(1000 + Math.random() * 9000)}`,
      role: 'Software Engineer',
      department: WORKSTREAM_OPTIONS[0],
      email: '',
      status: 'online',
      commitsCount: 25,
      activeRepos: 2,
    });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.handle.trim()) {
      showToast('Name and GitHub handle are required', 'error');
      return;
    }
    addTeamMember({
      ...formData,
      commitsCount: parseInt(formData.commitsCount, 10) || 0,
      activeRepos: parseInt(formData.activeRepos, 10) || 1,
    });
    setIsAddModalOpen(false);
  };

  const handleDeleteClick = (member) => {
    if (teamMembers.length <= 1) {
      showToast('Cannot delete the only team member profile.', 'error');
      return;
    }
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      deleteTeamMember(memberToDelete.id);
      setIsDeleteModalOpen(false);
      setMemberToDelete(null);
    }
  };

  return (
    <div className="space-y-6 bg-white text-slate-900 font-sans">
      <Breadcrumb items={[{ label: 'Team Members' }]} />

      {/* Top Banner (Orange & White Light Design) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-orange-50/70 border border-orange-200 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
            <Users className="w-4 h-4 text-orange-600" /> Academic Team & Profile Governance
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Engineering Team Members
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Active collaborators, role governance, assigned workstreams, and repository contribution metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-xs transition"
          >
            <UserPlus className="w-4 h-4" /> Add Collaborator
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-orange-50/60 border border-orange-200 rounded-xl p-3 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-orange-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, GitHub handle, or role..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium shrink-0">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-800 font-medium outline-none focus:border-orange-500 w-full sm:w-auto"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'all' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Team Cards Grid (Light Orange Shade Fill, Clean Monogram, No Pictures, No Switch Persona Buttons) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-orange-50/60 border border-orange-200 hover:border-orange-300 hover:bg-orange-50/90 rounded-2xl p-5 transition-all flex flex-col justify-between shadow-xs"
          >
            <div>
              {/* Header Row: Initials Monogram, Info, Status */}
              <div className="flex items-start gap-3.5">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-orange-600 text-white font-bold text-base flex items-center justify-center shadow-xs">
                    {getInitials(member.name)}
                  </div>
                  <span
                    title={`Status: ${member.status}`}
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-2 ring-white ${
                      member.status === 'online'
                        ? 'bg-orange-600'
                        : member.status === 'busy'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {member.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500 font-mono">@{member.handle}</span>
                    {member.rollNumber && (
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white text-orange-700 border border-orange-200 font-semibold shadow-2xs">
                        {member.rollNumber}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-orange-600 mt-1 line-clamp-1">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Email & Workstream Info */}
              <div className="mt-3.5 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <GraduationCap className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="truncate text-slate-700 font-medium">{member.department}</span>
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="mt-4 pt-3 border-t border-orange-200/60 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1 font-mono">
                  <FolderGit2 className="w-3.5 h-3.5 text-orange-600" />
                  <span>{member.activeRepos} repos</span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <GitCommit className="w-3.5 h-3.5 text-orange-600" />
                  <span>{member.commitsCount} commits</span>
                </div>
                <span className="text-[10px] bg-white border border-orange-200 px-2 py-0.5 rounded text-orange-800 font-medium">
                  {member.status}
                </span>
              </div>
            </div>

            {/* Action Row: Dedicated Manage Profile & Delete Options */}
            <div className="mt-4 pt-3 border-t border-orange-200/60 flex items-center gap-2">
              <button
                onClick={() => openEditModal(member)}
                className="flex-1 py-2 px-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                title="Manage and Edit Profile"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Manage Profile</span>
              </button>

              <button
                onClick={() => handleDeleteClick(member)}
                className="p-2 rounded-lg border border-orange-200 hover:border-red-300 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 transition shadow-2xs"
                title="Remove Profile"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No team profiles found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No profiles matched your search or department filter. Try clearing the query or adding a new collaborator.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('all');
            }}
            className="mt-4 px-3.5 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* EDIT / MANAGE PROFILE MODAL (Clean, No Photo Selectors) */}
      {isEditModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {getInitials(formData.name)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Manage Profile: {editingMember.name}
                  </h2>
                  <p className="text-xs text-slate-500">Edit collaborator credentials, roll number, and workstream</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-xs font-medium text-slate-900"
                    placeholder="e.g. Ranadeep Yasa"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GitHub Username *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">@</span>
                    <input
                      type="text"
                      required
                      value={formData.handle}
                      onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                      className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-xs font-mono text-slate-900"
                      placeholder="ranadeepyasa"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll Number / Student ID</label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-xs font-mono text-slate-900"
                    placeholder="24WU0104081"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-xs text-slate-900"
                    placeholder="student@woxsen.edu.in"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Engineering Role / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-xs text-slate-900 font-medium"
                  placeholder="e.g. Lead & Pull Requests Manager"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Workstream / Track *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-xs text-slate-900 bg-white"
                >
                  {WORKSTREAM_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-xs text-slate-900 bg-white"
                  >
                    <option value="online">Online</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Commits Count</label>
                  <input
                    type="number"
                    value={formData.commitsCount}
                    onChange={(e) => setFormData({ ...formData, commitsCount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Active Repos</label>
                  <input
                    type="number"
                    value={formData.activeRepos}
                    onChange={(e) => setFormData({ ...formData, activeRepos: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <Button variant="default" size="sm" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW MEMBER MODAL (Clean, No Photo Selectors) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-600" /> Register Collaborator Profile
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-xs font-medium text-slate-900"
                    placeholder="e.g. A. Sharma"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GitHub Username *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">@</span>
                    <input
                      type="text"
                      required
                      value={formData.handle}
                      onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                      className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-xs font-mono text-slate-900"
                      placeholder="asharma"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-xs font-mono text-slate-900"
                    placeholder="24WU0104999"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-xs text-slate-900"
                    placeholder="asharma@woxsen.edu.in"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role / Specialization *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-xs text-slate-900 font-medium"
                  placeholder="e.g. Cloud Infrastructure Engineer"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Workstream *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-xs text-slate-900 bg-white"
                >
                  {WORKSTREAM_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <Button variant="default" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Confirm Registration
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-slate-900">Remove Team Collaborator?</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-900">{memberToDelete.name}</strong> (@{memberToDelete.handle}) from the active engineering team roster?
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setMemberToDelete(null);
                }}
              >
                Cancel
              </Button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
