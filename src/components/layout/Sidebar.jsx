import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
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
  Sparkles,
} from 'lucide-react';
import { useDevFlow } from '../../context/DevFlowContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { repositories, issues, pullRequests, releases, branches } = useDevFlow();
  const location = useLocation();

  const openIssuesCount = issues?.filter((i) => i.status !== 'Closed' && i.status !== 'closed')?.length || 0;
  const pendingPrCount = pullRequests?.filter((p) => p.status === 'Open' || p.status === 'open')?.length || 0;

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/repositories',
      label: 'Repositories',
      icon: FolderGit2,
      badge: repositories?.length || 1,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      to: '/issues',
      label: 'Issues',
      icon: AlertCircle,
      badge: openIssuesCount,
      badgeColor: 'bg-[#dafbe1] text-[#1a7f37]',
    },
    {
      to: '/branches',
      label: 'Branches',
      icon: GitBranch,
      badge: branches?.length || 4,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      to: '/pull-requests',
      label: 'Pull Requests',
      icon: GitPullRequest,
      badge: pendingPrCount,
      badgeColor: 'bg-[#ddf4ff] text-[#0969da]',
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
      badge: releases?.length || 3,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      to: '/team',
      label: 'Team Members',
      icon: Users,
      badge: 5,
      badgeColor: 'bg-purple-50 text-[#8250df]',
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

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#d0d7de] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and Platform Brand */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#d0d7de]">
          <NavLink
            to="/"
            onClick={() => onClose && onClose()}
            className="flex items-center gap-2.5 text-[#1f2328] hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0969da] flex items-center justify-center text-white shadow-sm ring-1 ring-black/10">
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 13.5a3.5 3.5 0 0 0-3.16 2H11.5a3.5 3.5 0 0 1-3.5-3.5V9.66a3.5 3.5 0 1 0-2 0v4.68a5.5 5.5 0 0 0 5.5 5.5h4.34a3.5 3.5 0 1 0 3.16-6.34ZM7 7a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 7 7Zm12 11a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-[#1f2328]">
                  DevFlow
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  v1.1
                </span>
              </div>
              <p className="text-[10px] text-[#656d76] -mt-0.5 font-medium">
                Collaborative Platform
              </p>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#656d76] hover:text-[#1f2328] hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (All 10 required items) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          <div className="px-3 pb-1.5 text-[11px] font-semibold text-[#656d76] uppercase tracking-wider">
            Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose && onClose()}
                className={`group flex items-center justify-between px-3 py-2 text-xs rounded-md font-medium transition-colors ${
                  isActive
                    ? 'bg-[#ddf4ff]/60 text-[#0969da] font-semibold border-l-2 border-[#0969da] pl-2.5'
                    : 'text-[#1f2328] hover:bg-slate-100 hover:text-[#1f2328]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#0969da]' : 'text-[#656d76] group-hover:text-[#1f2328]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Educational Sandbox Footer Banner */}
        <div className="p-3 border-t border-[#d0d7de] bg-[#f6f8fa]">
          <div className="p-2.5 rounded-lg border border-[#d0d7de] bg-white text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#0969da]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-User Live Sync</span>
            </div>
            <p className="text-[11px] text-[#656d76] leading-relaxed">
              5-role collaboration running on MySQL & Socket.IO.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
