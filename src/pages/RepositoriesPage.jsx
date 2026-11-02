import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Plus,
  Search,
  Star,
  GitFork,
  Circle,
  Lock,
  Globe,
  Filter,
  Check,
  ExternalLink,
  GitCommit,
  GitBranch,
} from 'lucide-react';
import { Github } from '../components/common/GithubIcon';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useDevFlow } from '../context/DevFlowContext';
import { api } from '../services/api';

export const RepositoriesPage = () => {
  const { repositories: contextRepos, addRepository, commits, branches } = useDevFlow();
  const [repositories, setRepositories] = useState(contextRepos || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLang, setSelectedLang] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [githubInfo, setGithubInfo] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [lang, setLang] = useState('JavaScript');
  const [isPrivate, setIsPrivate] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadData() {
      try {
        const gh = await api.getGitHubStatus();
        if (gh.success) {
          setGithubInfo(gh.repository);
        }
        const proj = await api.getProjects();
        if (proj.success && proj.projects?.length > 0) {
          setRepositories(proj.projects);
        }
      } catch (e) {
        console.warn('Using local repositories fallback:', e);
      }
    }
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredRepos = repositories.filter((repo) => {
    const matchesSearch =
      (repo.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang =
      selectedLang === 'all' || repo.primaryLanguage === selectedLang || repo.primary_language === selectedLang;
    return matchesSearch && matchesLang;
  });

  const languages = ['JavaScript', 'TypeScript', 'Python', 'Go', 'CSS'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) {
      errs.name = 'Repository name is required';
    } else if (!/^[a-z0-9-_]+$/i.test(name.trim())) {
      errs.name = 'Use only alphanumeric characters, hyphens, or underscores';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const langColors = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      Go: '#00add8',
      CSS: '#563d7c',
    };

    const newRepo = {
      id: `repo-${Date.now()}`,
      name: name.trim(),
      description: desc.trim() || 'Software repository managed with DevFlow Git workflows.',
      primaryLanguage: lang,
      languageColor: langColors[lang] || '#ea580c',
      isPrivate,
      stars: 0,
      forks: 0,
      defaultBranch: 'main',
      updatedAt: 'Just now',
    };

    addRepository(newRepo);
    setRepositories([newRepo, ...repositories]);
    setName('');
    setDesc('');
    setErrors({});
    setIsModalOpen(false);
    showToast(`Repository '${name.trim()}' created!`);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-orange-950 px-4 py-2.5 rounded-xl shadow-xl text-xs flex items-center gap-2 border border-orange-200">
          <Check className="w-4 h-4 text-[#4ac26b]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Breadcrumb items={[{ label: 'Repositories' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#d0d7de]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1f2328] tracking-tight">
            Source Code Management
          </h1>
          <p className="text-xs sm:text-sm text-[#656d76] mt-0.5">
            Concept 1: Repositories, atomic commit trees, and live GitHub synchronization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/ranadeepyasa/Student-Management-System"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1f2328] bg-white border border-[#d0d7de] hover:bg-slate-50 rounded-md transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub Remote
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          >
            New Repository
          </Button>
        </div>
      </div>

      {/* Primary Connected GitHub Repository Card */}
      <div className="bg-orange-50/70 text-slate-900 rounded-2xl p-6 border border-orange-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white">
                Live GitHub Remote
              </span>
              <span className="text-xs text-slate-600 font-mono">
                ranadeepyasa / Student-Management-System
              </span>
            </div>
            <h2 className="text-lg font-bold">
              Student Management System
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Academic Collaborative Software Development demonstration showing GitFlow, issue tracking, pull requests, and automated CI/CD pipelines.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-slate-600 font-medium">
              <span className="flex items-center gap-1 font-mono">
                <GitBranch className="w-3.5 h-3.5 text-orange-600" /> Branch: <strong>main</strong>
              </span>
              <span className="flex items-center gap-1 font-mono">
                <GitCommit className="w-3.5 h-3.5 text-orange-600" /> Latest SHA: <strong>03dc2d2</strong>
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400" /> {githubInfo?.stars || 1} star
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5 text-slate-400" /> {githubInfo?.forks || 0} forks
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <a
              href="https://github.com/ranadeepyasa/Student-Management-System"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-colors text-center"
            >
              Open on GitHub <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#656d76] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Find a repository..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#d0d7de] rounded-md outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#656d76] bg-white border border-[#d0d7de] px-2.5 py-1.5 rounded-md">
            <Filter className="w-3.5 h-3.5" />
            <span>Language:</span>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-transparent font-medium text-[#1f2328] outline-none"
            >
              <option value="all">All</option>
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Repositories List */}
      <div className="bg-white rounded-lg border border-[#d0d7de] divide-y divide-[#d0d7de]">
        {filteredRepos.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#656d76] space-y-2">
            <FolderGit2 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No repositories matched your filter</p>
          </div>
        ) : (
          filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-orange-600 hover:underline cursor-pointer">
                    {repo.name}
                  </h3>
                  <Badge variant="outline" size="xs">
                    {repo.is_private || repo.isPrivate ? (
                      <span className="flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Private
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Globe className="w-2.5 h-2.5" /> Public
                      </span>
                    )}
                  </Badge>
                </div>

                <p className="text-xs text-[#656d76] leading-relaxed">
                  {repo.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#656d76] pt-1 font-medium">
                  {(repo.primaryLanguage || repo.primary_language) && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: repo.languageColor || '#ea580c' }}
                      />
                      <span>{repo.primaryLanguage || repo.primary_language}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" /> {repo.stars || repo.stars_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5" /> {repo.forks || repo.forks_count || 0}
                  </span>
                  <span>Branch: <strong className="font-mono">{repo.defaultBranch || repo.default_branch || 'main'}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="default" size="sm">
                  Star
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Repo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a new repository"
        subtitle="Initialize source code repository for your team"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Repository name <span className="text-[#cf222e]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. notifications-worker"
              className={`w-full px-3 py-2 border rounded-md outline-none text-xs ${
                errors.name ? 'border-[#cf222e]' : 'border-[#d0d7de] focus:border-orange-500'
              }`}
            />
            {errors.name && (
              <p className="text-[#cf222e] text-[11px] mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Description
            </label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What does this repository do?"
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none focus:border-orange-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1f2328] mb-1">
                Primary Language
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none bg-white focus:border-orange-500 text-xs"
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
                Access
              </label>
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="modal_vis"
                    checked={!isPrivate}
                    onChange={() => setIsPrivate(false)}
                  />
                  <span>Public</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="modal_vis"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(true)}
                  />
                  <span>Private</span>
                </label>
              </div>
            </div>
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
              Create repository
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
