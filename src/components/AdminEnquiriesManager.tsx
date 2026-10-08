import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Award, 
  GraduationCap, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  FileText, 
  Download,
  AlertCircle,
  UserCheck,
  Building2,
  RefreshCw,
  Eye,
  Sparkles
} from 'lucide-react';
import { EnquiryItem, EnquiryStatus } from '../types';

interface AdminEnquiriesManagerProps {
  enquiries: EnquiryItem[];
  onUpdateStatus: (id: string, status: EnquiryStatus, notes?: string, counselor?: string) => Promise<boolean>;
  onDeleteEnquiry: (id: string) => Promise<boolean>;
  onRefresh: () => void;
}

export const AdminEnquiriesManager: React.FC<AdminEnquiriesManagerProps> = ({
  enquiries = [],
  onUpdateStatus,
  onDeleteEnquiry,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | EnquiryStatus>('All');
  const [degreeFilter, setDegreeFilter] = useState<'All' | 'UG' | 'PG' | 'Ph.D'>('All');
  const [studentFilter, setStudentFilter] = useState<'All' | 'StudentsOnly' | 'ProspectsOnly'>('All');
  
  // Note editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [counselorDraft, setCounselorDraft] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);

  // Filter enquiries
  const filteredEnquiries = enquiries.filter(enq => {
    const matchesStatus = statusFilter === 'All' || enq.status === statusFilter;
    const matchesDegree = degreeFilter === 'All' || enq.degreeType === degreeFilter;
    const isStudent = Boolean(enq.isStudentAccount || enq.studentIdentifier || enq.rollNumber || enq.applicationNumber);
    const matchesStudentFilter = 
      studentFilter === 'All' || 
      (studentFilter === 'StudentsOnly' && isStudent) || 
      (studentFilter === 'ProspectsOnly' && !isStudent);

    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      enq.name.toLowerCase().includes(q) ||
      enq.email.toLowerCase().includes(q) ||
      enq.phone.toLowerCase().includes(q) ||
      enq.programInterested.toLowerCase().includes(q) ||
      enq.id.toLowerCase().includes(q) ||
      (enq.rollNumber && enq.rollNumber.toLowerCase().includes(q)) ||
      (enq.applicationNumber && enq.applicationNumber.toLowerCase().includes(q)) ||
      (enq.studentIdentifier && enq.studentIdentifier.toLowerCase().includes(q)) ||
      (enq.department && enq.department.toLowerCase().includes(q)) ||
      (enq.city && enq.city.toLowerCase().includes(q)) ||
      (enq.message && enq.message.toLowerCase().includes(q));

    return matchesStatus && matchesDegree && matchesStudentFilter && matchesSearch;
  });

  const totalCount = enquiries.length;
  const pendingCount = enquiries.filter(e => e.status === 'Pending').length;
  const inReviewCount = enquiries.filter(e => e.status === 'In Review').length;
  const contactedCount = enquiries.filter(e => e.status === 'Contacted').length;
  const resolvedCount = enquiries.filter(e => e.status === 'Resolved').length;
  const studentSubmissionsCount = enquiries.filter(
    e => e.isStudentAccount || e.studentIdentifier || e.rollNumber || e.applicationNumber
  ).length;

  const handleStartEdit = (enq: EnquiryItem) => {
    setEditingId(enq.id);
    setNotesDraft(enq.notes || '');
    setCounselorDraft(enq.assignedCounselor || '');
  };

  const handleSaveEdit = async (id: string, currentStatus: EnquiryStatus) => {
    setIsUpdating(true);
    await onUpdateStatus(id, currentStatus, notesDraft, counselorDraft);
    setIsUpdating(false);
    setEditingId(null);
  };

  const handleQuickStatusChange = async (id: string, newStatus: EnquiryStatus, enq: EnquiryItem) => {
    await onUpdateStatus(id, newStatus, enq.notes, enq.assignedCounselor);
  };

  const handleExportCSV = () => {
    if (filteredEnquiries.length === 0) return;
    const headers = ['ID,Name,Email,Phone,Degree,Program,Marks,StudentRollNo,StudentAppNo,Department,Cohort,City,State,Quota,Status,Date,Counselor,Notes,Message'];
    const rows = filteredEnquiries.map(e => [
      `"${e.id}"`,
      `"${e.name}"`,
      `"${e.email}"`,
      `"${e.phone}"`,
      `"${e.degreeType}"`,
      `"${e.programInterested}"`,
      `"${e.intermediateMarks || ''}"`,
      `"${e.rollNumber || e.studentIdentifier || ''}"`,
      `"${e.applicationNumber || ''}"`,
      `"${e.department || ''}"`,
      `"${e.cohort || e.yearOfStudy || ''}"`,
      `"${e.city || ''}"`,
      `"${e.state || ''}"`,
      `"${e.categoryQuota || ''}"`,
      `"${e.status}"`,
      `"${new Date(e.submittedAt).toLocaleDateString()}"`,
      `"${e.assignedCounselor || ''}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KARE_Admissions_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                All Admissions & Student Enquiries
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                  {totalCount} Total
                </span>
                {studentSubmissionsCount > 0 && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium inline-flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {studentSubmissionsCount} from Registered Students
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Every enquiry filled by students or prospective applicants is saved and automatically visible across all faculty and administrator accounts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Refresh Enquiries"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCSV}
            disabled={filteredEnquiries.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 transition-colors disabled:opacity-40"
          >
            <Download className="w-4 h-4 text-blue-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Metrics Slabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div 
          onClick={() => setStatusFilter('Pending')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'Pending' 
              ? 'bg-amber-950/40 border-amber-500/40 ring-1 ring-amber-500/30' 
              : 'bg-[#0e0e0e] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-medium">Pending Action</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <p className="text-xl font-bold text-amber-400 font-mono mt-1">{pendingCount}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('In Review')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'In Review' 
              ? 'bg-blue-950/40 border-blue-500/40 ring-1 ring-blue-500/30' 
              : 'bg-[#0e0e0e] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-medium">In Review</span>
            <Clock className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-blue-400 font-mono mt-1">{inReviewCount}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('Contacted')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'Contacted' 
              ? 'bg-indigo-950/40 border-indigo-500/40 ring-1 ring-indigo-500/30' 
              : 'bg-[#0e0e0e] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-medium">Contacted</span>
            <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-xl font-bold text-indigo-400 font-mono mt-1">{contactedCount}</p>
        </div>

        <div 
          onClick={() => setStatusFilter('Resolved')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'Resolved' 
              ? 'bg-emerald-950/40 border-emerald-500/40 ring-1 ring-emerald-500/30' 
              : 'bg-[#0e0e0e] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-medium">Resolved / Enrolled</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-400 font-mono mt-1">{resolvedCount}</p>
        </div>

        <div 
          onClick={() => setStudentFilter(prev => prev === 'StudentsOnly' ? 'All' : 'StudentsOnly')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all col-span-2 sm:col-span-1 ${
            studentFilter === 'StudentsOnly'
              ? 'bg-emerald-950/50 border-emerald-500/60 ring-1 ring-emerald-500/40'
              : 'bg-[#0e0e0e] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-emerald-400 font-medium">Student Leads</span>
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-300 font-mono mt-1">{studentSubmissionsCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl p-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll no, app no, email, phone, program..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={studentFilter}
            onChange={e => setStudentFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-blue-500 text-xs"
          >
            <option value="All">All Lead Types ({totalCount})</option>
            <option value="StudentsOnly">🎓 Registered Students ({studentSubmissionsCount})</option>
            <option value="ProspectsOnly">Prospective Applicants ({totalCount - studentSubmissionsCount})</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-blue-500 text-xs"
          >
            <option value="All">All Statuses ({totalCount})</option>
            <option value="Pending">Pending ({pendingCount})</option>
            <option value="In Review">In Review ({inReviewCount})</option>
            <option value="Contacted">Contacted ({contactedCount})</option>
            <option value="Resolved">Resolved ({resolvedCount})</option>
          </select>

          <select
            value={degreeFilter}
            onChange={e => setDegreeFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-blue-500 text-xs"
          >
            <option value="All">All Degrees</option>
            <option value="UG">Undergraduate (UG)</option>
            <option value="PG">Postgraduate (PG)</option>
            <option value="Ph.D">Doctoral (Ph.D)</option>
          </select>

          {(statusFilter !== 'All' || degreeFilter !== 'All' || studentFilter !== 'All' || searchTerm) && (
            <button
              onClick={() => { setStatusFilter('All'); setDegreeFilter('All'); setStudentFilter('All'); setSearchTerm(''); }}
              className="px-2.5 py-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-xs"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Enquiries List */}
      {filteredEnquiries.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl bg-[#0a0a0a] text-zinc-500 text-xs space-y-2">
          <Inbox className="w-8 h-8 mx-auto text-zinc-600" />
          <p className="font-semibold text-zinc-400">No enquiries match your search or filter</p>
          <p className="text-[11px]">When visitors or students submit enquiries, their details will appear here instantly.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map(enq => {
            const isEditing = editingId === enq.id;
            
            // Calculate waiver badge
            let concessionBadge = null;
            if (enq.intermediateMarks) {
              if (enq.intermediateMarks >= 95) concessionBadge = '50% Fee Waiver Eligible';
              else if (enq.intermediateMarks >= 90) concessionBadge = '25% Fee Waiver Eligible';
              else if (enq.intermediateMarks >= 80) concessionBadge = '15-20% Fee Waiver Eligible';
            }

            return (
              <div 
                key={enq.id}
                id={`enquiry-card-${enq.id}`}
                className="bg-[#0c0c0c] border border-zinc-800 hover:border-zinc-700/80 rounded-2xl p-5 space-y-4 text-xs transition-all shadow-md"
              >
                {/* Card Top: ID, Program, Status Pill & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 text-[11px]">
                      {enq.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold text-[10px]">
                      {enq.degreeType}
                    </span>
                    <span className="text-white font-bold text-sm">
                      {enq.programInterested}
                    </span>
                    {concessionBadge && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Award className="w-3 h-3" /> {concessionBadge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Open Enquiry Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedEnquiry(enq)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[11px] font-semibold transition-all flex items-center gap-1"
                      title="Open full enquiry dossier"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Details</span>
                    </button>

                    {/* Status Dropdown */}
                    <select
                      value={enq.status}
                      onChange={e => handleQuickStatusChange(enq.id, e.target.value as EnquiryStatus, enq)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border focus:outline-none transition-colors ${
                        enq.status === 'Pending' 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                          : enq.status === 'In Review' 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                          : enq.status === 'Contacted' 
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      <option value="Pending" className="bg-zinc-900 text-amber-400">● Pending</option>
                      <option value="In Review" className="bg-zinc-900 text-blue-400">● In Review</option>
                      <option value="Contacted" className="bg-zinc-900 text-indigo-400">● Contacted</option>
                      <option value="Resolved" className="bg-zinc-900 text-emerald-400">● Resolved</option>
                    </select>

                    <button
                      onClick={() => onDeleteEnquiry(enq.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete enquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Highlighted Registered Student Details Box */}
                {(enq.isStudentAccount || enq.studentIdentifier || enq.rollNumber || enq.applicationNumber) && (
                  <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-300 text-xs">Registered Student Enquiry</span>
                          <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
                            Verified Profile
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-300 flex flex-wrap items-center gap-2 mt-1 font-mono">
                          {enq.rollNumber && (
                            <span className="bg-zinc-800 px-2 py-0.5 rounded text-emerald-300 border border-zinc-700">
                              Roll No: <strong>{enq.rollNumber}</strong>
                            </span>
                          )}
                          {enq.applicationNumber && (
                            <span className="bg-zinc-800 px-2 py-0.5 rounded text-blue-300 border border-zinc-700">
                              App No: <strong>{enq.applicationNumber}</strong>
                            </span>
                          )}
                          {!enq.rollNumber && !enq.applicationNumber && enq.studentIdentifier && (
                            <span className="bg-zinc-800 px-2 py-0.5 rounded text-indigo-300 border border-zinc-700">
                              ID: <strong>{enq.studentIdentifier}</strong>
                            </span>
                          )}
                          {enq.department && (
                            <span className="text-zinc-300 font-sans">
                              Dept: <strong>{enq.department}</strong>
                            </span>
                          )}
                          {enq.yearOfStudy && (
                            <span className="text-zinc-400 font-sans">
                              • {enq.yearOfStudy}
                            </span>
                          )}
                          {enq.cohort && (
                            <span className="text-zinc-400 font-sans">
                              • ({enq.cohort === 'first_year' ? '1st Year Freshers' : 'Senior Student'})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[10px] text-zinc-400">
                      <span>Sync ID: <code className="text-zinc-300">{enq.studentIdentifier || enq.rollNumber || 'Auto-linked'}</code></span>
                    </div>
                  </div>
                )}

                {/* Candidate Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Candidate Name</span>
                    <span className="text-zinc-200 font-semibold text-xs">{enq.name}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Phone & Quick Call</span>
                    <div className="flex items-center gap-1.5 text-zinc-200 font-mono">
                      <PhoneCall className="w-3 h-3 text-blue-400" />
                      <a href={`tel:${enq.phone}`} className="hover:underline text-blue-400 font-medium">
                        {enq.phone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Email Address</span>
                    <div className="flex items-center gap-1.5 text-zinc-200">
                      <Mail className="w-3 h-3 text-blue-400" />
                      <a href={`mailto:${enq.email}`} className="hover:underline text-blue-400 truncate">
                        {enq.email}
                      </a>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Marks & Location</span>
                    <span className="text-zinc-300">
                      {enq.intermediateMarks ? `${enq.intermediateMarks}%` : 'No Marks'} • {enq.city || enq.state || 'India'}
                    </span>
                  </div>
                </div>

                {/* Question / Message Content */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Student Query / Message:</span>
                  <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80 text-zinc-200 leading-relaxed font-sans">
                    {enq.message}
                  </div>
                </div>

                {/* Counselor Notes & Assignment Bar */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-3">
                    <span>Submitted: <strong>{new Date(enq.submittedAt).toLocaleString()}</strong></span>
                    {enq.categoryQuota && (
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300">
                        {enq.categoryQuota}
                      </span>
                    )}
                  </div>

                  {!isEditing ? (
                    <div className="flex items-center gap-3">
                      {enq.assignedCounselor && (
                        <span>Counselor: <strong className="text-zinc-200">{enq.assignedCounselor}</strong></span>
                      )}
                      {enq.notes && (
                        <span className="italic text-zinc-300 truncate max-w-xs" title={enq.notes}>
                          "{enq.notes}"
                        </span>
                      )}
                      <button
                        onClick={() => handleStartEdit(enq)}
                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        {enq.notes || enq.assignedCounselor ? 'Edit Notes' : 'Add Counselor Notes'}
                      </button>
                    </div>
                  ) : null}
                </div>

                {/* Notes Edit Box */}
                {isEditing && (
                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-blue-500/30 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                          Assigned Admissions Counselor
                        </label>
                        <input
                          type="text"
                          value={counselorDraft}
                          onChange={e => setCounselorDraft(e.target.value)}
                          placeholder="e.g. Dr. S. Ramanathan / Admissions Cell"
                          className="w-full px-3 py-1.5 rounded-lg bg-black border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                          Counselor Internal Notes / Call Followup
                        </label>
                        <input
                          type="text"
                          value={notesDraft}
                          onChange={e => setNotesDraft(e.target.value)}
                          placeholder="e.g. Called parent. Sent brochure. Agreed to visit campus on Saturday."
                          className="w-full px-3 py-1.5 rounded-lg bg-black border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(enq.id, enq.status)}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save Notes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Full Enquiry Dossier Modal (When Admin opens an enquiry) */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div 
            className="bg-[#0b0b0f] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl text-zinc-100 overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Accent Bar */}
            <div className={`h-1.5 w-full ${
              selectedEnquiry.status === 'Resolved' 
                ? 'bg-emerald-500' 
                : selectedEnquiry.status === 'Contacted' 
                ? 'bg-indigo-500' 
                : selectedEnquiry.status === 'In Review' 
                ? 'bg-blue-500' 
                : 'bg-amber-500'
            }`} />

            {/* Header */}
            <div className="p-5 border-b border-zinc-800 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-mono text-xs text-blue-400 font-bold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                    Ref: {selectedEnquiry.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedEnquiry.status === 'Resolved'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : selectedEnquiry.status === 'Contacted'
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      : selectedEnquiry.status === 'In Review'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    ● {selectedEnquiry.status}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{selectedEnquiry.name}</h3>
                <p className="text-xs text-zinc-400">
                  Interested Program: <strong className="text-blue-300">{selectedEnquiry.programInterested}</strong> ({selectedEnquiry.degreeType})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
                title="Close enquiry details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-4 max-h-[60vh] text-xs leading-relaxed">
              {/* Registered Student Record if present */}
              {(selectedEnquiry.isStudentAccount || selectedEnquiry.studentIdentifier || selectedEnquiry.rollNumber || selectedEnquiry.applicationNumber) && (
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <GraduationCap className="w-4 h-4" />
                    <span>Verified University Student Account</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-zinc-300">
                    {selectedEnquiry.rollNumber && (
                      <div>Roll No: <span className="text-emerald-400 font-bold">{selectedEnquiry.rollNumber}</span></div>
                    )}
                    {selectedEnquiry.applicationNumber && (
                      <div>App No: <span className="text-blue-400 font-bold">{selectedEnquiry.applicationNumber}</span></div>
                    )}
                    {selectedEnquiry.department && (
                      <div>Dept: <span className="text-zinc-200 font-sans">{selectedEnquiry.department}</span></div>
                    )}
                    {selectedEnquiry.yearOfStudy && (
                      <div>Year: <span className="text-zinc-200 font-sans">{selectedEnquiry.yearOfStudy}</span></div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold block">Phone Number</span>
                  <div className="flex items-center gap-2 text-zinc-200 font-mono">
                    <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                    <a href={`tel:${selectedEnquiry.phone}`} className="text-blue-400 hover:underline font-semibold">
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold block">Email ID</span>
                  <div className="flex items-center gap-2 text-zinc-200">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-blue-400 hover:underline font-semibold truncate">
                      {selectedEnquiry.email}
                    </a>
                  </div>
                </div>
                {selectedEnquiry.city && (
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold block">Location</span>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{selectedEnquiry.city}{selectedEnquiry.state ? `, ${selectedEnquiry.state}` : ''}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Academic Performance & Concessions */}
              {selectedEnquiry.marksPercentage && (
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase font-bold block">Qualifying Examination Score</span>
                    <span className="text-sm font-bold text-white font-mono">{selectedEnquiry.marksPercentage}%</span>
                  </div>
                  {selectedEnquiry.marksPercentage >= 95 ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-400" /> 100% Tuition Fee Waiver Qualified
                    </span>
                  ) : selectedEnquiry.marksPercentage >= 90 ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-blue-400" /> 50% Tuition Fee Waiver Qualified
                    </span>
                  ) : null}
                </div>
              )}

              {/* Full Message / Query Text */}
              <div className="space-y-1.5">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">
                  Student / Applicant Query Message:
                </span>
                <div className="p-4 rounded-xl bg-[#121216] border border-zinc-800/80 text-zinc-200 whitespace-pre-line text-xs font-sans leading-relaxed">
                  {selectedEnquiry.message || 'No additional message provided.'}
                </div>
              </div>

              {/* Counselor & Followup Notes */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">
                  Admissions Cell Internal Notes:
                </span>
                <div className="text-xs text-zinc-300">
                  <p><strong className="text-zinc-400">Assigned Counselor:</strong> {selectedEnquiry.assignedCounselor || 'Not yet assigned'}</p>
                  <p className="mt-1"><strong className="text-zinc-400">Notes / Log:</strong> {selectedEnquiry.notes || 'No notes logged yet.'}</p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-medium">Update Status:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value as EnquiryStatus;
                    await onUpdateStatus(selectedEnquiry.id, newStatus, selectedEnquiry.notes, selectedEnquiry.assignedCounselor);
                    setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-900 border border-zinc-700 text-white focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Review">In Review</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleStartEdit(selectedEnquiry);
                    setSelectedEnquiry(null);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Edit Notes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
