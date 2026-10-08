import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Printer, 
  FileText, 
  AlertTriangle,
  Sparkles,
  Users,
  GraduationCap,
  Download,
  Pin
} from 'lucide-react';
import { AnnouncementItem } from '../types';

interface AnnouncementModalProps {
  isOpen?: boolean;
  announcement: AnnouncementItem | null;
  onClose: () => void;
  onMarkAsRead?: (id: string) => void;
  isRead?: boolean;
  onNavigateTab?: (tab: 'chat' | 'nlp' | 'faqs' | 'admin' | 'admissions') => void;
  onNavigate?: (tab: string) => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  announcement,
  onClose,
  onMarkAsRead,
  isRead = false,
  onNavigateTab,
  onNavigate
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<{ name: string; size?: string } | null>(null);

  // If isOpen is explicitly passed use it, otherwise show if announcement exists
  const isModalOpen = isOpen !== undefined ? isOpen : !!announcement;
  if (!isModalOpen || !announcement) return null;

  const handleCopyLink = () => {
    const textToCopy = `[KARE University Circular ${announcement.circularNumber}]\n${announcement.title}\n\n${announcement.content}\n\nIssued by: ${announcement.authorName} (${announcement.authorRole})`;
    try {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownloadAttachment = (attName: string) => {
    try {
      const fileContent = `========================================================================
KALASALINGAM ACADEMY OF RESEARCH AND EDUCATION (DEEMED TO BE UNIVERSITY)
OFFICIAL CIRCULAR / ADMINISTRATIVE DIRECTIVE
========================================================================
Circular Ref No : ${announcement.circularNumber}
Date Published  : ${new Date(announcement.publishedAt).toLocaleDateString()}
Category        : ${announcement.category}
Priority        : ${announcement.priority.toUpperCase()}
Issued By       : ${announcement.authorName} (${announcement.authorRole})
Target Cohort   : ${announcement.targetCohort}
Department      : ${announcement.targetDepartment || 'All University Departments'}
------------------------------------------------------------------------
SUBJECT: ${announcement.title}
------------------------------------------------------------------------

${announcement.content}

------------------------------------------------------------------------
AUTHENTICATION SEAL:
[Digitally Signed & Certified by Office of Academic Administration, KARE]
Ref Verification ID: ${announcement.id}
Generated Document : ${attName}
========================================================================`;

      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attName.endsWith('.pdf') ? attName.replace(/\.pdf$/, '.txt') : attName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(`Downloaded "${attName}"`);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error('Error downloading attachment:', err);
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      handleCopyLink();
    }
  };

  const getPriorityBadge = (priority: AnnouncementItem['priority']) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-600/60 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-400" /> Urgent Administrative Notice
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-600/60">
            <Bell className="w-3 h-3 text-amber-400" /> High Priority
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950/80 text-blue-300 border border-blue-600/60">
            <FileText className="w-3 h-3 text-blue-400" /> University Circular
          </span>
        );
    }
  };

  const getCohortBadge = (cohort: AnnouncementItem['targetCohort']) => {
    switch (cohort) {
      case 'first_year':
        return '1st Year Freshers Only';
      case 'senior_year':
        return 'Senior Batches (2nd, 3rd & 4th Year)';
      default:
        return 'All Student Cohorts & Faculty';
    }
  };

  const formattedDate = new Date(announcement.publishedAt).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-[#0b0b0f] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl text-zinc-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Bar */}
        <div className={`h-1.5 w-full ${
          announcement.priority === 'urgent' 
            ? 'bg-gradient-to-r from-rose-600 via-red-500 to-amber-500' 
            : announcement.priority === 'high'
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500'
        }`} />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-zinc-800/80 space-y-3 relative">
          
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 transition-colors"
            title="Close circular"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Official University Seal & Header */}
          <div className="flex items-center gap-3 pr-10">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/30 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
                <span>Kalasalingam Academy of Research and Education</span>
                <span className="hidden sm:inline">•</span>
                <span className="text-zinc-500 font-mono text-[10px]">Deemed to be University</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="font-mono text-xs text-blue-400 font-bold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                  {announcement.circularNumber}
                </span>
                {announcement.isPinned && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-950/60 text-amber-400 border border-amber-800/40">
                    <Pin className="w-2.5 h-2.5" /> Pinned Notice
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Badges Bar */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {getPriorityBadge(announcement.priority)}

            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-900 text-zinc-300 border border-zinc-800">
              {announcement.category}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800">
              <Users className="w-3 h-3 text-zinc-500" />
              <span>{getCohortBadge(announcement.targetCohort)}</span>
            </span>
          </div>

          {/* Title */}
          <h2 className="text-base sm:text-lg font-bold text-white leading-snug tracking-tight">
            {announcement.title}
          </h2>

          {/* Metadata Sub-bar: Issuer & Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-zinc-900 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                {announcement.authorName.charAt(0)}
              </div>
              <div>
                <span className="font-semibold text-zinc-200">{announcement.authorName}</span>
                <span className="text-zinc-500 text-[11px] block">{announcement.authorRole}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>Published: {formattedDate}</span>
            </div>
          </div>

        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-200 leading-relaxed max-h-[50vh]">
          
          {/* Target Department Highlight if specified */}
          {announcement.targetDepartment && (
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold block">Applicable Department / School</span>
                <span className="text-zinc-200 font-medium">{announcement.targetDepartment}</span>
              </div>
            </div>
          )}

          {/* Formatted Content */}
          <div className="whitespace-pre-line text-zinc-300 font-sans space-y-3 leading-relaxed">
            {announcement.content}
          </div>

          {/* Action Destination Link if any */}
          {announcement.actionUrl && (
            <div className="pt-2">
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Direct University Portal Action
                  </span>
                  <p className="text-[11px] text-zinc-400">
                    Follow this link to directly view corresponding guidelines or submit applications.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    const navFn = onNavigate || onNavigateTab;
                    if (announcement.actionUrl?.startsWith('#')) {
                      const tab = announcement.actionUrl.replace('#', '') as any;
                      if (navFn) {
                        navFn(tab);
                      }
                    } else if (announcement.actionUrl) {
                      try {
                        window.open(announcement.actionUrl, '_blank');
                      } catch {
                        // fallback
                      }
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>{announcement.actionLabel || 'Open Linked Module'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Attachments Section */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Official Circular Attachments ({announcement.attachments.length})
                </span>
                {downloadSuccess && (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 animate-fadeIn">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {downloadSuccess}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {announcement.attachments.map((att, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setPreviewAttachment(previewAttachment?.name === att.name ? null : att)}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 transition-colors flex items-center justify-between gap-2 text-xs cursor-pointer group"
                    title="Click to view & download official circular document"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-blue-400 group-hover:text-blue-300 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-zinc-200 font-medium block truncate text-[11px] group-hover:text-white">{att.name}</span>
                        {att.size && <span className="text-[10px] text-zinc-500">{att.size} &bull; Verified Document</span>}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadAttachment(att.name);
                      }}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-blue-600 text-zinc-300 hover:text-white transition-colors shrink-0 flex items-center gap-1 text-[11px]"
                      title="Download PDF/Text"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[10px]">Download</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* In-Modal Document Viewer Preview when attachment is clicked */}
              {previewAttachment && (
                <div className="p-4 rounded-xl bg-black/60 border border-blue-500/30 space-y-3 mt-2 text-xs">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-400" />
                      Document Preview: {previewAttachment.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownloadAttachment(previewAttachment.name)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Save to Device
                    </button>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-900 font-mono text-[11px] text-zinc-300 space-y-2 max-h-48 overflow-y-auto leading-relaxed">
                    <p className="font-bold text-white text-center border-b border-zinc-800 pb-1">
                      KALASALINGAM ACADEMY OF RESEARCH AND EDUCATION
                    </p>
                    <p className="text-[10px] text-zinc-400 text-center">
                      OFFICE OF ACADEMIC & ADMISSIONS ADMINISTRATION &bull; CIRCULAR {announcement.circularNumber}
                    </p>
                    <p className="font-sans text-xs text-zinc-200 pt-1 whitespace-pre-line">
                      {announcement.content}
                    </p>
                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-emerald-400">
                      <span>Certified by: {announcement.authorName} ({announcement.authorRole})</span>
                      <span>Digital Seal Verified</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Official Verification Stamp */}
          <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Digitally Authenticated by KARE Administration
            </span>
            <span>Ref: {announcement.id}</span>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {onMarkAsRead && (
              <button
                type="button"
                onClick={() => {
                  onMarkAsRead(announcement.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isRead
                    ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 cursor-default'
                    : 'bg-zinc-900 hover:bg-emerald-950 border border-zinc-800 hover:border-emerald-700 text-zinc-300 hover:text-emerald-300'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isRead ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span>{isRead ? 'Acknowledged' : 'Mark as Acknowledged'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy Circular Text</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors items-center gap-1.5"
              title="Print official circular"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-400" />
              <span>Print</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
