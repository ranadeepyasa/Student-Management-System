import React, { useState } from 'react';
import { Settings, Shield, HardDrive, RotateCcw, Check, Save, User } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { useDevFlow } from '../context/DevFlowContext';

export const SettingsPage = () => {
  const { currentUser, setCurrentUser, resetToDefaults } = useDevFlow();
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [role, setRole] = useState(currentUser.role);
  const [strictReviews, setStrictReviews] = useState(true);
  const [autoCi, setAutoCi] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser((prev) => ({
      ...prev,
      name,
      email,
      role,
    }));
    showToast('Profile settings updated successfully!');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all DevFlow localStorage data back to original default mock records?')) {
      resetToDefaults();
      showToast('All records reset to default mock dataset!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-orange-950 px-4 py-2.5 rounded-xl shadow-xl text-xs flex items-center gap-2 border border-orange-200">
          <Check className="w-4 h-4 text-[#4ac26b]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Breadcrumb items={[{ label: 'Settings' }]} />

      <div className="pb-2 border-b border-[#d0d7de]">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1f2328] tracking-tight">
          Platform & Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#656d76] mt-0.5">
          Manage persona preferences, branch protection policies, and persistent storage
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-lg border border-[#d0d7de] p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <User className="w-4 h-4 text-orange-600" />
          <h2 className="text-sm font-bold text-[#1f2328]">
            Collaborator Profile
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#d0d7de]"
            />
            <div>
              <p className="font-bold text-[#1f2328]">{currentUser.name}</p>
              <p className="text-slate-500 font-mono">@{currentUser.handle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#1f2328] mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none focus:border-orange-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1f2328] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none focus:border-orange-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Role Title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none focus:border-orange-500 text-xs"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" type="submit" icon={Save}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Governance & Policies */}
      <div className="bg-white rounded-lg border border-[#d0d7de] p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Shield className="w-4 h-4 text-[#1a7f37]" />
          <h2 className="text-sm font-bold text-[#1f2328]">
            Branch Protection & Collaboration Rules
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-start gap-3 p-3 rounded-lg border border-[#d0d7de] hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={strictReviews}
              onChange={(e) => {
                setStrictReviews(e.target.checked);
                showToast('Branch protection policy updated!');
              }}
              className="mt-0.5 rounded text-orange-600"
            />
            <div>
              <p className="font-semibold text-[#1f2328]">
                Require peer review approvals before merging to main
              </p>
              <p className="text-[#656d76] mt-0.5">
                Block direct pushes and ensure pull requests have passing code reviews.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-[#d0d7de] hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={autoCi}
              onChange={(e) => {
                setAutoCi(e.target.checked);
                showToast('Automated CI runner policy updated!');
              }}
              className="mt-0.5 rounded text-orange-600"
            />
            <div>
              <p className="font-semibold text-[#1f2328]">
                Automate continuous integration checks on pull request creation
              </p>
              <p className="text-[#656d76] mt-0.5">
                Simulate linting, test suite execution, and security audit on every commit.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Data & LocalStorage Management */}
      <div className="bg-white rounded-lg border border-[#d0d7de] p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <HardDrive className="w-4 h-4 text-[#8250df]" />
          <h2 className="text-sm font-bold text-[#1f2328]">
            Local Data Storage & State Reset
          </h2>
        </div>

        <p className="text-xs text-[#656d76]">
          All DevFlow entities (repositories, issues, branches, PRs, releases, activities) are persisted in your browser's <code>localStorage</code>. You can restore original sample data at any time.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="danger"
            size="sm"
            icon={RotateCcw}
            onClick={handleResetData}
          >
            Reset All Sample Data
          </Button>
        </div>
      </div>
    </div>
  );
};
