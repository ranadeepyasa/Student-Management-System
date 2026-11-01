import React, { useState } from 'react';
import { Plus, BookOpen, AlertCircle, FolderGit2, Check, ExternalLink, Users, Tag, GitCommit, GitPullRequest } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { StatCardsGrid } from '../components/dashboard/StatCardsGrid';
import { ProjectProgressChart } from '../components/dashboard/ProjectProgressChart';
import { IssuesStatusChart } from '../components/dashboard/IssuesStatusChart';
import { RecentCommitsList } from '../components/dashboard/RecentCommitsList';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { CoreConceptsBanner } from '../components/dashboard/CoreConceptsBanner';
import { useDevFlow } from '../context/DevFlowContext';

export const DashboardPage = () => {
  const { addRepository, addIssue, setIsHelpOpen, repositories, dashboardStats, teamMembers } = useDevFlow();

  // Modals state
  const [isNewRepoOpen, setIsNewRepoOpen] = useState(false);
  const [isNewIssueOpen, setIsNewIssueOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New Repo form state
  const [repoName, setRepoName] = useState('');
  const [repoDesc, setRepoDesc] = useState('');
  const [repoLang, setRepoLang] = useState('JavaScript');
  const [repoPrivate, setRepoPrivate] = useState(false);
  const [repoErrors, setRepoErrors] = useState({});

  // New Issue form state
  const [issueTitle, setIssueTitle] = useState('');
  const [issueBody, setIssueBody] = useState('');
  const [issuePriority, setIssuePriority] = useState('High');
  const [issueErrors, setIssueErrors] = useState({});

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateRepo = (e) => {
    e.preventDefault();
    if (!repoName.trim()) {
      setRepoErrors({ name: 'Repository name is required' });
      return;
    }
    addRepository({
      name: repoName.trim(),
      description: repoDesc.trim() || 'Software repository in DevFlow',
      primaryLanguage: repoLang,
      isPrivate: repoPrivate,
    });
    setRepoName('');
    setRepoDesc('');
    setIsNewRepoOpen(false);
    showToast(`Repository '${repoName.trim()}' initialized!`);
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!issueTitle.trim()) {
      setIssueErrors({ title: 'Issue title is required' });
      return;
    }
    await addIssue({
      title: issueTitle.trim(),
      description: issueBody.trim() || 'Issue reported through DevFlow dashboard triage.',
      priority: issuePriority,
      labels: 'bug, triage',
    });
    setIssueTitle('');
    setIssueBody('');
    setIsNewIssueOpen(false);
    showToast('Issue created successfully!');
  };

  const contributions = dashboardStats?.developerContributions || teamMembers || [];
  const latestReleases = dashboardStats?.latestReleases || [];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1f2328] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-[#4ac26b]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <Breadcrumb items={[{ label: 'Dashboard' }]} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#d0d7de]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1f2328] tracking-tight">
              Engineering Operations Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b]/30">
              MySQL + GitHub Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#656d76] mt-0.5">
            5-member team collaborative workspace connected to GitHub REST API & MySQL
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="default"
            size="sm"
            icon={BookOpen}
            onClick={() => setIsHelpOpen(true)}
          >
            Workflow Guide
          </Button>

          <Button
            variant="default"
            size="sm"
            icon={AlertCircle}
            onClick={() => setIsNewIssueOpen(true)}
          >
            New Issue
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsNewRepoOpen(true)}
          >
            New Repository
          </Button>
        </div>
      </div>

      {/* 6 Core Concepts Banner */}
      <CoreConceptsBanner />

      {/* Stat Cards Grid (Live MySQL / GitHub metrics) */}
      <StatCardsGrid />

      {/* Charts Section: Velocity Progress + Issues Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectProgressChart />
        </div>
        <div>
          <IssuesStatusChart />
        </div>
      </div>

      {/* Developer Contribution Statistics Table */}
      <div className="bg-white rounded-lg border border-[#d0d7de] p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-[#1f2328] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#8250df]" />
              Developer Contribution Statistics
            </h3>
            <p className="text-xs text-[#656d76] mt-0.5">
              5-role team member tasks, PR contributions, and peer review sign-offs
            </p>
          </div>
          <Badge variant="purple" size="sm">
            5 Active Laptops
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f8fa] text-[#656d76] border-y border-[#d0d7de]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Team Member</th>
                <th className="py-2.5 px-3 font-semibold">Assigned Role</th>
                <th className="py-2.5 px-3 font-semibold text-center">Assigned Issues</th>
                <th className="py-2.5 px-3 font-semibold text-center">Authored PRs</th>
                <th className="py-2.5 px-3 font-semibold text-center">Reviews Completed</th>
                <th className="py-2.5 px-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contributions.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[#1f2328]">
                    <div className="flex items-center gap-2">
                      <img
                        src={m.avatar || m.avatar_url}
                        alt={m.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span>{m.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-[#0969da]">{m.role}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-semibold">{m.assigned_issues ?? 1}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-semibold">{m.authored_prs ?? 1}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-semibold">{m.completed_reviews ?? 1}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1a7f37]">
                      <span className="w-2 h-2 rounded-full bg-[#1a7f37]" /> Online
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity and Commits Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCommitsList />
        <RecentActivityFeed />
      </div>

      {/* Modal: New Repository */}
      <Modal
        isOpen={isNewRepoOpen}
        onClose={() => setIsNewRepoOpen(false)}
        title="Create a new repository"
        subtitle="A repository contains all project files, revision history, and commit revisions."
      >
        <form onSubmit={handleCreateRepo} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Repository name <span className="text-[#cf222e]">*</span>
            </label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="e.g., payment-service"
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Description
            </label>
            <input
              type="text"
              value={repoDesc}
              onChange={(e) => setRepoDesc(e.target.value)}
              placeholder="Short summary of the module or service"
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1f2328] mb-1">
                Primary Language
              </label>
              <select
                value={repoLang}
                onChange={(e) => setRepoLang(e.target.value)}
                className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none bg-white text-xs"
              >
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Python">Python</option>
                <option value="Go">Go</option>
                <option value="CSS">CSS</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#1f2328] mb-1">
                Visibility
              </label>
              <div className="flex items-center gap-3 mt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!repoPrivate}
                    onChange={() => setRepoPrivate(false)}
                  />
                  <span>Public</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={repoPrivate}
                    onChange={() => setRepoPrivate(true)}
                  />
                  <span>Private</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#d0d7de]">
            <Button variant="default" size="sm" onClick={() => setIsNewRepoOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create repository
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: New Issue */}
      <Modal
        isOpen={isNewIssueOpen}
        onClose={() => setIsNewIssueOpen(false)}
        title="Open a new issue"
        subtitle="Track bugs, request improvements, or report regressions"
      >
        <form onSubmit={handleCreateIssue} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Issue Title <span className="text-[#cf222e]">*</span>
            </label>
            <input
              type="text"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="e.g. Login button is not working."
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Priority
            </label>
            <select
              value={issuePriority}
              onChange={(e) => setIssuePriority(e.target.value)}
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none bg-white text-xs"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Critical">Critical / Blocker</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={issueBody}
              onChange={(e) => setIssueBody(e.target.value)}
              placeholder="Describe steps to reproduce the bug..."
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none text-xs resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#d0d7de]">
            <Button variant="default" size="sm" onClick={() => setIsNewIssueOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit new issue
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
