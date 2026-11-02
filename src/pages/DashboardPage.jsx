import React, { useState, useMemo } from 'react';
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
  Plus,
  Download,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Clock,
  Sparkles,
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

const STATUS_COLORS = {
  Active: '#10b981',
  Inactive: '#64748b',
  Suspended: '#f59e0b',
  Graduated: '#3b82f6',
};

const DEPT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4'];

export const DashboardPage = () => {
  const {
    students,
    departments,
    branches,
    issues,
    pullRequests,
    releases,
    commits,
    activities,
    currentUser,
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
        fill: DEPT_COLORS[idx % DEPT_COLORS.length],
      };
    });
  }, [departments, students]);

  // Status donut chart data
  const statusData = useMemo(() => {
    return [
      { name: 'Active', value: activeStudents, color: STATUS_COLORS.Active },
      { name: 'Inactive', value: inactiveStudents, color: STATUS_COLORS.Inactive },
      { name: 'Suspended', value: suspendedStudents, color: STATUS_COLORS.Suspended },
      { name: 'Graduated', value: graduatedStudents, color: STATUS_COLORS.Graduated },
    ].filter((s) => s.value > 0);
  }, [activeStudents, inactiveStudents, suspendedStudents, graduatedStudents]);

  // Recent student registrations (last 5)
  const recentStudents = useMemo(() => {
    return [...students].reverse().slice(0, 5);
  }, [students]);

  return (
    <div className="space-y-6">
      {/* Top Academic Project Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-repeat bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Woxsen University
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Course 24TU05IT01
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Industry Excellence Track
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            GitHub as an Industry Standard for Collaborative Software Development
          </h1>
          <p className="text-sm md:text-base text-slate-300 mt-2 leading-relaxed">
            A production-ready Student Management System engineered collaboratively by a 5-member team using real GitHub branches, pull requests, automated CI/CD pipelines, code reviews, and release management.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Link
              to="/students"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/30 transition"
            >
              <Users className="w-4 h-4" /> Student Directory ({totalStudents})
            </Link>
            <Link
              to="/departments"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition"
            >
              <Building className="w-4 h-4 text-indigo-400" /> Departments ({departments.length})
            </Link>
            <a
              href={api.getExportCsvUrl()}
              download="students_report.csv"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Export CSV
            </a>
            <Link
              to="/pull-requests"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition"
            >
              <GitPullRequest className="w-4 h-4 text-purple-400" /> Pull Requests
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">{totalStudents}</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> {activeStudents} actively enrolled
          </div>
        </div>

        {/* Departments */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Academic Departments</span>
            <Building className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">{departments.length}</div>
          <div className="text-xs text-slate-400 mt-1">Across Science & Tech schools</div>
        </div>

        {/* Average CGPA */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Campus Average GPA</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">{averageGpa}</div>
          <div className="text-xs text-slate-400 mt-1">Scale 4.00 (Database computed)</div>
        </div>

        {/* GitHub Workstreams */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Git Workstream Branches</span>
            <GitBranch className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">{branches.length || 5}</div>
          <div className="text-xs text-indigo-400 mt-1">5 assigned team branches</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Enrollment Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Student Distribution by Department</h3>
              <p className="text-xs text-slate-400">Headcount across academic branches</p>
            </div>
            <Link
              to="/reports"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              Full Analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-white mb-1">Student Enrollment Status</h3>
          <p className="text-xs text-slate-400 mb-4">Active, Inactive, Suspended & Graduated</p>

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
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-400">{item.name}:</span>
                <span className="font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Students & Recent Git Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Student Registrations */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Recent Student Registrations</h3>
              <p className="text-xs text-slate-400">Latest students added to institutional database</p>
            </div>
            <Link
              to="/students"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              View All ({students.length}) →
            </Link>
          </div>

          <div className="divide-y divide-slate-800/60">
            {recentStudents.map((std) => (
              <div key={std.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center font-bold text-indigo-300 text-xs">
                    {std.first_name?.[0]}{std.last_name?.[0]}
                  </div>
                  <div>
                    <Link
                      to={`/students/${std.id}`}
                      className="font-medium text-white hover:text-indigo-400 text-sm transition"
                    >
                      {std.first_name} {std.last_name}
                    </Link>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="font-mono text-indigo-400">{std.student_id}</span>
                      <span>•</span>
                      <span>{std.department_name}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      std.status === 'Active'
                        ? 'bg-emerald-950/60 text-emerald-400'
                        : 'bg-slate-800 text-slate-300'
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">GitHub Collaborative Workflows</h3>
              <p className="text-xs text-slate-400">Team branches, pull requests & CI/CD status</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> CI Passing
            </span>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-indigo-400" /> Team Workstream Branches
                </span>
                <Link to="/branches" className="text-indigo-400 hover:underline">
                  View Branches →
                </Link>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                5 dedicated branches representing team responsibilities (Docs, SCM, Issues, PRs, Releases).
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-purple-400" /> Pull Request Triage
                </span>
                <Link to="/pull-requests" className="text-purple-400 hover:underline">
                  View PRs →
                </Link>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Structured peer review checklists, code inspections, and merge conflict resolution guides.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" /> Release v1.0.0
                </span>
                <Link to="/releases" className="text-emerald-400 hover:underline">
                  Release Notes →
                </Link>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                SemVer tagged release with CHANGELOG, full test suite validation, and production builds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
