import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { AnnouncementItem } from '../types';

interface AnnouncementToastProps {
  announcement: AnnouncementItem | null;
  onOpen: (announcement: AnnouncementItem) => void;
  onDismiss: () => void;
}

export const AnnouncementToast: React.FC<AnnouncementToastProps> = ({
  announcement,
  onOpen,
  onDismiss
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (announcement) {
      setVisible(true);
      // Auto-dismiss after 12 seconds unless interacted with
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 12000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [announcement, onDismiss]);

  if (!announcement || !visible) return null;

  const isUrgent = announcement.priority === 'urgent';
  const isHigh = announcement.priority === 'high';

  return (
    <div 
      className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] animate-bounce-short"
      onClick={() => {
        setVisible(false);
        onOpen(announcement);
      }}
    >
      <div 
        className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-md cursor-pointer transition-all hover:scale-[1.02] ${
          isUrgent
            ? 'bg-rose-950/95 border-rose-500/70 text-rose-100 shadow-rose-950/50'
            : isHigh
              ? 'bg-amber-950/95 border-amber-500/70 text-amber-100 shadow-amber-950/50'
              : 'bg-[#0f111a]/95 border-blue-600/70 text-zinc-100 shadow-blue-950/50'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`p-2.5 rounded-xl shrink-0 ${
            isUrgent 
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse' 
              : isHigh 
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/40' 
                : 'bg-blue-600 text-white shadow-lg shadow-blue-600/40'
          }`}>
            {isUrgent ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
          </div>

          {/* Body */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isUrgent 
                  ? 'bg-rose-900/80 text-rose-200 border border-rose-700/60' 
                  : isHigh 
                    ? 'bg-amber-900/80 text-amber-200 border border-amber-700/60' 
                    : 'bg-blue-900/80 text-blue-200 border border-blue-700/60'
              }`}>
                📢 {isUrgent ? 'Urgent Notice' : 'Admin Announcement'}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setVisible(false);
                  setTimeout(onDismiss, 200);
                }}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-black/20 transition-colors"
                title="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="text-xs font-bold leading-tight line-clamp-2 text-white">
              {announcement.title}
            </h4>

            <p className="text-[11px] text-zinc-300 line-clamp-2 opacity-90">
              {announcement.content}
            </p>

            <div className="flex items-center justify-between pt-1.5 text-[10px] border-t border-white/10">
              <span className="text-zinc-400 font-mono truncate max-w-[170px]">
                {announcement.authorRole}
              </span>

              <span className="inline-flex items-center gap-1 font-bold text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors">
                <span>Click to Open Notice</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
