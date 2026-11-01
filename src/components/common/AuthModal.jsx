import React, { useState } from 'react';
import { Shield, Key, User, Check, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useDevFlow } from '../../context/DevFlowContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { loginUser, switchUserPersona, teamMembers } = useDevFlow();
  const [identifier, setIdentifier] = useState('admin_sarah');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await loginUser(identifier, password);
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Failed to authenticate');
    }
  };

  const handleQuickPersona = async (member) => {
    await switchUserPersona(member);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="DevFlow Team Authentication"
      subtitle="Login with your credentials or simulate any of the 5 collaborative team roles"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs">
        {error && (
          <div className="p-2.5 rounded-md bg-[#ffebe9] border border-[#ff8182]/40 text-[#cf222e] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Persona Simulator */}
        <div>
          <span className="text-[11px] font-bold text-[#656d76] uppercase tracking-wider block mb-1.5">
            1-Click 5-Role Laptop Simulation
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {teamMembers.slice(0, 5).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleQuickPersona(m)}
                className="flex items-center justify-between p-2 rounded-md border border-[#d0d7de] hover:border-[#0969da] hover:bg-[#ddf4ff]/20 text-left transition-all"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={m.avatar || m.avatar_url}
                    alt={m.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-semibold text-[#1f2328]">{m.name}</span>
                    <span className="text-[10px] text-[#0969da] ml-1.5 font-medium">({m.role})</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Sign in →</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 my-2 text-slate-400">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[10px] uppercase font-semibold">Or credentials</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Standard Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Username or Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none focus:border-[#0969da] text-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1f2328] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-[#d0d7de] rounded-md outline-none focus:border-[#0969da] text-xs font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#d0d7de]">
            <Button variant="default" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
