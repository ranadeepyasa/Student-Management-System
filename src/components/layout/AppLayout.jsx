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
    <div className="min-h-screen bg-[#f6f8fa] flex flex-col">
      {/* Sidebar (Desktop fixed, Mobile sliding drawer) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Body */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <TopNavbar onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="border-t border-[#d0d7de] bg-white py-4 px-6 text-center text-xs text-[#656d76]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1f2328]">DevFlow</span>
              <span>—</span>
              <span>GitHub-Integrated Multi-User Collaborative Platform</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="hover:text-[#0969da] transition-colors"
              >
                6 Core Git Concepts
              </button>
              <span>•</span>
              <a
                href="https://github.com/ranadeepyasa/Student-Management-System"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0969da] transition-colors underline"
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
