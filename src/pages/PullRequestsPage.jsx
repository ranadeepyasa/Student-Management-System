import React, { useState } from 'react';
import {
  GitPullRequest,
  Plus,
  GitMerge,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Search,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useDevFlow } from '../context/DevFlowContext';

export const PullRequestsPage = () => {
  const { pullRequests, addPullRequest, repositories, branches } = useDevFlow();
  const [activeTab, setActiveTab] = useState('open'); // 'open', 'merged', 'closed', 'all'
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [repo, setRepo] = useState(repositories[0]?.name || 'devflow-core');
  const [sourceBranch, setSourceBranch] = useState(branches[1]?.name || 'develop');
  const [targetBranch, setTargetBranch] = useState('main');
  const [errors, setErrors] = useState({});

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openCount = pullRequests.filter((p) => p.status === 'open').length;
  const mergedCount = pullRequests.filter((p) => p.status === 'merged').length;

  const filteredPRs = pullRequests.filter((pr) => {
    const matchesTab =
      activeTab === 'all' ? true : pr.status === activeTab;
    const matchesSearch =
      pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.sourceBranch.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Pull request title is required';
    }
    if (sourceBranch === targetBranch) {
      errs.branches = 'Source and target branches cannot be identical';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    addPullRequest({
      title: title.trim(),
      description: desc.trim() || 'Pull request opened for code review and automated CI validation.',
      repository: repo,
      sourceBranch,
      targetBranch,
    });

    setTitle('');
    setDesc('');
    setErrors({});
    setIsModalOpen(false);
    showToast('Pull request opened successfully!');
  };

  const getReviewBadge = (reviewStatus) => {
    switch (reviewStatus) {
      case 'approved':
        return <Badge variant="green" size="xs">Approved</Badge>;
      case 'changes_requested':
        return <Badge variant="red" size="xs">Changes Requested</Badge>;
      case 'pending':
        return <Badge variant="orange" size="xs">Review Required</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1f2328] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-slate-700">
          <Check className="w-4 h-4 text-[#4ac26b]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Breadcrumb items={[{ label: 'Pull Requests' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#d0d7de]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1f2328] tracking-tight">
            Pull Requests
          </h1>
          <p className="text-xs sm:text-sm text-[#656d76] mt-0.5">
            Pull Requests (Concept 4): Merge proposals, automated checks, and team discussions
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          New Pull Request
        </Button>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-white border border-[#d0d7de] p-1 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('open')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'open'
                ? 'bg-[#1a7f37] text-white shadow-xs'
                : 'text-[#656d76] hover:text-[#1f2328]'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>Open ({openCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('merged')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'merged'
                ? 'bg-[#8250df] text-white shadow-xs'
                : 'text-[#656d76] hover:text-[#1f2328]'
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Merged ({mergedCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-slate-200 text-[#1f2328]'
                : 'text-[#656d76] hover:text-[#1f2328]'
            }`}
          >
            <span>All ({pullRequests.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#656d76] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pull requests..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#d0d7de] rounded-md outline-none focus:border-[#0969da]"
          />
        </div>
      </div>

      {/* PRs List */}
      <div className="bg-white rounded-lg border border-[#d0d7de] divide-y divide-[#d0d7de]">
        {filteredPRs.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#656d76] space-y-2">
            <GitPullRequest className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No pull requests found</p>
            <p>Propose changes to a branch or clear active filters.</p>
          </div>
        ) : (
          filteredPRs.map((pr) => {
            const isMerged = pr.status === 'merged';

            return (
              <div
                key={pr.id}
                className="p-4 hover:bg-slate-50/70 transition-colors flex items-start gap-3.5"
              >
                <div className="mt-0.5 shrink-0">
                  {isMerged ? (
                    <div className="p-1.5 rounded-full bg-[#fbefff] text-[#8250df] border border-[#c297ff]/40">
                      <GitMerge className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="p-1.5 rounded-full bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b]/40">
                      <GitPullRequest className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-[#1f2328] hover:text-[#0969da] cursor-pointer">
                      {pr.title}
                    </h3>
                    {getReviewBadge(pr.reviewStatus)}
                  </div>

                  <p className="text-xs text-[#656d76] line-clamp-2">
                    {pr.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#656d76] pt-0.5">
                    <span className="font-mono font-bold text-[#1f2328]">
                      #{pr.number}
                    </span>
                    <span>opened {pr.createdAt} by <strong>{pr.author}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      <span>{pr.sourceBranch}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span>{pr.targetBranch}</span>
                    </span>
                    <span>in <strong className="font-mono text-[#0969da]">{pr.repository}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-center">
                  <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
                    <span className="text-[#1a7f37]">+{pr.additions}</span>
                    <span className="text-[#cf222e]">-{pr.deletions}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-[#656d76]">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{pr.commentsCount || 0}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: New PR */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Open a Pull Request"
        subtitle="Compare changes across branches and request code review"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Repository
            </label>
            <select
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none bg-white text-xs"
            >
              {repositories.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1f2328] mb-1">
                Base Branch (Target)
              </label>
              <select
                value={targetBranch}
                onChange={(e) => setTargetBranch(e.target.value)}
                className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none bg-white text-xs font-mono"
              >
                <option value="main">main</option>
                <option value="develop">develop</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1f2328] mb-1">
                Compare Branch (Source)
              </label>
              <select
                value={sourceBranch}
                onChange={(e) => setSourceBranch(e.target.value)}
                className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none bg-white text-xs font-mono"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.branches && (
            <p className="text-[#cf222e] text-[11px]">{errors.branches}</p>
          )}

          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Title <span className="text-[#cf222e]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. feat(auth): add OAuth2 refresh token rotation"
              className={`w-full px-3 py-2 border rounded-md outline-none text-xs ${
                errors.title ? 'border-[#cf222e]' : 'border-[#d0d7de] focus:border-[#0969da]'
              }`}
            />
            {errors.title && (
              <p className="text-[#cf222e] text-[11px] mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Description of Changes
            </label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Summarize changes, linked issue tickets (e.g. Closes #101), and test evidence..."
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none text-xs resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#d0d7de]">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create Pull Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
