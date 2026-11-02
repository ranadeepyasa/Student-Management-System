import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Building,
  BarChart3,
  FolderGit2,
  AlertCircle,
  GitBranch,
  GitPullRequest,
  CheckCircle2,
  Tag,
  Users,
  Activity,
  Settings,
  X,
  BookOpen,
} from 'lucide-react';
import { useDevFlow } from '../../context/DevFlowContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { students, departments, repositories, issues, pullRequests, releases, branches } = useDevFlow();
  const location = useLocation();

  const openIssuesCount = issues?.filter((i) => i.status !== 'Closed' && i.status !== 'closed')?.length || 0;
  const pendingPrCount = pullRequests?.filter((p) => p.status === 'Open' || p.status === 'open')?.length || 0;

  const academicItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/students',
      label: 'Students Directory',
      icon: GraduationCap,
      badge: students?.length || 12,
      badgeColor: 'bg-orange-50 text-orange-700 border border-orange-200',
    },
    {
      to: '/departments',
      label: 'Departments',
      icon: Building,
      badge: departments?.length || 5,
      badgeColor: 'bg-orange-50 text-orange-700 border border-orange-200',
    },
    {
      to: '/reports',
      label: 'Academic Reports',
      icon: BarChart3,
      badge: 'CSV',
      badgeColor: 'bg-orange-50 text-orange-700 border border-orange-200',
    },
  ];

  const githubItems = [
    {
      to: '/repositories',
      label: 'Repositories',
      icon: FolderGit2,
      badge: repositories?.length || 1,
      badgeColor: 'bg-orange-50 text-orange-700 border border-orange-200',
    },
    {
      to: '/issues',
      label: 'Issues & Bugs',
      icon: AlertCircle,
      badge: openIssuesCount,
      badgeColor: 'bg-orange-50 text-orange-700 border border-orange-200',
    },
    {
      to: '/branches',
      label: 'Branches',
      icon: GitBranch,
      badge: branches?.length || 5,
      badgeColor: 'bg-orange-50 text-orange-700 border border-orange-200',
    },
    {
      to: '/pull-requests',
      label: 'Pull Requests',
      icon: GitPullRequest,
      badge: pendingPrCount,
      badgeColor: 'bg-orange-50 text-orange-700 border border-orange-200',
    },
    {
      to: '/code-reviews',
      label: 'Code Reviews',
      icon: CheckCircle2,
      badge: null,
    },
    {
      to: '/releases',
      label: 'Releases',
      icon: Tag,
      badge: releases?.length || 1,
      badgeColor: 'bg-orange-50 text-orange-700 border border-orange-200',
    },
    {
      to: '/team',
      label: 'Team Members',
      icon: Users,
      badge: 5,
      badgeColor: 'bg-orange-50 text-orange-700 border border-orange-200',
    },
    {
      to: '/activities',
      label: 'Activity Logs',
      icon: Activity,
      badge: null,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  const renderNavGroup = (title, items) => (
    <div className="space-y-1 mb-4">
      <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {title}
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);

        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => onClose && onClose()}
            className={`group flex items-center justify-between px-3 py-2 text-xs rounded-lg font-medium transition-colors ${
              isActive
                ? 'bg-orange-50 text-orange-600 font-semibold border-l-2 border-orange-600 pl-2.5'
                : 'text-slate-700 hover:bg-orange-50/40 hover:text-orange-600'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-orange-600' : 'text-slate-500 group-hover:text-orange-600'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </div>

            {item.badge !== null && item.badge !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${item.badgeColor}`}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200">
          <NavLink
            to="/"
            onClick={() => onClose && onClose()}
            className="flex items-center gap-2.5 text-slate-900 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-sm ring-1 ring-orange-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-slate-900">
                  StudentMS
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-orange-50 text-orange-700 border border-orange-200">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 -mt-0.5 font-medium">
                Woxsen University PBL
              </p>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {renderNavGroup('Academic Modules', academicItems)}
          {renderNavGroup('GitHub Collaboration', githubItems)}
        </div>

        {/* Course Info Footer */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <div className="p-2.5 rounded-lg border border-orange-100 bg-orange-50/50 text-xs space-y-1">
            <div className="font-semibold text-orange-600">
              Course 24TU05IT01
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Industry Excellence Track • 5 Team Workstreams
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
