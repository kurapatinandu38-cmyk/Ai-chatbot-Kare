import React, { useState } from 'react';
import { 
  FileDown, 
  X, 
  CheckCircle2, 
  FileText, 
  User, 
  Calendar, 
  Layers, 
  AlertCircle,
  Clock,
  Sparkles,
  Download,
  FileType
} from 'lucide-react';
import { ChatMessage, StudentUser, Department } from '../types';
import { exportChatToPdf, exportChatToText } from '../utils/exportChatToPdf';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  currentUser: StudentUser | null;
  selectedDepartment: Department;
}

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  messages,
  currentUser,
  selectedDepartment
}) => {
  if (!isOpen) return null;

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const defaultBaseTitle = currentUser?.applicationNumber
    ? `KARE_Query_Log_${currentUser.applicationNumber}_${dateStr}`
    : `KARE_Conversation_Log_${dateStr}`;

  const [documentTitle, setDocumentTitle] = useState(defaultBaseTitle);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'txt'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<{ filename: string; format: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const studentQueries = messages.filter(m => m.sender === 'student');
  const botReplies = messages.filter(m => m.sender === 'bot');

  const handleDownload = (formatToDownload: 'pdf' | 'txt' = selectedFormat) => {
    setIsExporting(true);
    setErrorMessage(null);

    // Small timeout for smooth animation/render
    setTimeout(() => {
      try {
        const cleanTitle = documentTitle.trim() || defaultBaseTitle;

        if (formatToDownload === 'pdf') {
          const result = exportChatToPdf({
            messages,
            currentUser,
            selectedDepartment,
            customTitle: cleanTitle
          });

          if (result.success && result.filename) {
            setDownloadSuccess({ filename: result.filename, format: 'PDF' });
            setTimeout(() => {
              onClose();
            }, 1800);
          } else {
            setErrorMessage(result.error || 'Failed to generate PDF document.');
          }
        } else {
          const result = exportChatToText({
            messages,
            currentUser,
            selectedDepartment,
            customTitle: cleanTitle
          });

          if (result.success && result.filename) {
            setDownloadSuccess({ filename: result.filename, format: 'Text File (.txt)' });
            setTimeout(() => {
              onClose();
            }, 1800);
          } else {
            setErrorMessage(result.error || 'Failed to generate Text transcript.');
          }
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'Error occurred while creating download file.');
      } finally {
        setIsExporting(false);
      }
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#0f0f12] border border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-gradient-to-r from-blue-950/40 via-sky-950/30 to-zinc-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-600/20 border border-sky-500/40 text-sky-400">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Download Chat History</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800/60 uppercase">
                  PDF &bull; TXT
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Export and save your full question and advisory transcript
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Format Selector Pills */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
              <span>Choose Download Format:</span>
              <span className="text-[11px] text-zinc-500">Select preferred document style</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedFormat('pdf')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  selectedFormat === 'pdf'
                    ? 'bg-blue-950/60 border-blue-500 text-white shadow-md shadow-blue-900/30 ring-1 ring-blue-500/50'
                    : 'bg-[#141418] border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${
                  selectedFormat === 'pdf' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  <FileDown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Formatted PDF</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/30 text-blue-300 font-mono">.pdf</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">
                    Official layout with header, tables & citations
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat('txt')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  selectedFormat === 'txt'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md shadow-emerald-900/30 ring-1 ring-emerald-500/50'
                    : 'bg-[#141418] border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${
                  selectedFormat === 'txt' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Formatted Text</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-300 font-mono">.txt</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">
                    Clean plain-text transcript with metadata
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {downloadSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold block">{downloadSuccess.format} Downloaded Successfully!</span>
                <span className="text-[11px] text-emerald-400/90 font-mono mt-0.5 block">{downloadSuccess.filename}</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Document Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Document File Name</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Enter filename..."
                className="w-full bg-[#16161a] border border-zinc-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all font-mono"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-zinc-500 font-mono">
                .{selectedFormat}
              </span>
            </div>
          </div>

          {/* Summary Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#141416] border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-500 font-medium block uppercase tracking-wider">
                Student Inquiries
              </span>
              <span className="text-base font-bold text-sky-400 mt-0.5 block">
                {studentQueries.length}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#141416] border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-500 font-medium block uppercase tracking-wider">
                AI Advisories
              </span>
              <span className="text-base font-bold text-emerald-400 mt-0.5 block">
                {botReplies.length}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#141416] border border-zinc-800 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-zinc-500 font-medium block uppercase tracking-wider">
                Category Scope
              </span>
              <span className="text-xs font-semibold text-zinc-200 mt-1 block truncate">
                {selectedDepartment}
              </span>
            </div>
          </div>

          {/* Student & Session Info Card */}
          <div className="p-3.5 rounded-xl bg-[#141418] border border-zinc-800/90 text-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-2">
              <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Profile & Session Details</span>
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {currentUser ? 'Verified Student' : 'Guest Inquirer'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-zinc-500">User / Student: </span>
                <strong className="text-zinc-200">{currentUser?.name || 'Guest / Prospective Student'}</strong>
              </div>
              <div>
                <span className="text-zinc-500">Registration / App: </span>
                <strong className="text-zinc-200">{currentUser?.applicationNumber || currentUser?.rollNumber || currentUser?.id || 'N/A (General)'}</strong>
              </div>
              <div>
                <span className="text-zinc-500">Official Email: </span>
                <span className="text-zinc-300 font-mono text-[10px]">{currentUser?.collegeEmail || currentUser?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-zinc-500">Department: </span>
                <span className="text-zinc-300">{currentUser?.department || selectedDepartment}</span>
              </div>
            </div>
          </div>

          {/* Transcript Preview Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Included Transcript Questions ({studentQueries.length})</span>
              </span>
              <span className="text-[10px] text-zinc-500">
                Formatted as {selectedFormat.toUpperCase()}
              </span>
            </div>
            <div className="bg-[#121214] border border-zinc-800/80 rounded-xl p-2.5 max-h-32 overflow-y-auto space-y-1.5">
              {studentQueries.length > 0 ? (
                studentQueries.map((q, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-zinc-300 py-1 border-b border-zinc-800/50 last:border-0">
                    <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 font-mono font-bold text-[9px] shrink-0 mt-0.5">
                      Q{idx + 1}
                    </span>
                    <span className="line-clamp-2 text-zinc-300">{q.text}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 italic py-2 text-center">
                  Only initial welcome greeting recorded. Ask questions to include them in the log!
                </p>
              )}
            </div>
          </div>

          {/* Guarantee Note */}
          <div className="p-2.5 rounded-xl bg-sky-950/20 border border-sky-900/30 text-[11px] text-sky-300/80 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <p>
              {selectedFormat === 'pdf' 
                ? 'Includes official Kalasalingam University header, page numbers, timestamps, and grounding citations for academic & admissions filing.'
                : 'Formatted as an indented, structured plain-text document with section banners and university contact details.'}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-zinc-800/80 bg-[#121214] flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer mr-auto"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isExporting}
              onClick={() => handleDownload('txt')}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Download as structured plain text transcript"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download .TXT</span>
            </button>

            <button
              type="button"
              disabled={isExporting}
              onClick={() => handleDownload('pdf')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 disabled:bg-sky-900 text-white flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Download as official formatted PDF document"
            >
              {isExporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Download .PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
