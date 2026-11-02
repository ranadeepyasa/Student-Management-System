import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Package,
  Download,
  Calendar,
  Check,
  GitCommit,
} from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useDevFlow } from '../context/DevFlowContext';

export const ReleasesPage = () => {
  const { releases, addRelease } = useDevFlow();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [tag, setTag] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadAsset = (assetName) => {
    showToast(`Downloading artifact: ${assetName}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!tag.trim()) {
      errs.tag = 'Tag version is required';
    } else if (!/^v?[0-9]+\.[0-9]+\.[0-9]+/i.test(tag.trim())) {
      errs.tag = 'Follow Semantic Versioning format (e.g., v1.5.0)';
    }

    if (!name.trim()) {
      errs.name = 'Release title is required';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const cleanTag = tag.trim().startsWith('v') ? tag.trim() : `v${tag.trim()}`;

    addRelease({
      tag: cleanTag,
      name: name.trim(),
      description: description.trim() || 'Production release artifact generated via DevFlow CI/CD release workflow.',
    });

    setTag('');
    setName('');
    setDescription('');
    setErrors({});
    setIsModalOpen(false);
    showToast(`Release '${cleanTag}' published!`);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-orange-950 px-4 py-2.5 rounded-xl shadow-xl text-xs flex items-center gap-2 border border-orange-200">
          <Check className="w-4 h-4 text-[#4ac26b]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Breadcrumb items={[{ label: 'Releases' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#d0d7de]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1f2328] tracking-tight">
            Release Management
          </h1>
          <p className="text-xs sm:text-sm text-[#656d76] mt-0.5">
            Release Management (Concept 6): Semantic versioning (SemVer), release notes, and deployable binaries
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Draft a new release
        </Button>
      </div>

      {/* Releases Feed */}
      <div className="space-y-6">
        {releases.map((rel, index) => (
          <div
            key={rel.id}
            className="bg-white rounded-lg border border-[#d0d7de] p-5 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b]/40 rounded-full font-mono font-bold text-xs">
                  {rel.tag}
                </span>
                {index === 0 && (
                  <Badge variant="blue" size="xs">
                    Latest
                  </Badge>
                )}
                <h3 className="text-base font-bold text-[#1f2328]">
                  {rel.name}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#656d76]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {rel.publishedAt}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                  <GitCommit className="w-3 h-3 text-orange-600" /> {rel.commitHash}
                </span>
              </div>
            </div>

            {/* Release Description / Markdown changelog */}
            <div className="text-xs text-[#1f2328] whitespace-pre-line leading-relaxed bg-[#f6f8fa] p-4 rounded-md border border-slate-200">
              {rel.description}
            </div>

            {/* Assets List */}
            <div>
              <div className="text-xs font-semibold text-[#1f2328] mb-2 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-orange-600" /> Release Assets & Binaries
              </div>
              <div className="bg-white rounded-md border border-[#d0d7de] divide-y divide-slate-100">
                {rel.assets?.map((asset, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 px-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs"
                  >
                    <span className="font-mono text-orange-600 hover:underline cursor-pointer">
                      {asset.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#656d76] font-mono">{asset.size}</span>
                      <button
                        onClick={() => handleDownloadAsset(asset.name)}
                        className="p-1 rounded text-slate-500 hover:text-orange-600 hover:bg-slate-100"
                        title="Download artifact"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Draft Release */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Draft a new release"
        subtitle="Tag version and publish deployment notes"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1f2328] mb-1">
                Tag version <span className="text-[#cf222e]">*</span>
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. v1.5.0"
                className={`w-full px-3 py-2 border rounded-md outline-none text-xs font-mono ${
                  errors.tag ? 'border-[#cf222e]' : 'border-[#d0d7de] focus:border-orange-500'
                }`}
              />
              {errors.tag && (
                <p className="text-[#cf222e] text-[11px] mt-1">{errors.tag}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-[#1f2328] mb-1">
                Target Branch
              </label>
              <select
                className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none bg-white text-xs font-mono"
              >
                <option value="main">main (HEAD)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Release title <span className="text-[#cf222e]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. DevFlow v1.5.0 – Performance & Telemetry Update"
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
              Describe this release (Changelog)
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="### New Features&#10;- Added distributed telemetry traces&#10;- Upgraded websocket listener memory management"
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none text-xs font-mono resize-none"
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
              Publish release
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
