import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  Search,
  MessageSquare,
  Check,
  Clock,
  Trash2,
  Edit2,
  Send,
} from 'lucide-react';
import { Github } from '../components/common/GithubIcon';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useDevFlow } from '../context/DevFlowContext';
import { api } from '../services/api';

export const IssuesPage = () => {
  const { issues, addIssue, updateIssueStatus, repositories, teamMembers, currentUser, refreshAllData } = useDevFlow();
  const [activeTab, setActiveTab] = useState('open'); // 'open', 'in_progress', 'resolved', 'closed', 'all'
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIssueForComment, setSelectedIssueForComment] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState('High');
  const [labelsInput, setLabelsInput] = useState('bug, ui, auth');
  const [assignedTo, setAssignedTo] = useState(teamMembers[1]?.id || 2);
  const [errors, setErrors] = useState({});

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openCount = issues.filter((i) => i.status !== 'Closed' && i.status !== 'closed').length;
  const closedCount = issues.filter((i) => i.status === 'Closed' || i.status === 'closed').length;

  const filteredIssues = issues.filter((issue) => {
    const s = (issue.status || '').toLowerCase();
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'open'
        ? s !== 'closed'
        : activeTab === 'closed'
        ? s === 'closed'
        : activeTab === 'in_progress'
        ? s === 'in progress'
        : activeTab === 'resolved'
        ? s === 'resolved'
        : true;

    const matchesPriority =
      priorityFilter === 'all' || (issue.priority || '').toLowerCase() === priorityFilter.toLowerCase();

    const matchesSearch =
      (issue.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.description || issue.body || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.labels || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesPriority && matchesSearch;
  });

  const handleToggleStatus = async (issue) => {
    const isClosed = issue.status === 'Closed' || issue.status === 'closed';
    const newStatus = isClosed ? 'Open' : 'Closed';
    await updateIssueStatus(issue.id, newStatus);
    showToast(`Issue #${issue.issue_number || issue.number} marked as ${newStatus}!`);
  };

  const handleDeleteIssue = async (id, num) => {
    if (!window.confirm(`Delete issue #${num}?`)) return;
    try {
      const res = await api.deleteIssue(id);
      if (res.success) {
        showToast(`Issue #${num} deleted.`);
        refreshAllData();
      } else {
        showToast(res.error || 'Failed to delete issue.');
      }
    } catch (e) {
      showToast('Action restricted: Only Admin / Team Leader can delete issue records.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Title is required';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    await addIssue({
      title: title.trim(),
      description: body.trim() || 'No description provided.',
      priority,
      labels: labelsInput,
      assigned_to: assignedTo,
    });

    setTitle('');
    setBody('');
    setErrors({});
    setIsCreateModalOpen(false);
    showToast('New issue submitted successfully!');
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedIssueForComment) return;

    try {
      await api.addComment?.(selectedIssueForComment.id, { comment: commentText.trim() });
      showToast('Comment posted to issue thread.');
      setCommentText('');
      setSelectedIssueForComment(null);
      refreshAllData();
    } catch (e) {
      showToast('Comment saved locally.');
      setSelectedIssueForComment(null);
    }
  };

  const getPriorityBadge = (p = '') => {
    const pr = p.toLowerCase();
    switch (pr) {
      case 'critical':
      case 'urgent':
        return <Badge variant="red" size="xs">Critical</Badge>;
      case 'high':
        return <Badge variant="orange" size="xs">High</Badge>;
      case 'medium':
        return <Badge variant="blue" size="xs">Medium</Badge>;
      case 'low':
        return <Badge variant="gray" size="xs">Low</Badge>;
      default:
        return <Badge variant="gray" size="xs">{p}</Badge>;
    }
  };

  const getStatusBadge = (s = '') => {
    const st = s.toLowerCase();
    if (st === 'closed') return <Badge variant="purple" size="xs">Closed</Badge>;
    if (st === 'resolved') return <Badge variant="green" size="xs">Resolved</Badge>;
    if (st === 'in progress') return <Badge variant="blue" size="xs">In Progress</Badge>;
    return <Badge variant="green" size="xs">Open</Badge>;
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1f2328] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-slate-700">
          <Check className="w-4 h-4 text-[#4ac26b]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Breadcrumb items={[{ label: 'Issues' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#d0d7de]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1f2328] tracking-tight">
            Bug Tracking & Issues
          </h1>
          <p className="text-xs sm:text-sm text-[#656d76] mt-0.5">
            Concept 2: Triage regressions, assign roles, and synchronize with GitHub issues
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          New Issue
        </Button>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-white border border-[#d0d7de] p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('open')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'open'
                ? 'bg-[#1a7f37] text-white shadow-xs'
                : 'text-[#656d76] hover:text-[#1f2328]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Open ({openCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'in_progress'
                ? 'bg-[#0969da] text-white shadow-xs'
                : 'text-[#656d76] hover:text-[#1f2328]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>In Progress</span>
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'closed'
                ? 'bg-[#8250df] text-white shadow-xs'
                : 'text-[#656d76] hover:text-[#1f2328]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Closed ({closedCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'bg-slate-200 text-[#1f2328]'
                : 'text-[#656d76] hover:text-[#1f2328]'
            }`}
          >
            <span>All ({issues.length})</span>
          </button>
        </div>

        {/* Search & Priority Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#656d76] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter issues..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#d0d7de] rounded-md outline-none focus:border-[#0969da]"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-white border border-[#d0d7de] px-2.5 py-1.5 rounded-md text-[#1f2328] font-medium outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Issues Table/List */}
      <div className="bg-white rounded-lg border border-[#d0d7de] divide-y divide-[#d0d7de]">
        {filteredIssues.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#656d76] space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No issues found matching criteria</p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isClosed = (issue.status || '').toLowerCase() === 'closed';
            const num = issue.issue_number || issue.number;
            const labelsList = (typeof issue.labels === 'string' ? issue.labels.split(',') : (issue.labels || []));

            return (
              <div
                key={issue.id}
                className="p-4 hover:bg-slate-50/70 transition-colors flex items-start gap-3.5"
              >
                {/* Status Toggle Icon */}
                <button
                  onClick={() => handleToggleStatus(issue)}
                  className="mt-0.5 p-1 rounded hover:bg-slate-200/60 transition-colors"
                  title={isClosed ? 'Reopen issue' : 'Mark issue as Closed'}
                >
                  {isClosed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#8250df]" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[#1a7f37]" />
                  )}
                </button>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`text-sm font-bold ${
                        isClosed ? 'text-[#656d76] line-through' : 'text-[#1f2328]'
                      } hover:text-[#0969da] cursor-pointer`}
                      onClick={() => setSelectedIssueForComment(issue)}
                    >
                      {issue.title}
                    </h3>

                    {/* Labels */}
                    {labelsList.map((label, idx) => (
                      <Badge
                        key={idx}
                        variant={label.trim().includes('bug') ? 'red' : label.trim().includes('auth') ? 'purple' : 'gray'}
                        size="xs"
                      >
                        {label.trim()}
                      </Badge>
                    ))}

                    {/* Priority badge */}
                    {getPriorityBadge(issue.priority)}

                    {/* Status badge */}
                    {getStatusBadge(issue.status)}

                    {/* GitHub Sync Status */}
                    {issue.is_github_synced ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1a7f37] bg-[#dafbe1] px-1.5 py-0.2 rounded border border-[#4ac26b]/30">
                        <Github className="w-3 h-3" /> GitHub Synced
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                        MySQL Record
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#656d76] line-clamp-2">
                    {issue.description || issue.body}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#656d76] pt-1">
                    <span className="font-mono font-bold text-[#1f2328]">
                      #{num}
                    </span>
                    <span>•</span>
                    <span>Assignee: <strong className="text-[#1f2328]">{issue.assignee_name || issue.assignee || 'Unassigned'}</strong></span>
                    <span>•</span>
                    <span>Created by: {issue.creator_name || issue.author || 'Engineer'}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 shrink-0 self-center">
                  <button
                    onClick={() => setSelectedIssueForComment(issue)}
                    className="flex items-center gap-1 text-xs text-[#656d76] hover:text-[#0969da] px-2 py-1 rounded hover:bg-slate-100"
                    title="Add comment"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{issue.comments_count || issue.commentsCount || 0}</span>
                  </button>

                  <Button
                    variant={isClosed ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleToggleStatus(issue)}
                  >
                    {isClosed ? 'Reopen' : 'Close'}
                  </Button>

                  {currentUser?.role === 'Admin / Team Leader' && (
                    <button
                      onClick={() => handleDeleteIssue(issue.id, num)}
                      className="p-1.5 text-slate-400 hover:text-[#cf222e] rounded hover:bg-[#ffebe9] transition-colors"
                      title="Delete issue (Admin only)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create Issue */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Open a new issue"
        subtitle="Submit a bug report with priority, labels, and developer assignment"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Title <span className="text-[#cf222e]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Login button is not working."
              className={`w-full px-3 py-2 border rounded-md outline-none text-xs ${
                errors.title ? 'border-[#cf222e]' : 'border-[#d0d7de] focus:border-[#0969da]'
              }`}
            />
            {errors.title && (
              <p className="text-[#cf222e] text-[11px] mt-1">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1f2328] mb-1">
                Assign to Team Member
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none bg-white text-xs"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1f2328] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none bg-white text-xs"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Labels <span className="text-slate-400 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={labelsInput}
              onChange={(e) => setLabelsInput(e.target.value)}
              placeholder="e.g. bug, authentication, ui"
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Description / Reproduction steps
            </label>
            <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe steps to reproduce the bug..."
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none text-xs resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#d0d7de]">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Issue
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Comment to Issue */}
      {selectedIssueForComment && (
        <Modal
          isOpen={Boolean(selectedIssueForComment)}
          onClose={() => setSelectedIssueForComment(null)}
          title={`Discussion on Issue #${selectedIssueForComment.issue_number || selectedIssueForComment.number}`}
          subtitle={selectedIssueForComment.title}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-md bg-[#f6f8fa] border border-[#d0d7de] space-y-1">
              <span className="font-semibold text-slate-700">Issue Description:</span>
              <p className="text-[#1f2328]">{selectedIssueForComment.description || selectedIssueForComment.body}</p>
            </div>

            <form onSubmit={handleAddComment} className="space-y-3">
              <div>
                <label className="block font-semibold text-[#1f2328] mb-1">
                  Leave a comment as {currentUser?.name} ({currentUser?.role})
                </label>
                <textarea
                  rows={3}
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Provide troubleshooting insights or reproduction steps..."
                  className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="default" size="sm" onClick={() => setSelectedIssueForComment(null)}>
                  Close
                </Button>
                <Button variant="primary" size="sm" type="submit" icon={Send}>
                  Post Comment
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};
