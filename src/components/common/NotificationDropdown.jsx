import React, { useState, useRef, useEffect } from 'react';
import { Bell, GitPullRequest, AlertCircle, CheckCircle2, MessageSquare, Check } from 'lucide-react';
import { useDevFlow } from '../../context/DevFlowContext';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markNotificationRead, markAllNotificationsRead } = useDevFlow();
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'review':
        return <GitPullRequest className="w-3.5 h-3.5 text-[#8250df]" />;
      case 'issue':
        return <AlertCircle className="w-3.5 h-3.5 text-[#1a7f37]" />;
      case 'ci':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#1a7f37]" />;
      case 'mention':
        return <MessageSquare className="w-3.5 h-3.5 text-[#0969da]" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-[#656d76]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-md text-[#656d76] hover:text-[#1f2328] hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0969da]/30"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0969da] ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg border border-[#d0d7de] shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#d0d7de] bg-[#f6f8fa]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#1f2328]">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#0969da] text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-[#0969da] hover:underline flex items-center gap-1 font-medium"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#656d76]">
                No notifications right now
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markNotificationRead(item.id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                    item.unread ? 'bg-[#f0f6fc]' : ''
                  }`}
                >
                  <div className="mt-0.5 p-1 rounded-md bg-white border border-[#d0d7de] shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${item.unread ? 'font-semibold text-[#1f2328]' : 'text-slate-700'} leading-snug`}>
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#656d76]">
                      <span className="font-mono">{item.repo}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                  {item.unread && (
                    <div className="w-2 h-2 rounded-full bg-[#0969da] shrink-0 mt-1" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-[#d0d7de] text-center bg-[#f6f8fa]">
            <span className="text-[11px] text-[#656d76]">
              Real-time collaboration alerts simulation
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
