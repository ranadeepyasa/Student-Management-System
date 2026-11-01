import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  GitBranch,
  GitPullRequest,
  CheckCircle2,
  Tag,
  AlertCircle,
  Code2,
  ExternalLink,
  ShieldCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Modal } from './Modal';
import { CORE_CONCEPTS_INFO } from '../../data/mockData';
import { Button } from './Button';

export const HelpModal = ({ isOpen, onClose }) => {
  const [selectedConcept, setSelectedConcept] = useState(CORE_CONCEPTS_INFO[0]);
  const navigate = useNavigate();

  const getConceptIcon = (id) => {
    switch (id) {
      case 1:
        return Code2;
      case 2:
        return AlertCircle;
      case 3:
        return GitBranch;
      case 4:
        return GitPullRequest;
      case 5:
        return CheckCircle2;
      case 6:
        return Tag;
      default:
        return Layers;
    }
  };

  const handleNavigate = (route) => {
    onClose();
    navigate(route);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="DevFlow Educational Guide & Architecture"
      subtitle="Mastering the 6 Core GitHub Collaborative Software Development Concepts"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Educational Disclaimer Banner */}
        <div className="bg-[#ddf4ff] border border-[#54aeff]/40 rounded-lg p-3 text-xs text-[#0969da] flex items-start gap-2.5">
          <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Educational Platform Notice:</span> DevFlow is an interactive learning simulator designed to demonstrate modern software team workflows and Git collaboration paradigms. It is inspired by industry GitHub practices.
          </div>
        </div>

        {/* Concept Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CORE_CONCEPTS_INFO.map((concept) => {
            const Icon = getConceptIcon(concept.id);
            const isSelected = selectedConcept.id === concept.id;
            return (
              <button
                key={concept.id}
                onClick={() => setSelectedConcept(concept)}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-[#0969da] bg-[#f0f6fc] text-[#0969da] ring-1 ring-[#0969da]'
                    : 'border-[#d0d7de] hover:border-slate-400 bg-white text-[#1f2328]'
                }`}
              >
                <div
                  className={`p-1.5 rounded-md ${
                    isSelected ? 'bg-[#0969da] text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate leading-tight">
                    {concept.id}. {concept.title}
                  </div>
                  <div className="text-[10px] text-[#656d76] truncate">
                    {concept.tag}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Concept Detailed Card */}
        {selectedConcept && (
          <div className="bg-[#f6f8fa] border border-[#d0d7de] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#ddf4ff] text-[#0969da] border border-[#54aeff]/30">
                  Concept #{selectedConcept.id}
                </span>
                <h4 className="text-sm font-bold text-[#1f2328]">
                  {selectedConcept.title}
                </h4>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => handleNavigate(selectedConcept.route)}
              >
                Explore Module
              </Button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-slate-700">What it is: </span>
                <span className="text-[#656d76]">{selectedConcept.description}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">How industry software teams use it: </span>
                <span className="text-[#656d76]">{selectedConcept.industryUse}</span>
              </div>
            </div>

            {/* Workflow Diagram simulation */}
            <div className="bg-white rounded-md border border-[#d0d7de] p-3 text-xs">
              <div className="text-[11px] font-semibold text-[#656d76] uppercase tracking-wider mb-2">
                Simulated Team Lifecycle
              </div>
              <div className="flex items-center justify-between text-[11px] overflow-x-auto pb-1 gap-2 text-slate-600">
                <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200 shrink-0">1. Commit Code</span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200 shrink-0">2. File Issue</span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200 shrink-0">3. Branch Out</span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200 shrink-0">4. Open PR</span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200 shrink-0">5. Peer Review</span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-1 bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b]/40 font-semibold rounded shrink-0">6. Tag Release</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="default" onClick={onClose}>
            Got it, close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
