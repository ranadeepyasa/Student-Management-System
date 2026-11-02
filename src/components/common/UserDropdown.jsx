import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Check, Shield, Users, Key } from 'lucide-react';
import { useDevFlow } from '../../context/DevFlowContext';
import { api } from '../../services/api';

export const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, switchUserPersona, teamMembers, logout } = useDevFlow();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchUser = async (member) => {
    await switchUserPersona(member);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/30"
        title="User profile & role persona"
      >
        <img
          src={currentUser?.avatar || currentUser?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces'}
          alt={currentUser?.name || 'User'}
          className="w-7 h-7 rounded-full object-cover ring-1 ring-[#d0d7de]"
        />
        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span className="text-xs font-semibold text-[#1f2328] max-w-[110px] truncate">
            {currentUser?.name || 'Developer'}
          </span>
          <span className="text-[10px] font-medium text-orange-600 max-w-[110px] truncate">
            {currentUser?.role || 'Team Member'}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg border border-[#d0d7de] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* User Header */}
          <div className="px-4 py-3 border-b border-[#d0d7de] bg-[#f6f8fa]">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser?.avatar || currentUser?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces'}
                alt={currentUser?.name}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-[#d0d7de]"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#1f2328] truncate">
                  {currentUser?.name}
                </p>
                <p className="text-[11px] text-[#656d76] truncate">
                  {currentUser?.email}
                </p>
                <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded bg-orange-50 border border-orange-200 text-[10px] text-orange-700 font-bold">
                  <Shield className="w-3 h-3" /> {currentUser?.role}
                </div>
              </div>
            </div>
          </div>

          {/* Switch 5-Member Team Role */}
          <div className="px-3 py-2 border-b border-[#d0d7de]">
            <span className="text-[10px] font-bold text-[#656d76] uppercase tracking-wider px-1">
              5-Role Multi-Laptop Switcher
            </span>
            <div className="mt-1 space-y-1">
              {teamMembers?.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleSwitchUser(member)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md hover:bg-slate-100 text-left transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={member.avatar || member.avatar_url}
                      alt={member.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <div className="truncate">
                      <span className="font-semibold text-[#1f2328]">
                        {member.name}
                      </span>
                      <p className="text-[10px] text-[#656d76] truncate">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  {(currentUser?.role === member.role || currentUser?.id === member.id) && (
                    <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Logout button */}
          <div className="p-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#cf222e] hover:bg-[#ffebe9] rounded-md transition-colors font-medium"
            >
              <LogOut className="w-3.5 h-3.5 text-[#cf222e]" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
