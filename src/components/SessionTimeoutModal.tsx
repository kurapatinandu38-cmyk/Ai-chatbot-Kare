import React from 'react';
import { ShieldAlert, LogOut, Clock } from 'lucide-react';
import { StudentUser, AdminUser } from '../types';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  remainingSeconds: number;
  totalWarningSeconds?: number;
  currentUser?: StudentUser | null;
  currentAdmin?: AdminUser | null;
  onLogout: () => void;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  isOpen,
  remainingSeconds,
  currentUser,
  currentAdmin,
  onLogout
}) => {
  if (!isOpen) return null;

  const displayName = currentUser?.name || currentAdmin?.name || 'User';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0e0e0e] border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-5 text-center text-zinc-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-warning-title"
      >
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>

        <div>
          <h3 id="session-warning-title" className="text-lg font-bold text-white">
            Session Security Notice
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Hi {displayName}, due to inactivity, your secure session will expire automatically to protect your institutional data.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-center justify-center gap-3">
          <Clock className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-amber-400/80 block">Auto Logout in</span>
            <span className="text-2xl font-mono font-bold text-amber-300">
              {remainingSeconds}s
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center pt-1">
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
