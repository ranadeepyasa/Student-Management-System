import React, { useState } from 'react';
import {
  GitBranch,
  Plus,
  Shield,
  Search,
  Check,
  ArrowUp,
  ArrowDown,
  GitCommit,
} from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useDevFlow } from '../context/DevFlowContext';

export const BranchesPage = () => {
  const { branches, addBranch, repositories } = useDevFlow();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepo, setSelectedRepo] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [branchName, setBranchName] = useState('');
  const [repo, setRepo] = useState(repositories[0]?.name || 'devflow-core');
  const [baseBranch, setBaseBranch] = useState('main');
  const [errors, setErrors] = useState({});

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredBranches = branches.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRepo = selectedRepo === 'all' || b.repository === selectedRepo;
    return matchesSearch && matchesRepo;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!branchName.trim()) {
      errs.branchName = 'Branch name is required';
    } else if (!/^[a-z0-9/_-]+$/i.test(branchName.trim())) {
      errs.branchName = 'Branch name can only contain letters, numbers, slashes, dashes, and underscores';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    addBranch({
      name: branchName.trim(),
      repository: repo,
    });

    setBranchName('');
    setErrors({});
    setIsModalOpen(false);
    showToast(`Branch '${branchName.trim()}' created successfully!`);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1f2328] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-slate-700">
          <Check className="w-4 h-4 text-[#4ac26b]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Breadcrumb items={[{ label: 'Branches' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#d0d7de]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1f2328] tracking-tight">
            Branch Management
          </h1>
          <p className="text-xs sm:text-sm text-[#656d76] mt-0.5">
            Branch Management (Concept 3): GitFlow & Trunk-Based development, feature isolation
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          New Branch
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-[#656d76] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search branches..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#d0d7de] rounded-md outline-none focus:border-[#0969da]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#656d76]">Repository:</span>
          <select
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            className="text-xs bg-white border border-[#d0d7de] px-2.5 py-1.5 rounded-md text-[#1f2328] font-medium outline-none"
          >
            <option value="all">All Repositories</option>
            {repositories.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Branches List */}
      <div className="bg-white rounded-lg border border-[#d0d7de] divide-y divide-[#d0d7de]">
        {filteredBranches.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#656d76] space-y-2">
            <GitBranch className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No branches found</p>
            <p>Create a new feature branch or reset your filter.</p>
          </div>
        ) : (
          filteredBranches.map((b) => (
            <div
              key={b.id}
              className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#ddf4ff]/50 text-[#0969da] font-mono text-xs font-semibold border border-[#54aeff]/30">
                    {b.name}
                  </span>
                  {b.isDefault && (
                    <Badge variant="blue" size="xs">
                      default
                    </Badge>
                  )}
                  {b.isProtected && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8250df]">
                      <Shield className="w-3 h-3" /> protected
                    </span>
                  )}
                  <span className="text-xs text-[#656d76] font-mono">
                    in {b.repository}
                  </span>
                </div>

                <p className="text-xs text-[#1f2328] font-medium truncate pt-0.5">
                  {b.lastCommitMessage}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-[#656d76]">
                  <span>Updated {b.updatedAt} by {b.author}</span>
                  <span>•</span>
                  <span className="font-mono">{b.lastCommitHash}</span>
                </div>
              </div>

              {/* Ahead / Behind metrics */}
              <div className="flex items-center gap-3 shrink-0">
                {b.aheadBehind && (
                  <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                    <span className="flex items-center text-[#1a7f37]">
                      <ArrowUp className="w-3 h-3 mr-0.5" /> {b.aheadBehind.ahead}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center text-[#cf222e]">
                      <ArrowDown className="w-3 h-3 mr-0.5" /> {b.aheadBehind.behind}
                    </span>
                  </div>
                )}
                <Button variant="default" size="sm">
                  Compare
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Branch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a new branch"
        subtitle="Isolate your changes before opening a pull request"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Target Repository
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

          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Branch Name <span className="text-[#cf222e]">*</span>
            </label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="e.g. feature/user-profile-v2"
              className={`w-full px-3 py-2 border rounded-md outline-none text-xs ${
                errors.branchName ? 'border-[#cf222e]' : 'border-[#d0d7de] focus:border-[#0969da]'
              }`}
            />
            {errors.branchName && (
              <p className="text-[#cf222e] text-[11px] mt-1">{errors.branchName}</p>
            )}
            <p className="text-[#656d76] text-[11px] mt-1">
              Common prefixes: <code>feature/</code>, <code>fix/</code>, <code>chore/</code>
            </p>
          </div>

          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Branch from base
            </label>
            <select
              value={baseBranch}
              onChange={(e) => setBaseBranch(e.target.value)}
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none bg-white text-xs"
            >
              <option value="main">main (production release)</option>
              <option value="develop">develop (active integration)</option>
            </select>
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
              Create branch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
