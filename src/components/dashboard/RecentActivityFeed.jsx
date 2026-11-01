import React from 'react';
import {
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  AlertCircle,
  Tag,
  GitBranch,
  FolderGit2,
} from 'lucide-react';
import { useDevFlow } from '../../context/DevFlowContext';

export const RecentActivityFeed = () => {
  const { activities } = useDevFlow();

  const getActionIcon = (type = '') => {
    switch (type.toLowerCase()) {
      case 'commit':
        return <GitCommit className="w-3.5 h-3.5 text-[#0969da]" />;
      case 'pr_opened':
      case 'pr_merged':
        return <GitPullRequest className="w-3.5 h-3.5 text-[#8250df]" />;
      case 'review_requested':
      case 'review_submitted':
      case 'pr_approved':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#1a7f37]" />;
      case 'issue_opened':
      case 'issue_created':
      case 'issue_closed':
        return <AlertCircle className="w-3.5 h-3.5 text-[#cf222e]" />;
      case 'release':
      case 'release_published':
        return <Tag className="w-3.5 h-3.5 text-[#0969da]" />;
      case 'branch_created':
        return <GitBranch className="w-3.5 h-3.5 text-[#1a7f37]" />;
      case 'repo_created':
        return <FolderGit2 className="w-3.5 h-3.5 text-[#0969da]" />;
      default:
        return <GitCommit className="w-3.5 h-3.5 text-[#656d76]" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#d0d7de] p-5 shadow-xs">
      <div className="pb-3 mb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#1f2328]">
            Team Activity Feed
          </h3>
          <p className="text-xs text-[#656d76] mt-0.5">
            Audit log of team development actions in MySQL & GitHub
          </p>
        </div>
        <span className="text-[11px] font-medium text-emerald-700 bg-[#dafbe1] px-2 py-0.5 rounded-full border border-[#4ac26b]/30">
          Live Socket.IO
        </span>
      </div>

      <div className="space-y-3">
        {activities.slice(0, 6).map((act) => (
          <div key={act.id} className="flex items-start gap-3 text-xs">
            <img
              src={act.avatar_url || act.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'}
              alt={act.user_name || act.user}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0 mt-0.5"
            />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 leading-snug">
                <span className="font-semibold text-[#1f2328]">{act.user_name || act.user}</span>
                <span className="text-[#656d76]">performed</span>
                <span className="font-medium text-[#0969da] truncate">{act.target_name || act.target}</span>
              </div>

              {(act.description || act.detail) && (
                <p className="text-[11px] text-[#656d76] line-clamp-1 mt-0.5">
                  {act.description || act.detail}
                </p>
              )}

              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {act.created_at ? new Date(act.created_at).toLocaleTimeString() : act.timestamp}
              </span>
            </div>

            <div className="p-1 rounded-md bg-slate-100 shrink-0 mt-0.5">
              {getActionIcon(act.action_type || act.type)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
