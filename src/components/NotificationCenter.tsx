import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  FileText,
  Pin,
  X
} from 'lucide-react';
import { AnnouncementItem, StudentUser } from '../types';

interface NotificationCenterProps {
  announcements: AnnouncementItem[];
  unreadIds: string[];
  onOpenAnnouncement: (announcement: AnnouncementItem) => void;
  onMarkAllAsRead: () => void;
  currentUser?: StudentUser | null;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  announcements,
  unreadIds,
  onOpenAnnouncement,
  onMarkAllAsRead,
  currentUser
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter announcements based on user cohort if applicable
  const relevantAnnouncements = announcements.filter(ann => {
    if (!currentUser) return true;
    if (ann.targetCohort === 'all') return true;
    if (currentUser.cohort === 'first_year' && ann.targetCohort === 'first_year') return true;
    if (currentUser.cohort === 'senior_year' && ann.targetCohort === 'senior_year') return true;
    return true; // Still visible in full notice board
  });

  const unreadCount = relevantAnnouncements.filter(a => unreadIds.includes(a.id)).length;
  const hasUrgentUnread = relevantAnnouncements.some(a => a.priority === 'urgent' && unreadIds.includes(a.id));

  const filteredList = relevantAnnouncements.filter(ann => {
    if (filter === 'unread') return unreadIds.includes(ann.id);
    if (filter === 'urgent') return ann.priority === 'urgent' || ann.priority === 'high';
    return true;
  });

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        id="btn-notification-bell"
        onClick={() => setIsOpen(prev => !prev)}
        className={`relative p-2 rounded-xl transition-all border ${
          isOpen
            ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
            : unreadCount > 0
              ? 'bg-zinc-900/90 text-zinc-200 border-zinc-800 hover:border-zinc-700 hover:text-white'
              : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/80 hover:border-zinc-700 hover:text-zinc-200'
        }`}
        title={`${unreadCount} Unread University Announcements`}
      >
        <Bell className={`w-4 h-4 ${hasUrgentUnread ? 'text-rose-400 animate-bounce' : ''}`} />

        {/* Unread Counter Badge */}
        {unreadCount > 0 && (
          <span 
            className={`absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[18px] h-[18px] rounded-full text-[10px] font-extrabold flex items-center justify-center text-white border shadow-sm ${
              hasUrgentUnread 
                ? 'bg-rose-600 border-rose-400 animate-pulse' 
                : 'bg-blue-600 border-blue-400'
            }`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0e0e12] border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-fadeIn text-zinc-100 max-h-[82vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-3.5 pb-3 border-b border-zinc-800/80 bg-zinc-950/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Admin Announcements</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-blue-600 text-white">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    Official notices & circulars from Administration
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs & Mark All as Read */}
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-2 py-0.5 rounded-md font-medium text-[10px] transition-all ${
                    filter === 'all' 
                      ? 'bg-blue-600 text-white font-bold' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  All ({relevantAnnouncements.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('unread')}
                  className={`px-2 py-0.5 rounded-md font-medium text-[10px] transition-all ${
                    filter === 'unread' 
                      ? 'bg-blue-600 text-white font-bold' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('urgent')}
                  className={`px-2 py-0.5 rounded-md font-medium text-[10px] transition-all ${
                    filter === 'urgent' 
                      ? 'bg-rose-600 text-white font-bold' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Urgent
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="text-[10px] text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* List of Announcements */}
          <div className="overflow-y-auto divide-y divide-zinc-800/50 max-h-[360px] overscroll-contain">
            {filteredList.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-zinc-500">
                <CheckCircle2 className="w-8 h-8 mx-auto text-zinc-600" />
                <p className="text-xs font-medium text-zinc-400">All caught up!</p>
                <p className="text-[11px] text-zinc-600">No {filter === 'unread' ? 'unread' : ''} announcements at this moment.</p>
              </div>
            ) : (
              filteredList.map((ann) => {
                const isUnread = unreadIds.includes(ann.id);
                return (
                  <div
                    key={ann.id}
                    onClick={() => {
                      setIsOpen(false);
                      onOpenAnnouncement(ann);
                    }}
                    className={`p-3.5 hover:bg-zinc-900/80 cursor-pointer transition-all flex items-start gap-3 group relative ${
                      isUnread ? 'bg-blue-950/20' : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    {/* Priority Icon */}
                    <div className="shrink-0 mt-0.5">
                      {ann.priority === 'urgent' ? (
                        <div className="w-7 h-7 rounded-lg bg-rose-950/80 text-rose-400 border border-rose-800/60 flex items-center justify-center">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      ) : ann.priority === 'high' ? (
                        <div className="w-7 h-7 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800/60 flex items-center justify-center">
                          <Bell className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-800/60 flex items-center justify-center">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Content Snippet */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {ann.isPinned && (
                          <span className="text-[9px] font-bold text-amber-400 flex items-center gap-0.5">
                            <Pin className="w-2.5 h-2.5" /> Pinned
                          </span>
                        )}
                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider bg-blue-950/50 px-1.5 py-0.2 rounded border border-blue-900/40">
                          {ann.category}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono ml-auto">
                          {formatTimeAgo(ann.publishedAt)}
                        </span>
                      </div>

                      <h4 className={`text-xs leading-snug group-hover:text-blue-300 transition-colors ${
                        isUnread ? 'font-bold text-white' : 'font-medium text-zinc-300'
                      }`}>
                        {ann.title}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
                        <span className="truncate max-w-[190px] text-zinc-400">
                          By {ann.authorName}
                        </span>
                        <span className="text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                          Open <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {/* Unread indicator dot */}
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2 shadow-sm shadow-blue-500" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-between text-[10px] text-zinc-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> KARE Official Administration
            </span>
            <span className="font-mono">{relevantAnnouncements.length} Total Notices</span>
          </div>

        </div>
      )}
    </div>
  );
};
