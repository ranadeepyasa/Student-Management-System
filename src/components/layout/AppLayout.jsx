import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { HelpModal } from '../common/HelpModal';
import { SearchModal } from '../common/SearchModal';
import { AuthModal } from '../common/AuthModal';
import { useDevFlow } from '../../context/DevFlowContext';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isHelpOpen, setIsHelpOpen, isSearchOpen, setIsSearchOpen, isAuthModalOpen, setIsAuthModalOpen } = useDevFlow();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Body */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <TopNavbar onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto bg-white">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">Student Management System</span>
              <span>—</span>
              <span className="text-orange-600 font-medium">Woxsen University PBL</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="hover:text-orange-600 transition-colors"
              >
                Architecture Guide
              </button>
              <span>•</span>
              <a
                href="https://github.com/ranadeepyasa/Student-Management-System"
                target="_blank"
                rel="noreferrer"
                className="hover:text-orange-600 transition-colors underline"
              >
                GitHub Repository
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};
