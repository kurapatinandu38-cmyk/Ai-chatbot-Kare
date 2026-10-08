import { apiFetch } from '../lib/api';
import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Sparkles, 
  User, 
  Mail,
  Eye, 
  EyeOff, 
  ArrowRight
} from 'lucide-react';
import { StudentUser } from '../types';
import { KalasalingamLogo } from './KalasalingamLogo';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (student: StudentUser, token?: string) => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  // Login Form States (starts EMPTY - no default password or example prefilled)
  const [loginCredential, setLoginCredential] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cleanEmailInput = loginCredential.trim().toLowerCase();
  const isKluDomain = cleanEmailInput.endsWith('@klu.ac.in');

  if (!isOpen) return null;

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cred = loginCredential.trim();
    const pass = loginPassword.trim();

    if (!cred || !pass) {
      setLoginError('Please enter your register number / college email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiFetch('/api/auth/student-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationNumber: cred,
          collegeEmail: cred,
          credential: cred,
          email: cred,
          identifier: cred,
          password: pass
        })
      });

      let data: { success?: boolean; error?: string; student?: StudentUser; token?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error(`Login service returned an invalid response (HTTP ${res.status}). Check the Vercel deployment.`);
      }

      if (!res.ok || !data.success || !data.student) {
        setLoginError(data.error || `Login failed (HTTP ${res.status}).`);
        setIsSubmitting(false);
        return;
      }

      onLoginSuccess(data.student, data.token);
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(err instanceof Error && err.message.startsWith('Login service')
        ? err.message
        : 'Unable to reach the login service. Check the Vercel deployment and try again.');
    } finally {
      setIsSubmitting(false);
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
            <span>Student Portal Sign In</span>
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Sign in with your register number or college email.
          </p>
        </div>

        {/* Login Error Alert */}
        {loginError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* 1. Login Box (Register Number / College Email) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>Register Number / College Email</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={loginCredential}
                onChange={(e) => {
                  setLoginCredential(e.target.value);
                  if (loginError) setLoginError(null);
                }}
                placeholder="Enter Register Number or Email"
                className="w-full bg-[#12141c] border border-zinc-800 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono transition-colors"
                required
                autoFocus
              />
            </div>
          </div>

          {/* 2. Password Box */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>Password</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  if (loginError) setLoginError(null);
                }}
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
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to KARE-SIS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
