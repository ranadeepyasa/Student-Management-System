import React, { useState } from 'react';
import { Users, Mail, GitCommit, FolderGit2, Shield, Check } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useDevFlow } from '../context/DevFlowContext';

export const TeamPage = () => {
  const { teamMembers, currentUser, setCurrentUser } = useDevFlow();
  const [selectedDept, setSelectedDept] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const departments = ['all', ...Array.from(new Set(teamMembers.map((m) => m.department)))];

  const filteredMembers = teamMembers.filter(
    (m) => selectedDept === 'all' || m.department === selectedDept
  );

  const handleSimulateUser = (member) => {
    setCurrentUser({
      name: member.name,
      handle: member.handle,
      role: member.role,
      email: member.email,
      avatar: member.avatar,
      status: member.status,
    });
    showToast(`Active persona switched to ${member.name}!`);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1f2328] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-slate-700">
          <Check className="w-4 h-4 text-[#4ac26b]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Breadcrumb items={[{ label: 'Team Members' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#d0d7de]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1f2328] tracking-tight">
            Engineering Team Members
          </h1>
          <p className="text-xs sm:text-sm text-[#656d76] mt-0.5">
            Active collaborators, role governance, and commit contribution metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#656d76]">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs bg-white border border-[#d0d7de] px-2.5 py-1.5 rounded-md text-[#1f2328] font-medium outline-none"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'all' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const isCurrent = currentUser.handle === member.handle;

          return (
            <div
              key={member.id}
              className={`bg-white rounded-lg border p-5 transition-all ${
                isCurrent
                  ? 'border-[#0969da] ring-1 ring-[#0969da] shadow-xs'
                  : 'border-[#d0d7de] hover:border-slate-400'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                      member.status === 'online'
                        ? 'bg-[#1a7f37]'
                        : member.status === 'busy'
                        ? 'bg-[#bc4c00]'
                        : 'bg-slate-400'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#1f2328] truncate">
                      {member.name}
                    </h3>
                    {isCurrent && (
                      <Badge variant="blue" size="xs">
                        Active Persona
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-[#656d76] font-mono">@{member.handle}</p>
                  <p className="text-xs font-medium text-[#0969da] mt-0.5">
                    {member.role}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#656d76]">
                <div className="flex items-center gap-1 font-mono">
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{member.activeRepos} repos</span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <GitCommit className="w-3.5 h-3.5 text-slate-400" />
                  <span>{member.commitsCount} commits</span>
                </div>
                <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  {member.department.split(' ')[0]}
                </span>
              </div>

              <div className="mt-4">
                <Button
                  variant={isCurrent ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleSimulateUser(member)}
                >
                  {isCurrent ? 'Currently Active' : 'Switch to this Persona'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
