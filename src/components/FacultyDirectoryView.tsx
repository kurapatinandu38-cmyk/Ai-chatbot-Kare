import React, { useState, useMemo } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  GraduationCap, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  UserCheck, 
  User,
  Building2, 
  Sparkles,
  BookOpen,
  Filter,
  Send
} from 'lucide-react';
import { FACULTY_DIRECTORY } from '../data/facultyDirectory';
import { FacultyMember } from '../types';
import { KalasalingamLogo } from './KalasalingamLogo';
import { openFacultyGmail } from '../utils/gmailHelper';

interface FacultyDirectoryViewProps {
  onOpenFacultyLogin?: () => void;
  onOpenStudentLogin?: () => void;
}

export const FacultyDirectoryView: React.FC<FacultyDirectoryViewProps> = ({
  onOpenFacultyLogin,
  onOpenStudentLogin
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [gmailToast, setGmailToast] = useState<{ email: string; name: string } | null>(null);

  // Extract unique departments for filter
  const departments = useMemo(() => {
    const list = Array.from(new Set(FACULTY_DIRECTORY.map(f => f.department)));
    return ['All', ...list];
  }, []);

  // Filtered faculty list
  const filteredFaculty = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return FACULTY_DIRECTORY.filter(f => {
      const matchDept = selectedDept === 'All' || f.department === selectedDept;
      if (!matchDept) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        f.cabin.toLowerCase().includes(q) ||
        (f.specialization && f.specialization.some(s => s.toLowerCase().includes(q))) ||
        (f.roleTag && f.roleTag.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedDept]);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => {
      setCopiedEmail(null);
    }, 2000);
  };

  const handleSendViaGmail = (faculty: FacultyMember) => {
    setGmailToast({ email: faculty.email, name: faculty.name });
    openFacultyGmail({
      to: faculty.email,
      facultyName: faculty.name,
      department: faculty.department
    });
    setTimeout(() => {
      setGmailToast(null);
    }, 4000);
  };

  const getTagBadgeColor = (tag?: string) => {
    switch (tag) {
      case 'Leadership':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Dean':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Head of Department':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'Faculty Advisor':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Admissions / Placement':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-zinc-100">
      
      {/* Top Banner & Quick Controls */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0c1020] via-[#0d1424] to-[#0a0f1d] border border-blue-500/20 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <KalasalingamLogo size="lg" variant="badge" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5 flex-wrap">
                  <span>Faculty Members & Official Mail Directory</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-blue-950 text-blue-300 border border-blue-800/60 font-semibold">
                    {FACULTY_DIRECTORY.length} Members
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                  Connect directly with professors, deans, and academic coordinators. Clicking <strong className="text-white font-medium">Send Mail</strong> automatically launches Google Mail (Gmail) with pre-filled academic inquiry details.
                </p>
              </div>
            </div>

            {/* Quick Login Shortcut in Directory */}
            {onOpenFacultyLogin && (
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={onOpenFacultyLogin}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-white" />
                  <span>Login</span>
                </button>
              </div>
            )}
          </div>

          {/* Official 3D University Monument Showcase */}
          <div className="w-full">
            <KalasalingamLogo variant="3d-showcase" />
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#070a14]/80 border border-white/[0.06] rounded-2xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Departments Covered</span>
              <span className="text-lg font-bold text-white font-mono mt-0.5 block">8+ Disciplines</span>
            </div>
            <div className="bg-[#070a14]/80 border border-white/[0.06] rounded-2xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Mail IDs Verified</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-0.5 block flex items-center gap-1.5">
                <Check className="w-4 h-4" /> 100% Official
              </span>
            </div>
            <div className="bg-[#070a14]/80 border border-white/[0.06] rounded-2xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Student Ratio</span>
              <span className="text-lg font-bold text-blue-400 font-mono mt-0.5 block">15:1 UGC/NAAC</span>
            </div>
            <div className="bg-[#070a14]/80 border border-white/[0.06] rounded-2xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Office Cabins</span>
              <span className="text-lg font-bold text-amber-400 font-mono mt-0.5 block">C & Admin Blocks</span>
            </div>
          </div>

          {/* Search & Department Filter */}
          <div className="space-y-3 pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search faculty by name, department, official mail ID, cabin, or research area..."
                className="w-full bg-[#070a14] border border-white/10 focus:border-blue-500 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-zinc-500 font-semibold flex items-center gap-1 shrink-0 text-[11px]">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                      : 'bg-[#0e1220] hover:bg-[#151c32] text-zinc-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <span>Faculty Members List</span>
            <span className="text-xs text-zinc-500 font-mono font-normal">({filteredFaculty.length} results)</span>
          </h2>
          {copiedEmail && (
            <div className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-xl flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              <span>Copied {copiedEmail} to clipboard</span>
            </div>
          )}
        </div>

        {filteredFaculty.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0a0d18] border border-white/[0.06] space-y-3">
            <UserCheck className="w-8 h-8 text-zinc-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No faculty members found</h3>
            <p className="text-xs text-zinc-400">
              No faculty member matched your query "{searchQuery}". Try searching for another name or clearing the department filter.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedDept('All'); }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFaculty.map((faculty) => (
              <div
                key={faculty.id}
                className="rounded-2xl bg-[#090d1a] border border-white/[0.08] hover:border-blue-500/40 p-5 space-y-4 flex flex-col justify-between transition-all duration-200 shadow-xl group hover:-translate-y-0.5"
              >
                {/* Header: Name, Initials, Role Tag */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-blue-600/20 ring-1 ring-white/20 shrink-0">
                        {faculty.avatarInitials || faculty.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                          {faculty.name}
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium leading-tight">
                          {faculty.designation}
                        </p>
                      </div>
                    </div>

                    {faculty.roleTag && (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shrink-0 ${getTagBadgeColor(faculty.roleTag)}`}>
                        {faculty.roleTag}
                      </span>
                    )}
                  </div>

                  {/* Department & Qualification */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{faculty.department}</span>
                    </div>
                    {faculty.qualification && (
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
                        <GraduationCap className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span>{faculty.qualification}</span>
                      </div>
                    )}
                  </div>

                  {/* Highlighted Official Mail ID Box */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900/60 border border-blue-500/30 flex items-center justify-between gap-2 shadow-inner">
                    <div className="min-w-0 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                        <Mail className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Official Mail ID</span>
                        <button 
                          type="button"
                          onClick={() => handleSendViaGmail(faculty)}
                          className="text-xs font-mono font-bold text-sky-300 hover:text-white transition-colors truncate block text-left group cursor-pointer"
                          title={`Click to compose in Gmail to ${faculty.email}`}
                        >
                          <span className="group-hover:underline">{faculty.email}</span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyEmail(faculty.email)}
                      className="p-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800 text-blue-300 hover:text-white transition-colors cursor-pointer shrink-0 border border-blue-700/50"
                      title="Copy official email ID"
                    >
                      {copiedEmail === faculty.email ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Cabin Location & Phone */}
                  <div className="space-y-1.5 text-xs text-zinc-300 pt-1">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate font-medium">{faculty.cabin}</span>
                    </div>
                    {faculty.phoneExtension && (
                      <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{faculty.phoneExtension}</span>
                      </div>
                    )}
                    {faculty.officeHours && (
                      <div className="flex items-start gap-2 text-zinc-400 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">Hours: {faculty.officeHours}</span>
                      </div>
                    )}
                  </div>

                  {/* Specializations */}
                  {faculty.specialization && faculty.specialization.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {faculty.specialization.map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-white/[0.04] border border-white/[0.08] text-zinc-300"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons: Automatically Goes to Gmail */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendViaGmail(faculty)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-red-600/30 via-red-600/20 to-blue-600/25 hover:from-red-600 hover:to-blue-600 text-white border border-red-500/40 hover:border-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm group active:scale-95"
                    title={`Click to open Gmail and send mail to ${faculty.email}`}
                  >
                    <Send className="w-3.5 h-3.5 text-red-400 group-hover:text-white transition-colors" />
                    <span>Send Mail (Gmail)</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail(faculty.email)}
                    className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-zinc-300 border border-white/[0.08] text-xs font-medium transition-all cursor-pointer"
                    title="Copy Mail Address"
                  >
                    {copiedEmail === faculty.email ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instant Gmail Compose Notification Toast */}
      {gmailToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] border border-red-500/40 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-message-in">
          <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Redirecting to Google Mail (Gmail)...</span>
              <ExternalLink className="w-3 h-3 text-blue-400" />
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              Composing to <span className="text-blue-300 font-bold">{gmailToast.email}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
