import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  FileCode,
  ShieldCheck,
  Check,
  Plus,
  GitPullRequest,
} from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useDevFlow } from '../context/DevFlowContext';

export const CodeReviewsPage = () => {
  const { codeReviews, pullRequests, currentUser } = useDevFlow();
  const [reviewsList, setReviewsList] = useState(codeReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPr, setSelectedPr] = useState(pullRequests[0]?.number || 44);
  const [verdict, setVerdict] = useState('APPROVED');
  const [reviewSummary, setReviewSummary] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewSummary.trim()) return;

    const prObj = pullRequests.find((p) => p.number === Number(selectedPr));

    const newRev = {
      id: `rev-${Date.now()}`,
      prNumber: Number(selectedPr),
      prTitle: prObj?.title || 'Pull Request Review',
      repository: prObj?.repository || 'devflow-core',
      reviewer: currentUser.name,
      status: verdict,
      summary: reviewSummary.trim(),
      submittedAt: 'Just now',
      lineComments: Math.floor(Math.random() * 3) + 1,
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewSummary('');
    setIsModalOpen(false);
    showToast(`Code review submitted: ${verdict}!`);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1f2328] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-slate-700">
          <Check className="w-4 h-4 text-[#4ac26b]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Breadcrumb items={[{ label: 'Code Reviews' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#d0d7de]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1f2328] tracking-tight">
            Code Review & Quality Governance
          </h1>
          <p className="text-xs sm:text-sm text-[#656d76] mt-0.5">
            Code Review (Concept 5): Line-by-line inspection, architectural mentorship, and merge sign-offs
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Submit Review
        </Button>
      </div>

      {/* Review Guidelines Banner */}
      <div className="bg-white border border-[#d0d7de] rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-[#ddf4ff] text-[#0969da] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[#1f2328]">Peer Review Best Practices</h4>
            <p className="text-[#656d76] mt-0.5">
              Every production merge requires at least one approving review and clean lint/security CI status.
            </p>
          </div>
        </div>
        <Badge variant="blue" size="sm">
          Strict Mode Active
        </Badge>
      </div>

      {/* Code Reviews Feed */}
      <div className="bg-white rounded-lg border border-[#d0d7de] divide-y divide-[#d0d7de]">
        {reviewsList.map((rev) => (
          <div key={rev.id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {rev.status === 'APPROVED' ? (
                  <Badge variant="green" size="sm">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </span>
                  </Badge>
                ) : (
                  <Badge variant="red" size="sm">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Changes Requested
                    </span>
                  </Badge>
                )}

                <span className="font-semibold text-xs text-[#1f2328]">
                  by {rev.reviewer}
                </span>

                <span className="text-[11px] text-[#656d76]">
                  • {rev.submittedAt}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#656d76]">
                <FileCode className="w-3.5 h-3.5" />
                <span>{rev.lineComments} inline comments</span>
              </div>
            </div>

            {/* PR Reference */}
            <div className="bg-[#f6f8fa] p-3 rounded-md border border-[#d0d7de] text-xs">
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#0969da] mb-1">
                <GitPullRequest className="w-3 h-3" />
                <span className="font-bold">PR #{rev.prNumber}</span>
                <span className="text-[#656d76]">in {rev.repository}</span>
              </div>
              <p className="font-semibold text-[#1f2328] mb-1.5">{rev.prTitle}</p>
              <p className="text-slate-700 italic border-l-2 border-[#0969da] pl-2.5 py-0.5">
                "{rev.summary}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Submit Code Review */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Code Review"
        subtitle="Provide review feedback and merge approval"
      >
        <form onSubmit={handleAddReview} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Select Pull Request to Review
            </label>
            <select
              value={selectedPr}
              onChange={(e) => setSelectedPr(e.target.value)}
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none bg-white text-xs"
            >
              {pullRequests.map((p) => (
                <option key={p.id} value={p.number}>
                  PR #{p.number}: {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Review Decision
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVerdict('APPROVED')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold ${
                  verdict === 'APPROVED'
                    ? 'border-[#1a7f37] bg-[#dafbe1] text-[#1a7f37]'
                    : 'border-[#d0d7de] bg-white text-[#656d76]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Changes
              </button>

              <button
                type="button"
                onClick={() => setVerdict('CHANGES_REQUESTED')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold ${
                  verdict === 'CHANGES_REQUESTED'
                    ? 'border-[#cf222e] bg-[#ffebe9] text-[#cf222e]'
                    : 'border-[#d0d7de] bg-white text-[#656d76]'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                Request Changes
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Review Summary & Comments
            </label>
            <textarea
              rows={3}
              required
              value={reviewSummary}
              onChange={(e) => setReviewSummary(e.target.value)}
              placeholder="State your review conclusions, verify security or performance aspects..."
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
              Submit Review Verdict
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
