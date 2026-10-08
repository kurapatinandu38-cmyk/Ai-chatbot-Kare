import { apiFetch } from '../lib/api';
import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  User,
  Mail,
  GraduationCap
} from 'lucide-react';
import { VerifyTokenResponse, ResetPasswordResponse } from '../types';

interface ResetPasswordModalProps {
  isOpen: boolean;
  token: string | null;
  onClose: () => void;
  onSuccess: (identifier?: string, userType?: 'student' | 'admin') => void;
  onRequestNewLink?: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  token,
  onClose,
  onSuccess,
  onRequestNewLink
}) => {
  const [isValidating, setIsValidating] = useState(true);
  const [tokenData, setTokenData] = useState<VerifyTokenResponse | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Validate token whenever modal opens or token changes
  useEffect(() => {
    if (!isOpen || !token) {
      setIsValidating(false);
      return;
    }

    let isMounted = true;
    const verifyToken = async () => {
      setIsValidating(true);
      setValidationError(null);
      setSubmitError(null);
      setIsSuccess(false);

      try {
        const res = await apiFetch(`/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
        const data: VerifyTokenResponse = await res.json();

        if (!isMounted) return;

        if (res.ok && data.valid) {
          setTokenData(data);
          setValidationError(null);
        } else {
          setValidationError(data.error || 'This password reset link is invalid or has expired.');
          setTokenData(null);
        }
      } catch (err) {
        if (!isMounted) return;
        setValidationError('Failed to verify the password reset link. Please check your network connection.');
      } finally {
        if (isMounted) setIsValidating(false);
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [isOpen, token]);

  if (!isOpen) return null;

  const isLengthValid = newPassword.length >= 4;
  const isMatchValid = newPassword.length > 0 && newPassword === confirmPassword;
  const canSubmit = isLengthValid && isMatchValid && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!isLengthValid) {
      setSubmitError('Password must be at least 4 characters long.');
      return;
    }

    if (!isMatchValid) {
      setSubmitError('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: newPassword.trim()
        })
      });

      const data: ResetPasswordResponse = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
        setSuccessMessage(data.message || 'Password has been successfully reset!');
        // Clean URL token
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('resetToken');
          window.history.replaceState({}, '', url.pathname);
        }
      } else {
        setSubmitError(data.error || 'Failed to update password. Please try requesting a new link.');
      }
    } catch (err) {
      console.error('Password reset submit error:', err);
      setSubmitError('Network error while resetting password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    onSuccess(tokenData?.identifier, tokenData?.userType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b0f19] border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl text-zinc-100 overflow-hidden">
        
        {/* Subtle top decorative bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ================= LOADING STATE ================= */}
        {isValidating && (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-zinc-300 font-medium">
              Verifying secure password reset token...
            </p>
            <p className="text-[11px] text-zinc-500">
              Validating token with KARE University authentication server
            </p>
          </div>
        )}

        {/* ================= TOKEN INVALID / EXPIRED ================= */}
        {!isValidating && validationError && (
          <div className="space-y-4 py-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-800/80 flex items-center justify-center text-rose-400 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-white">Reset Link Invalid or Expired</h3>
              <p className="text-xs text-rose-300/90 leading-relaxed px-2">
                {validationError}
              </p>
              <p className="text-[11px] text-zinc-400">
                Security links expire after 10 minutes or after being used once to protect your account.
              </p>
            </div>

            <div className="pt-3 space-y-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onRequestNewLink) onRequestNewLink();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Request a New Reset Link</span>
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* ================= SUCCESS STATE ================= */}
        {!isValidating && isSuccess && (
          <div className="space-y-4 py-2 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-white">Password Reset Successful!</h3>
              <p className="text-xs text-emerald-300 leading-relaxed">
                {successMessage || 'Your account password has been securely updated.'}
              </p>
              {tokenData && (
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 mt-2">
                  <span>Account: </span>
                  <strong className="text-white font-mono">{tokenData.identifier}</strong>
                </div>
              )}
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={handleComplete}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <span>Proceed to Sign In with New Password</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= FORM VIEW (VALID TOKEN) ================= */}
        {!isValidating && !validationError && !isSuccess && tokenData && (
          <div className="space-y-4">
            
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600/10 text-blue-400 border border-blue-500/30">
                <ShieldCheck className="w-3 h-3" /> Password Reset via Link
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Create New Password
              </h2>
              <p className="text-xs text-zinc-400">
                Set a secure new password for your KARE University portal account.
              </p>
            </div>

            {/* Target Account Info Badge */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/90 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-[11px] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <strong className="text-white">{tokenData.name}</strong>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  {tokenData.userType === 'admin' ? 'University Admin' : 'Student Account'}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 pt-0.5 font-mono">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>{tokenData.email}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">{tokenData.identifier}</span>
              </div>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  New Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (submitError) setSubmitError(null);
                    }}
                    placeholder="Enter new password (min. 4 characters)"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Confirm New Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (submitError) setSubmitError(null);
                    }}
                    placeholder="Re-enter your new password"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Quality Indicator */}
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
                <div className={`flex items-center gap-1.5 ${isLengthValid ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>At least 4 characters long</span>
                </div>
                <div className={`flex items-center gap-1.5 ${isMatchValid ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Both passwords match</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Save New Password</span>
                  </>
                )}
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
