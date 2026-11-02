import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Building,
  TrendingUp,
  FolderGit2,
  GitBranch,
  GitPullRequest,
  AlertCircle,
  Tag,
  Download,
  ArrowRight,
  CheckCircle,
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
} from 'recharts';
import { useDevFlow } from '../context/DevFlowContext';
import { api } from '../services/api';

const ORANGE_SHADES = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'];

export const DashboardPage = () => {
  const {
    students,
    departments,
    branches,
    issues,
    pullRequests,
    releases,
  } = useDevFlow();

  // Metrics
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Active').length;
  const inactiveStudents = students.filter((s) => s.status === 'Inactive').length;
  const suspendedStudents = students.filter((s) => s.status === 'Suspended').length;
  const graduatedStudents = students.filter((s) => s.status === 'Graduated').length;
  const averageGpa = (
    students.reduce((acc, s) => acc + (parseFloat(s.gpa) || 3.5), 0) / (totalStudents || 1)
  ).toFixed(2);

  // Department enrollment chart data
  const deptData = useMemo(() => {
    return departments.map((dept, idx) => {
      const count = students.filter(
        (s) => s.department_id === dept.id || s.department_name === dept.name
      ).length;
      return {
        name: dept.code,
        fullName: dept.name,
        students: count,
        fill: ORANGE_SHADES[idx % ORANGE_SHADES.length],
      };
    });
  }, [departments, students]);

  // Status donut chart data
  const statusData = useMemo(() => {
    return [
      { name: 'Active', value: activeStudents, color: '#ea580c' },
      { name: 'Inactive', value: inactiveStudents, color: '#94a3b8' },
      { name: 'Suspended', value: suspendedStudents, color: '#fb923c' },
      { name: 'Graduated', value: graduatedStudents, color: '#fdba74' },
    ].filter((s) => s.value > 0);
  }, [activeStudents, inactiveStudents, suspendedStudents, graduatedStudents]);

  // Recent student registrations (last 5)
  const recentStudents = useMemo(() => {
    return [...students].reverse().slice(0, 5);
  }, [students]);

  return (
    <div className="space-y-6 bg-white text-slate-900">
      {/* Top Academic Project Banner (Orange & White Light Design) */}
      <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-orange-700 border border-orange-200 shadow-2xs">
              Woxsen University
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-orange-700 border border-orange-200 shadow-2xs">
              Course 24TU05IT01
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-600 text-white">
              Industry Excellence Track
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            GitHub as an Industry Standard for Collaborative Software Development
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-2 leading-relaxed">
            A production-ready Student Management System engineered collaboratively by a 5-member team using real GitHub branches, pull requests, automated CI/CD pipelines, code reviews, and release management.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Link
              to="/students"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold shadow-sm transition"
            >
              <Users className="w-4 h-4" /> Student Directory ({totalStudents})
            </Link>
            <Link
              to="/departments"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-orange-50 border border-orange-200 text-slate-800 text-sm font-medium transition"
            >
              <Building className="w-4 h-4 text-orange-600" /> Departments ({departments.length})
            </Link>
            <a
              href={api.getExportCsvUrl()}
              download="students_report.csv"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-orange-50 border border-orange-200 text-slate-800 text-sm font-medium transition"
            >
              <Download className="w-4 h-4 text-orange-600" /> Export CSV
            </a>
            <Link
              to="/pull-requests"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-orange-50 border border-orange-200 text-slate-800 text-sm font-medium transition"
            >
              <GitPullRequest className="w-4 h-4 text-orange-600" /> Pull Requests
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid (White Cards with Orange Highlights) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-5 shadow-xs hover:border-orange-300 hover:bg-orange-50/90 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Enrolled Students</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{totalStudents}</div>
          <div className="text-xs text-orange-600 mt-1 flex items-center gap-1 font-medium">
            <CheckCircle className="w-3.5 h-3.5" /> {activeStudents} actively attending
          </div>
        </div>

        {/* Departments */}
        <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-5 shadow-xs hover:border-orange-300 hover:bg-orange-50/90 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Academic Departments</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{departments.length}</div>
          <div className="text-xs text-slate-500 mt-1">Schools of Science & Tech</div>
        </div>

        {/* Average CGPA */}
        <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-5 shadow-xs hover:border-orange-300 hover:bg-orange-50/90 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Campus Average GPA</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-orange-600 mt-2">{averageGpa}</div>
          <div className="text-xs text-slate-500 mt-1">Scale 4.00 (Computed)</div>
        </div>

        {/* Git Workstreams */}
        <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-5 shadow-xs hover:border-orange-300 hover:bg-orange-50/90 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Git Workstream Branches</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <GitBranch className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{branches.length || 5}</div>
          <div className="text-xs text-orange-600 mt-1 font-medium">5 assigned team branches</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Enrollment Bar Chart */}
        <div className="lg:col-span-2 bg-orange-50/40 border border-orange-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Distribution by Department</h3>
              <p className="text-xs text-slate-500">Enrolled student headcount per academic division</p>
            </div>
            <Link
              to="/reports"
              className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
            >
              Full Analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#fed7aa', borderRadius: '8px', color: '#0f172a' }}
                />
                <Bar dataKey="students" name="Enrolled Students" radius={[4, 4, 0, 0]}>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Academic Status Donut */}
        <div className="bg-orange-50/40 border border-orange-200 rounded-2xl p-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Student Enrollment Status</h3>
          <p className="text-xs text-slate-500 mb-4">Active, Inactive, Suspended & Graduated</p>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#fed7aa', borderRadius: '8px', color: '#0f172a' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600">{item.name}:</span>
                <span className="font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Students & Recent Git Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Student Registrations */}
        <div className="bg-orange-50/40 border border-orange-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Student Registrations</h3>
              <p className="text-xs text-slate-500">Latest students added to university database</p>
            </div>
            <Link
              to="/students"
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
            >
              View All ({students.length}) →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentStudents.map((std) => (
              <div key={std.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                    {std.first_name?.[0]}{std.last_name?.[0]}
                  </div>
                  <div>
                    <Link
                      to={`/students/${std.id}`}
                      className="font-semibold text-slate-900 hover:text-orange-600 text-sm transition"
                    >
                      {std.first_name} {std.last_name}
                    </Link>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-orange-600 font-medium">{std.student_id}</span>
                      <span>•</span>
                      <span>{std.department_name}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      std.status === 'Active'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {std.status}
                  </span>
                  <div className="text-xs text-slate-500 mt-1">Year {std.year_of_study}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Collaborative Workflows Tracker */}
        <div className="bg-orange-50/40 border border-orange-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">GitHub Collaborative Workflows</h3>
              <p className="text-xs text-slate-500">Team branches, pull requests & CI/CD status</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> CI Passing
            </span>
          </div>

          <div className="space-y-3">
            <div className="bg-orange-50/30 border border-orange-100 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-orange-600" /> Team Workstream Branches
                </span>
                <Link to="/branches" className="text-orange-600 font-semibold hover:underline">
                  View Branches →
                </Link>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                5 dedicated branches representing team responsibilities (Docs, SCM, Issues, PRs, Releases).
              </p>
            </div>

            <div className="bg-orange-50/30 border border-orange-100 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-orange-600" /> Pull Request Triage
                </span>
                <Link to="/pull-requests" className="text-orange-600 font-semibold hover:underline">
                  View PRs →
                </Link>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Structured peer review checklists, code inspections, and merge conflict resolution guides.
              </p>
            </div>

            <div className="bg-orange-50/30 border border-orange-100 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-600" /> Release v1.0.0
                </span>
                <Link to="/releases" className="text-orange-600 font-semibold hover:underline">
                  Release Notes →
                </Link>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                SemVer tagged release with CHANGELOG, 31 automated tests, and production build verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
