import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FolderGit2, AlertCircle, GitBranch, GitPullRequest, ArrowRight, X } from 'lucide-react';
import { useDevFlow } from '../../context/DevFlowContext';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { repositories, issues, branches, pullRequests } = useDevFlow();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredRepos = q ? repositories.filter(r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)) : repositories.slice(0, 3);
  const filteredIssues = q ? issues.filter(i => i.title.toLowerCase().includes(q) || i.labels.some(l => l.toLowerCase().includes(q))) : issues.slice(0, 3);
  const filteredBranches = q ? branches.filter(b => b.name.toLowerCase().includes(q)) : branches.slice(0, 2);
  const filteredPRs = q ? pullRequests.filter(p => p.title.toLowerCase().includes(q)) : pullRequests.slice(0, 2);

  const handleSelect = (route) => {
    onClose();
    navigate(route);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative bg-white w-full max-w-xl rounded-xl border border-[#d0d7de] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-[#d0d7de] bg-white">
          <Search className="w-4 h-4 text-[#656d76] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search repositories, issues, branches, pull requests..."
            className="w-full px-3 py-3.5 text-sm bg-transparent outline-none placeholder:text-slate-400 text-[#1f2328]"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Repositories */}
          {filteredRepos.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-[#656d76] uppercase tracking-wider flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5" /> Repositories
              </div>
              <div className="mt-1 space-y-1">
                {filteredRepos.map(repo => (
                  <button
                    key={repo.id}
                    onClick={() => handleSelect('/repositories')}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-slate-100 text-left transition-colors group"
                  >
                    <div>
                      <span className="font-semibold text-[#0969da] group-hover:underline">{repo.name}</span>
                      <p className="text-[11px] text-[#656d76] line-clamp-1">{repo.description}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          {filteredIssues.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-[#656d76] uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Issues
              </div>
              <div className="mt-1 space-y-1">
                {filteredIssues.map(issue => (
                  <button
                    key={issue.id}
                    onClick={() => handleSelect('/issues')}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-slate-100 text-left transition-colors group"
                  >
                    <div className="min-w-0">
                      <span className="text-[#656d76] font-mono mr-1">#{issue.number}</span>
                      <span className="font-medium text-[#1f2328] group-hover:text-[#0969da]">{issue.title}</span>
                      <span className="ml-2 text-[10px] text-slate-500 font-mono">({issue.repository})</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pull Requests */}
          {filteredPRs.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-[#656d76] uppercase tracking-wider flex items-center gap-1.5">
                <GitPullRequest className="w-3.5 h-3.5" /> Pull Requests
              </div>
              <div className="mt-1 space-y-1">
                {filteredPRs.map(pr => (
                  <button
                    key={pr.id}
                    onClick={() => handleSelect('/pull-requests')}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-slate-100 text-left transition-colors group"
                  >
                    <div className="min-w-0">
                      <span className="text-[#656d76] font-mono mr-1">#{pr.number}</span>
                      <span className="font-medium text-[#1f2328] group-hover:text-[#0969da]">{pr.title}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Branches */}
          {filteredBranches.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-[#656d76] uppercase tracking-wider flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" /> Branches
              </div>
              <div className="mt-1 space-y-1">
                {filteredBranches.map(branch => (
                  <button
                    key={branch.id}
                    onClick={() => handleSelect('/branches')}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-slate-100 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-[#0969da]">
                        {branch.name}
                      </span>
                      <span className="text-[11px] text-[#656d76]">in {branch.repository}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-[#d0d7de] bg-[#f6f8fa] flex items-center justify-between text-[11px] text-[#656d76]">
          <span>Tip: Press <kbd className="px-1 py-0.5 bg-white border border-slate-300 rounded font-mono">ESC</kbd> to close</span>
          <span className="font-medium">DevFlow Fast Search</span>
        </div>
      </div>
    </div>
  );
};
