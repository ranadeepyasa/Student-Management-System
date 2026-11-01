import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  AlertCircle,
  GitBranch,
  GitPullRequest,
  CheckCircle2,
  Tag,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useDevFlow } from '../../context/DevFlowContext';

export const CoreConceptsBanner = () => {
  const navigate = useNavigate();
  const { setIsHelpOpen } = useDevFlow();

  const concepts = [
    { title: 'Source Code', desc: 'SCM & Commits', icon: Code2, path: '/repositories', color: 'text-[#0969da]' },
    { title: 'Bug Tracking', desc: 'Issues & Triage', icon: AlertCircle, path: '/issues', color: 'text-[#cf222e]' },
    { title: 'Branching', desc: 'Feature Isolation', icon: GitBranch, path: '/branches', color: 'text-[#1a7f37]' },
    { title: 'Pull Requests', desc: 'Merge Proposals', icon: GitPullRequest, path: '/pull-requests', color: 'text-[#8250df]' },
    { title: 'Code Review', desc: 'Diff Inspection', icon: CheckCircle2, path: '/code-reviews', color: 'text-[#0969da]' },
    { title: 'Releases', desc: 'SemVer & Assets', icon: Tag, path: '/releases', color: 'text-[#bc4c00]' },
  ];

  return (
    <div className="bg-white rounded-lg border border-[#d0d7de] p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ddf4ff] text-[#0969da] border border-[#54aeff]/30">
              6 Core Concepts
            </span>
            <h3 className="text-sm font-bold text-[#1f2328]">
              GitHub Collaborative Workflow Simulator
            </h3>
          </div>
          <p className="text-xs text-[#656d76] mt-1">
            Explore how modern distributed engineering teams organize repositories, review diffs, and ship production software.
          </p>
        </div>
        <button
          onClick={() => setIsHelpOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0969da] bg-[#ddf4ff]/50 hover:bg-[#ddf4ff] border border-[#54aeff]/40 rounded-md transition-colors shrink-0"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Interactive Guide
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
        {concepts.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:border-[#0969da] bg-[#f6f8fa]/60 hover:bg-[#ddf4ff]/20 text-center transition-all group"
            >
              <div className="p-2 rounded-md bg-white border border-[#d0d7de] group-hover:border-[#0969da]/40 mb-2 transition-colors">
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <span className="text-xs font-bold text-[#1f2328] group-hover:text-[#0969da] transition-colors leading-tight">
                {item.title}
              </span>
              <span className="text-[10px] text-[#656d76] mt-0.5">
                {item.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
