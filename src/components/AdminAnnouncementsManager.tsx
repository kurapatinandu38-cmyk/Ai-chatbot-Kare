import { apiFetch } from '../lib/api';
import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Pin, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Search, 
  Sparkles, 
  FileText, 
  Send, 
  Calendar, 
  Building2, 
  Users, 
  ExternalLink,
  RefreshCw,
  X,
  Radio
} from 'lucide-react';
import { AnnouncementItem, AnnouncementCategory, AnnouncementPriority, AnnouncementTargetCohort, AdminUser } from '../types';

interface AdminAnnouncementsManagerProps {
  announcements: AnnouncementItem[];
  onRefresh: () => void;
  onOpenAnnouncement: (announcement: AnnouncementItem) => void;
  currentAdmin: AdminUser | null;
  showNotification: (msg: string) => void;
}

const CATEGORIES: AnnouncementCategory[] = [
  'General Circular',
  'Admissions & Concessions',
  'Examinations & Results',
  'Scholarships & Fee Deadlines',
  'Campus Life & Hostels',
  'Placements & Career',
  'Urgent Administrative Notice'
];

export const AdminAnnouncementsManager: React.FC<AdminAnnouncementsManagerProps> = ({
  announcements,
  onRefresh,
  onOpenAnnouncement,
  currentAdmin,
  showNotification
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for New Announcement
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('General Circular');
  const [priority, setPriority] = useState<AnnouncementPriority>('normal');
  const [targetCohort, setTargetCohort] = useState<AnnouncementTargetCohort>('all');
  const [targetDept, setTargetDept] = useState('All Departments');
  const [content, setContent] = useState('');
  const [circularNo, setCircularNo] = useState(`KARE/ADMIN/2026/CIR-${Math.floor(100 + Math.random() * 900)}`);
  const [authorName, setAuthorName] = useState(currentAdmin?.name || 'Dr. S. K. Narayanan');
  const [authorRole, setAuthorRole] = useState(currentAdmin?.role || 'Dean of Academic Affairs');
  const [actionUrl, setActionUrl] = useState('');
  const [actionLabel, setActionLabel] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const resetForm = () => {
    setTitle('');
    setCategory('General Circular');
    setPriority('normal');
    setTargetCohort('all');
    setTargetDept('All Departments');
    setContent('');
    setCircularNo(`KARE/ADMIN/2026/CIR-${Math.floor(100 + Math.random() * 900)}`);
    setActionUrl('');
    setActionLabel('');
    setIsPinned(false);
  };

  const applyTemplate = (type: 'concession' | 'exam' | 'placement' | 'urgent') => {
    if (type === 'concession') {
      setTitle('Intermediate (+2) Marks Concession Application Deadline Extended');
      setCategory('Admissions & Concessions');
      setPriority('urgent');
      setTargetCohort('all');
      setTargetDept('All UG Programs');
      setContent(`All prospective and newly admitted students are advised that the last date to claim tuition fee concessions based on Intermediate (+2) marks has been extended to September 20, 2026.

- Above 95%: 50% Tuition Fee Waiver
- 90% to 94.9%: 25% Tuition Fee Waiver
- 80% to 89.9%: 15% Tuition Fee Waiver

Please verify your documents at the Admissions Office or upload your authentic marks memo.`);
      setActionUrl('#admissions');
      setActionLabel('Open Admissions & Fees');
      setIsPinned(true);
    } else if (type === 'exam') {
      setTitle('End Semester Supplementary & CIA Re-evaluation Notification');
      setCategory('Examinations & Results');
      setPriority('high');
      setTargetCohort('senior_year');
      setTargetDept('All Schools');
      setContent(`Students wishing to apply for Continuous Assessment verification or Supplementary registration must submit their online requisition forms before Friday, 5:00 PM. Late applications will attract a nominal condonation fee.`);
      setActionUrl('#faqs');
      setActionLabel('View Examination FAQs');
      setIsPinned(false);
    } else if (type === 'placement') {
      setTitle('Campus Recruitment Drive: Microsoft & Cognizant Registration Link Live');
      setCategory('Placements & Career');
      setPriority('high');
      setTargetCohort('senior_year');
      setTargetDept('School of Computing & Electronics');
      setContent(`Eligible students with CGPA >= 7.50 may register for the Microsoft Azure and Cognizant GenC Next assessments on the placement portal. Assessment links will be dispatched to student college email IDs.`);
      setActionUrl('#admissions');
      setActionLabel('View Placements Info');
      setIsPinned(true);
    } else if (type === 'urgent') {
      setTitle('URGENT: Campus Network & ERP System Scheduled Maintenance');
      setCategory('Urgent Administrative Notice');
      setPriority('urgent');
      setTargetCohort('all');
      setTargetDept('Campus Wide');
      setContent(`Please note that the university student portal and campus high-speed Wi-Fi infrastructure will undergo essential maintenance this Sunday from 02:00 AM to 06:00 AM. Services will resume normally thereafter.`);
      setActionUrl('');
      setActionLabel('');
      setIsPinned(true);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showNotification('Please fill in both title and content body.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiFetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          priority,
          targetCohort,
          targetDepartment: targetDept,
          content,
          circularNumber: circularNo,
          authorName: authorName || currentAdmin?.name || 'Administrator',
          authorRole: authorRole || currentAdmin?.role || 'University Officer',
          isPinned,
          actionUrl: actionUrl || undefined,
          actionLabel: actionLabel || undefined,
          attachments: [
            { name: `${circularNo.replace(/\//g, '_')}.pdf`, size: '1.5 MB' }
          ]
        })
      });

      if (res.ok) {
        showNotification(`📢 Announcement "${title}" broadcasted live to all students!`);
        resetForm();
        setShowAddModal(false);
        onRefresh();
      } else {
        const data = await res.json();
        showNotification(data.error || 'Failed to broadcast announcement.');
      }
    } catch (err) {
      console.error('Error broadcasting announcement:', err);
      showNotification('Network error while broadcasting announcement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, annTitle: string) => {
    if (!window.confirm(`Are you sure you want to retract and delete notice: "${annTitle}"?`)) return;

    try {
      const res = await apiFetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification(`Announcement "${annTitle}" removed.`);
        onRefresh();
      }
    } catch (err) {
      console.error('Error deleting announcement:', err);
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      const res = await apiFetch(`/api/announcements/${id}/pin`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        showNotification(data.message || 'Updated pin status.');
        onRefresh();
      }
    } catch (err) {
      console.error('Error pinning announcement:', err);
    }
  };

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.circularNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.authorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || ann.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || ann.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action Header */}
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
            <Bell className="w-3.5 h-3.5" /> University Circulars & Student Notifications
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Official Announcement Broadcasting Center
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Publish circulars, exam schedules, and admissions notices. Connected students receive instant real-time notifications with clickable cards that open the complete notice immediately.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            id="btn-broadcast-new-announcement"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast New Announcement</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search circulars, title, or author..."
            className="w-full bg-[#121212] border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#121212] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Categories ({announcements.length})</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#121212] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Priorities</option>
            <option value="urgent">Urgent Alerts Only</option>
            <option value="high">High Priority</option>
            <option value="normal">Normal Circulars</option>
          </select>
        </div>
      </div>

      {/* Announcements List Grid */}
      <div className="space-y-3">
        {filteredAnnouncements.length === 0 ? (
          <div className="p-12 text-center bg-[#0e0e0e] border border-zinc-800 rounded-2xl text-zinc-500 space-y-2">
            <Bell className="w-10 h-10 mx-auto text-zinc-600" />
            <h4 className="text-sm font-semibold text-zinc-300">No Announcements Found</h4>
            <p className="text-xs text-zinc-500">Try adjusting your search criteria or click "Broadcast New Announcement".</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className={`p-5 rounded-2xl border transition-all ${
                ann.priority === 'urgent'
                  ? 'bg-rose-950/15 border-rose-900/40 hover:border-rose-700/60'
                  : ann.priority === 'high'
                    ? 'bg-amber-950/15 border-amber-900/40 hover:border-amber-700/60'
                    : 'bg-[#0e0e0e] border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                
                {/* Left Content Area (Click to open full circular) */}
                <div 
                  onClick={() => onOpenAnnouncement(ann)}
                  className="space-y-2 flex-1 min-w-0 cursor-pointer group"
                  title="Click to open circular"
                >
                  
                  {/* Metadata Row */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    <span className="font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40 group-hover:border-blue-500 transition-colors">
                      {ann.circularNumber}
                    </span>

                    {ann.isPinned && (
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}

                    {ann.priority === 'urgent' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-700/60">
                        <AlertTriangle className="w-3 h-3 text-rose-400" /> Urgent Alert
                      </span>
                    ) : ann.priority === 'high' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-700/60">
                        <Bell className="w-3 h-3 text-amber-400" /> High Priority
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-medium text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                        <FileText className="w-3 h-3" /> Normal
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-full font-bold bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {ann.category}
                    </span>

                    <span className="inline-flex items-center gap-1 text-zinc-500 font-medium">
                      <Users className="w-3 h-3" />
                      <span>{ann.targetCohort === 'all' ? 'All Students' : ann.targetCohort === 'first_year' ? '1st Year Freshers' : 'Senior Students'}</span>
                    </span>

                    <span className="text-zinc-500 font-mono ml-auto">
                      {new Date(ann.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                    {ann.title}
                  </h3>

                  {/* Content Preview */}
                  <p className="text-xs text-zinc-400 group-hover:text-zinc-300 line-clamp-2 leading-relaxed transition-colors">
                    {ann.content}
                  </p>

                  {/* Issuer & Target Dept */}
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-zinc-400">
                    <span className="text-zinc-300 font-medium">Issued by: {ann.authorName} ({ann.authorRole})</span>
                    {ann.targetDepartment && (
                      <span className="text-zinc-500">• Dept: {ann.targetDepartment}</span>
                    )}
                  </div>

                </div>

                {/* Right Action Controls */}
                <div className="flex items-center lg:flex-col gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-800/80">
                  
                  {/* Open Circular Button */}
                  <button
                    type="button"
                    onClick={() => onOpenAnnouncement(ann)}
                    className="flex-1 lg:w-full px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/40 shadow-lg shadow-blue-600/20 transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                    title="Open and view full official circular"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Circular</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Toggle Pin */}
                    <button
                      type="button"
                      onClick={() => handleTogglePin(ann.id)}
                      className={`p-2 rounded-xl text-xs transition-colors border ${
                        ann.isPinned
                          ? 'bg-amber-950/60 text-amber-400 border-amber-800/60 hover:bg-amber-900/60'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                      title={ann.isPinned ? 'Unpin from top' : 'Pin to top'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(ann.id, ann.title)}
                      className="p-2 rounded-xl text-xs bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-800/60 transition-colors"
                      title="Retract and delete circular"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Broadcast New Announcement */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div 
            className="bg-[#0b0b0f] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl text-zinc-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Broadcast University Announcement</h3>
                  <p className="text-[11px] text-zinc-500">
                    Creates an official circular and sends real-time notifications to students.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Templates Bar */}
            <div className="px-5 pt-3 pb-1 bg-zinc-950 border-b border-zinc-900 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-zinc-500 font-semibold shrink-0">Quick Fill:</span>
              <button
                type="button"
                onClick={() => applyTemplate('concession')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-blue-950 border border-zinc-800 hover:border-blue-700 text-blue-300 shrink-0 font-medium"
              >
                +2 Marks Concession Notice
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('placement')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-emerald-950 border border-zinc-800 hover:border-emerald-700 text-emerald-300 shrink-0 font-medium"
              >
                Campus Placement Drive
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('exam')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-indigo-950 border border-zinc-800 hover:border-indigo-700 text-indigo-300 shrink-0 font-medium"
              >
                Exam CIA Schedule
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('urgent')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-rose-950 border border-zinc-800 hover:border-rose-700 text-rose-300 shrink-0 font-medium"
              >
                Urgent Campus Alert
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCreateAnnouncement} className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Circular Reference & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Circular Reference Number:
                  </label>
                  <input
                    type="text"
                    required
                    value={circularNo}
                    onChange={(e) => setCircularNo(e.target.value)}
                    className="w-full bg-[#121212] border border-zinc-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Category:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                    className="w-full bg-[#121212] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Announcement Title:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Intermediate Marks Concession Application Deadline"
                  className="w-full bg-[#121212] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Priority & Target Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Priority Level:
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
                    className="w-full bg-[#121212] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="normal">Normal Circular</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Alert (Banner Alert)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Target Cohort:
                  </label>
                  <select
                    value={targetCohort}
                    onChange={(e) => setTargetCohort(e.target.value as AnnouncementTargetCohort)}
                    className="w-full bg-[#121212] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Students & Faculty</option>
                    <option value="first_year">1st Year Freshers Only</option>
                    <option value="senior_year">Senior Batches (2nd-4th Yr)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Target Department:
                  </label>
                  <input
                    type="text"
                    value={targetDept}
                    onChange={(e) => setTargetDept(e.target.value)}
                    placeholder="e.g. All Departments or CSE"
                    className="w-full bg-[#121212] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Author & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Issuing Authority Name:
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Dr. V. Rajasekaran"
                    className="w-full bg-[#121212] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Designation / Office:
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder="e.g. Dean of Admissions / Registrar"
                    className="w-full bg-[#121212] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Content Body */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Full Announcement Content / Circular Text:
                </label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter detailed notice, instructions, timelines, action points, and contact guidelines..."
                  className="w-full bg-[#121212] border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                />
              </div>

              {/* Direct Link / Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Interactive Action Link (Optional):
                  </label>
                  <input
                    type="text"
                    value={actionUrl}
                    onChange={(e) => setActionUrl(e.target.value)}
                    placeholder="e.g. #admissions or #faqs or https://..."
                    className="w-full bg-[#121212] border border-zinc-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Action Button Label:
                  </label>
                  <input
                    type="text"
                    value={actionLabel}
                    onChange={(e) => setActionLabel(e.target.value)}
                    placeholder="e.g. Open Admissions Portal"
                    className="w-full bg-[#121212] border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Pin Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="annPinCheck"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded bg-[#121212] border-zinc-700 text-blue-600 focus:ring-0"
                />
                <label htmlFor="annPinCheck" className="text-zinc-300 font-medium cursor-pointer flex items-center gap-1">
                  <Pin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pin to top of Student Notification Center</span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Publish & Broadcast Live</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
