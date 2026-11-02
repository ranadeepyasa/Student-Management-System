import React, { useMemo } from 'react';
import {
  FileText,
  Download,
  BarChart3,
  PieChart as PieIcon,
  Users,
  GraduationCap,
  Building,
  TrendingUp,
  CheckCircle,
  Clock,
  Printer,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useDevFlow } from '../context/DevFlowContext';
import { api } from '../services/api';

const STATUS_COLORS = {
  Active: '#10b981',
  Inactive: '#64748b',
  Suspended: '#f59e0b',
  Graduated: '#3b82f6',
};

const DEPT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#10b981'];

export const ReportsPage = () => {
  const { students, departments, studentStats } = useDevFlow();

  // Metrics
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Active').length;
  const inactiveStudents = students.filter((s) => s.status === 'Inactive').length;
  const suspendedStudents = students.filter((s) => s.status === 'Suspended').length;
  const graduatedStudents = students.filter((s) => s.status === 'Graduated').length;
  const averageGpa = (
    students.reduce((acc, s) => acc + (parseFloat(s.gpa) || 3.5), 0) / (totalStudents || 1)
  ).toFixed(2);

  // Department Distribution data
  const deptData = useMemo(() => {
    return departments.map((dept, index) => {
      const deptStudents = students.filter(
        (s) => s.department_id === dept.id || s.department_name === dept.name
      );
      return {
        name: dept.code,
        fullName: dept.name,
        students: deptStudents.length,
        active: deptStudents.filter((s) => s.status === 'Active').length,
        fill: DEPT_COLORS[index % DEPT_COLORS.length],
      };
    });
  }, [departments, students]);

  // Year Distribution data
  const yearData = useMemo(() => {
    return [1, 2, 3, 4].map((year) => {
      const cohort = students.filter((s) => s.year_of_study === year);
      return {
        year: `Year ${year}`,
        total: cohort.length,
        active: cohort.filter((s) => s.status === 'Active').length,
      };
    });
  }, [students]);

  // Status breakdown data
  const statusData = useMemo(() => {
    return [
      { name: 'Active', value: activeStudents, color: STATUS_COLORS.Active },
      { name: 'Inactive', value: inactiveStudents, color: STATUS_COLORS.Inactive },
      { name: 'Suspended', value: suspendedStudents, color: STATUS_COLORS.Suspended },
      { name: 'Graduated', value: graduatedStudents, color: STATUS_COLORS.Graduated },
    ].filter((item) => item.value > 0);
  }, [activeStudents, inactiveStudents, suspendedStudents, graduatedStudents]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <BarChart3 className="w-4 h-4" /> Academic Business Intelligence
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Institutional Reports & Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">
            Comprehensive student enrollment trends, departmental analytics, and data exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={api.getExportCsvUrl()}
            download="students_report.csv"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition"
          >
            <Download className="w-4 h-4" /> Export Complete CSV Report
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>TOTAL ENROLLMENT</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{totalStudents}</div>
          <p className="text-xs text-slate-500 mt-1">Across {departments.length} academic departments</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>ACTIVE RETENTION RATE</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">
            {((activeStudents / (totalStudents || 1)) * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-slate-500 mt-1">{activeStudents} actively enrolled students</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>CAMPUS AVERAGE CGPA</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-2">{averageGpa}</div>
          <p className="text-xs text-slate-500 mt-1">Out of standard 4.00 grading scale</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>DEPARTMENTS & CENTERS</span>
            <Building className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{departments.length}</div>
          <p className="text-xs text-slate-500 mt-1">Under Woxsen School of Technology</p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-white mb-1">Students by Department</h3>
          <p className="text-xs text-slate-400 mb-4">Total enrolled vs actively attending students</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="students" fill="#6366f1" name="Total Students" radius={[4, 4, 0, 0]} />
                <Bar dataKey="active" fill="#10b981" name="Active Students" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-white mb-1">Student Status Composition</h3>
          <p className="text-xs text-slate-400 mb-4">Academic status breakdown across campus</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  fontSize={11}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cohort Distribution by Year */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-bold text-white mb-1">Enrollment Cohort by Academic Year</h3>
        <p className="text-xs text-slate-400 mb-4">Undergraduate cohort distribution across 4 academic levels</p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {yearData.map((y) => (
            <div key={y.year} className="bg-slate-950/60 border border-slate-800 rounded-lg p-4 text-center">
              <span className="text-xs text-indigo-400 font-bold uppercase">{y.year}</span>
              <div className="text-2xl font-bold text-white mt-1">{y.total}</div>
              <div className="text-xs text-emerald-400 mt-1 font-medium">{y.active} active</div>
            </div>
          ))}
        </div>
      </div>

      {/* Department-Wise Summary Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Department-Wise Detailed Metric Report</h3>
          <span className="text-xs text-slate-400">Database Generated Snapshot</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Department Name</th>
                <th className="py-3 px-4">Head of Department</th>
                <th className="py-3 px-4 text-center">Total Students</th>
                <th className="py-3 px-4 text-center">Active Enrolled</th>
                <th className="py-3 px-4 text-right">Avg GPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {departments.map((dept) => {
                const enrolled = students.filter(
                  (s) => s.department_id === dept.id || s.department_name === dept.name
                );
                const active = enrolled.filter((s) => s.status === 'Active');
                const gpaAvg = enrolled.length
                  ? (enrolled.reduce((a, s) => a + (parseFloat(s.gpa) || 3.5), 0) / enrolled.length).toFixed(2)
                  : 'N/A';

                return (
                  <tr key={dept.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">{dept.code}</td>
                    <td className="py-3 px-4 font-medium text-white">{dept.name}</td>
                    <td className="py-3 px-4 text-slate-400">{dept.head_of_department || 'Faculty Lead'}</td>
                    <td className="py-3 px-4 text-center font-semibold text-white">{enrolled.length}</td>
                    <td className="py-3 px-4 text-center font-semibold text-emerald-400">{active.length}</td>
                    <td className="py-3 px-4 text-right font-semibold text-purple-400">{gpaAvg}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
