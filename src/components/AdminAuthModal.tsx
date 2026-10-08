import { apiFetch } from '../lib/api';
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  X, 
  AlertCircle, 
  ArrowRight
} from 'lucide-react';
import { AdminUser, AdminAuthResponse } from '../types';
import { KalasalingamLogo } from './KalasalingamLogo';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (admin: AdminUser) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordManuallyEdited, setIsPasswordManuallyEdited] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIdentifier(val);
    if (errorMessage) setErrorMessage(null);

    // Default password is what the faculty entered ID is (unless manually changed)
    if (!isPasswordManuallyEdited) {
      setPassword(val);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsPasswordManuallyEdited(true);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = identifier.trim();
    // Default to entered ID if password is empty
    const cleanPass = (password || cleanId).trim();

    if (!cleanId) {
      setErrorMessage('Please enter your Faculty ID or University Email.');
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identifier: cleanId, 
          password: cleanPass 
        })
      });

      const data: AdminAuthResponse = await res.json();

      if (res.ok && data.success && data.admin) {
        onSuccess(data.admin!);
        onClose();
      } else {
        setErrorMessage(data.error || 'Invalid credentials. Default password is your entered Faculty ID.');
      }
    } catch (err: any) {
      console.error('Admin Auth Error:', err);
      setErrorMessage('Network error during authentication. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl w-full max-w-md p-6 relative shadow-2xl text-zinc-100 overflow-hidden my-auto">
        
        {/* Subtle decorative top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge & Title with Kalasalingam 3D Logo */}
        <div className="space-y-2 mb-4">
          <KalasalingamLogo size="sm" variant="badge" />
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Faculty & Admin Login</span>
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Authorized administrative access. Please enter your credentials to proceed.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Faculty ID / Email */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Faculty ID / University Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={identifier}
                onChange={handleIdentifierChange}
                placeholder="Enter Faculty ID or Email"
                className="w-full bg-[#12141c] border border-zinc-800 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono transition-colors"
                required
                autoFocus
              />
            </div>
          </div>

          {/* 2. Password */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter Password"
                className="w-full bg-[#12141c] border border-zinc-800 focus:border-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
