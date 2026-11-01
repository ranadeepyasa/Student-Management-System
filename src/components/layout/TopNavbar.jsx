import React from 'react';
import { Search, HelpCircle, Menu, Shield } from 'lucide-react';
import { Github } from '../common/GithubIcon';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { UserDropdown } from '../common/UserDropdown';
import { useDevFlow } from '../../context/DevFlowContext';

export const TopNavbar = ({ onOpenSidebar }) => {
  const { setIsSearchOpen, setIsHelpOpen, currentUser, githubStatus } = useDevFlow();

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-[#d0d7de] flex items-center justify-between px-4 sm:px-6">
      {/* Left section: Hamburger for mobile + quick search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenSidebar}
          className="p-1.5 rounded-md text-[#656d76] hover:text-[#1f2328] hover:bg-slate-100 lg:hidden focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#656d76] bg-[#f6f8fa] hover:bg-slate-100 border border-[#d0d7de] rounded-md transition-colors text-left"
          title="Search DevFlow (Ctrl+K)"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Type <kbd className="font-sans font-semibold text-slate-500">/</kbd> or search repos, issues, PRs...</span>
            <span className="sm:hidden">Search...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white border border-slate-300 rounded shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right section: GitHub Sync status, Help, Notifications, User profile & Role */}
      <div className="flex items-center gap-1.5 sm:gap-2 ml-4">
        {/* GitHub Integration Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#f6f8fa] border border-[#d0d7de] text-[#1f2328]">
          <Github className="w-3.5 h-3.5 text-black" />
          <span className="text-[#656d76]">Repo:</span>
          <span className="font-mono text-[#0969da] max-w-[120px] truncate" title="ranadeepyasa/Student-Management-System">
            ranadeepyasa
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#1a7f37]" title="Connected to GitHub" />
        </div>

        {/* Role Badge in Header */}
        <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#ddf4ff] border border-[#54aeff]/30 text-xs font-semibold text-[#0969da]">
          <Shield className="w-3 h-3" />
          <span>{currentUser?.role || 'Developer'}</span>
        </div>

        {/* Help guide trigger */}
        <button
          onClick={() => setIsHelpOpen(true)}
          className="p-2 rounded-md text-[#656d76] hover:text-[#0969da] hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0969da]/30"
          title="DevFlow Educational Guide"
          aria-label="Educational Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown */}
        <NotificationDropdown />

        <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* User Profile & Role Menu */}
        <UserDropdown />
      </div>
    </header>
  );
};
