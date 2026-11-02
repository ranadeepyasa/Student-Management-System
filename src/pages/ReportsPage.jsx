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

const ORANGE_SHADES = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];

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
        fill: ORANGE_SHADES[index % ORANGE_SHADES.length],
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
      { name: 'Active', value: activeStudents, color: '#ea580c' },
      { name: 'Inactive', value: inactiveStudents, color: '#94a3b8' },
      { name: 'Suspended', value: suspendedStudents, color: '#fb923c' },
      { name: 'Graduated', value: graduatedStudents, color: '#fdba74' },
    ].filter((item) => item.value > 0);
  }, [activeStudents, inactiveStudents, suspendedStudents, graduatedStudents]);

  return (
    <div className="space-y-6 bg-white text-slate-900 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-orange-50/70 border border-orange-200 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
            <BarChart3 className="w-4 h-4 text-orange-600" /> Academic Business Intelligence
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Reports & Analytics</h1>
          <p className="text-sm text-slate-600 mt-1">
            Comprehensive student enrollment trends, departmental analytics, and live CSV data exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={api.getExportCsvUrl()}
            download="students_report.csv"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-xs transition"
          >
            <Download className="w-4 h-4" /> Export Complete CSV Report
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>TOTAL ENROLLMENT</span>
            <Users className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalStudents}</div>
          <p className="text-xs text-slate-500 mt-1">Across {departments.length} academic departments</p>
        </div>

        <div className="bg-orange-100/60 border border-orange-300 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-orange-700 text-xs font-semibold uppercase tracking-wider">
            <span>ACTIVE RETENTION RATE</span>
            <CheckCircle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600 mt-2">
            {((activeStudents / (totalStudents || 1)) * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-slate-500 mt-1">{activeStudents} actively enrolled students</p>
        </div>

        <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>CAMPUS AVERAGE CGPA</span>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600 mt-2">{averageGpa}</div>
          <p className="text-xs text-slate-500 mt-1">Out of standard 4.00 grading scale</p>
        </div>

        <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>DEPARTMENTS & CENTERS</span>
            <Building className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{departments.length}</div>
          <p className="text-xs text-slate-500 mt-1">Under Woxsen School of Technology</p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution Bar Chart */}
        <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Students by Department</h3>
          <p className="text-xs text-slate-500 mb-4">Total enrolled vs actively attending students</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#fed7aa', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="students" fill="#ea580c" name="Total Students" radius={[4, 4, 0, 0]} />
                <Bar dataKey="active" fill="#fb923c" name="Active Students" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Student Status Composition</h3>
          <p className="text-xs text-slate-500 mb-4">Academic status breakdown across campus</p>

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
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#fed7aa', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cohort Distribution by Year */}
      <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">Enrollment Cohort by Academic Year</h3>
        <p className="text-xs text-slate-500 mb-4">Undergraduate cohort distribution across 4 academic levels</p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {yearData.map((y) => (
            <div key={y.year} className="bg-orange-50/40 border border-orange-100 rounded-xl p-4 text-center">
              <span className="text-xs text-orange-600 font-bold uppercase">{y.year}</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{y.total}</div>
              <div className="text-xs text-orange-700 mt-1 font-semibold">{y.active} active</div>
            </div>
          ))}
        </div>
      </div>

      {/* Department-Wise Summary Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-orange-50/50">
          <h3 className="text-base font-bold text-slate-900">Department-Wise Detailed Metric Report</h3>
          <span className="text-xs text-orange-700 font-medium">Database Generated Snapshot</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Department Name</th>
                <th className="py-3 px-4">Head of Department</th>
                <th className="py-3 px-4 text-center">Total Students</th>
                <th className="py-3 px-4 text-center">Active Enrolled</th>
                <th className="py-3 px-4 text-right">Avg GPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((dept) => {
                const enrolled = students.filter(
                  (s) => s.department_id === dept.id || s.department_name === dept.name
                );
                const active = enrolled.filter((s) => s.status === 'Active');
                const gpaAvg = enrolled.length
                  ? (enrolled.reduce((a, s) => a + (parseFloat(s.gpa) || 3.5), 0) / enrolled.length).toFixed(2)
                  : 'N/A';

                return (
                  <tr key={dept.id} className="hover:bg-orange-50/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-orange-600">{dept.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{dept.name}</td>
                    <td className="py-3 px-4 text-slate-600">{dept.head_of_department || 'Faculty Lead'}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">{enrolled.length}</td>
                    <td className="py-3 px-4 text-center font-bold text-orange-600">{active.length}</td>
                    <td className="py-3 px-4 text-right font-bold text-orange-600">{gpaAvg}</td>
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
