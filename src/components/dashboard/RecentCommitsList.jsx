import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GitCommit, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { useDevFlow } from '../../context/DevFlowContext';

export const RecentCommitsList = () => {
  const { commits } = useDevFlow();
  const [copiedHash, setCopiedHash] = useState(null);

  const handleCopy = (hash) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  return (
    <div className="bg-white rounded-lg border border-[#d0d7de] p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-[#1f2328] flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-[#0969da]" />
            Recent Commits
          </h3>
          <p className="text-xs text-[#656d76] mt-0.5">
            Cryptographic change tree snapshots across branches
          </p>
        </div>
        <Link
          to="/repositories"
          className="text-xs font-semibold text-[#0969da] hover:underline flex items-center gap-1"
        >
          View Repos <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {commits.slice(0, 5).map((commit) => (
          <div
            key={commit.hash}
            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/60 px-2 rounded-md transition-colors"
          >
            <div className="flex items-start gap-3 min-w-0">
              <img
                src={commit.author.avatar}
                alt={commit.author.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0 mt-0.5"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#1f2328] hover:text-[#0969da] transition-colors truncate">
                  {commit.message}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#656d76]">
                  <span className="font-medium text-slate-800">
                    {commit.author.name}
                  </span>
                  <span>committed to</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-100 font-mono text-[10px] text-[#0969da] border border-slate-200">
                    {commit.branch}
                  </span>
                  <span>•</span>
                  <span>{commit.timestamp}</span>
                  {commit.verified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#1a7f37]">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 sm:self-center ml-10 sm:ml-0">
              <div className="text-[11px] font-mono hidden md:flex items-center gap-1 text-slate-600">
                <span className="text-[#1a7f37]">+{commit.additions}</span>
                <span className="text-[#cf222e]">-{commit.deletions}</span>
              </div>

              {/* Git Hash button with copy */}
              <button
                onClick={() => handleCopy(commit.hash)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#f6f8fa] hover:bg-slate-200/80 border border-[#d0d7de] text-[11px] font-mono text-[#0969da] transition-colors"
                title="Copy commit SHA"
              >
                {copiedHash === commit.hash ? (
                  <>
                    <Check className="w-3 h-3 text-[#1a7f37]" />
                    <span className="text-[#1a7f37]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-2.5 h-2.5 text-slate-400" />
                    <span>{commit.shortHash}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
