import { apiFetch } from '../lib/api';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  IndianRupee, 
  FileCheck, 
  Calendar, 
  Award, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Settings,
  RefreshCw,
  User,
  Hash,
  Clock,
  Check,
  AlertCircle,
  TrendingUp,
  Bell,
  AlertTriangle,
  ChevronRight,
  Inbox,
  Flame,
  Trophy,
  Percent,
  Sliders,
  Plus,
  X,
  Heart
} from 'lucide-react';
import { FeeStructureItem, AdmissionsInfo, PlacedStudentItem, StudentUser, AnnouncementItem, EnquirySubmissionPayload } from '../types';
import { INITIAL_ADMISSIONS_INFO, INITIAL_FEE_STRUCTURES, INITIAL_PLACEMENTS, INITIAL_STUDENTS } from '../data/initialAdmissions';
import { EnquiryModal } from './EnquiryModal';
import { KalasalingamLogo } from './KalasalingamLogo';
import { openFacultyGmail } from '../utils/gmailHelper';
import { getDisplayYearOfStudy } from '../utils/studentYearHelper';

interface AdmissionsViewProps {
  onNavigateToAdmin?: (section: 'admissions' | 'placements' | 'students') => void;
  currentUser?: StudentUser | null;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
  liveStudents?: StudentUser[];
  liveAdmissionsInfo?: AdmissionsInfo | null;
  liveFeeStructures?: FeeStructureItem[];
  livePlacements?: PlacedStudentItem[];
  liveAnnouncements?: AnnouncementItem[];
  onOpenAnnouncement?: (announcement: AnnouncementItem) => void;
  isLiveConnected?: boolean;
  lastLiveSync?: Date | null;
  onRefreshAll?: () => void;
  onSubmitEnquiry?: (payload: EnquirySubmissionPayload) => Promise<{ success: boolean; message: string }>;
  onAskQuestion?: (question: string) => void;
  onOpenEnquiryModal?: () => void;
}

export const ALL_DEPARTMENT_OPTIONS = [
  'Artificial Intelligence & Machine Learning (AIML)',
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Biotechnology & Biomedical',
  'Civil Engineering',
  'School of Management (MBA/BBA)',
  'School of Architecture (B.Arch)'
];

export function isProgramForDepartment(programName: string, dept: string | null | undefined): boolean {
  if (!dept || !programName) return false;
  const d = dept.toLowerCase().trim();
  const p = programName.toLowerCase().trim();

  // AIML / Artificial Intelligence & Machine Learning
  if (
    d.includes('aiml') ||
    d.includes('machine learning') ||
    d.includes('artificial intelligence') ||
    d.includes('ai &') ||
    d.includes('ai and')
  ) {
    return (
      p.includes('aiml') ||
      p.includes('machine learning') ||
      p.includes('artificial intelligence') ||
      p.includes('ai &') ||
      p.includes('ai and')
    );
  }

  // CSE / Computer Science and Engineering
  if (d.includes('computer science') || d.includes('cse')) {
    if (p.includes('aiml') || p.includes('machine learning') || p.includes('data science')) {
      return false;
    }
    return p.includes('computer science') || p.includes('cse');
  }

  // Information Technology / IT
  if (d.includes('information technology') || d === 'it') {
    return p.includes('information technology');
  }

  // ECE / Electronics and Communication
  if (d.includes('electronics') || d.includes('ece') || d.includes('communication')) {
    return p.includes('electronics') || p.includes('ece') || p.includes('communication');
  }

  // EEE / Electrical and Electronics
  if (d.includes('electrical') || d.includes('eee')) {
    return p.includes('electrical') || p.includes('eee');
  }

  // Mechanical Engineering
  if (d.includes('mechanical') || d.includes('mech')) {
    return p.includes('mechanical');
  }

  // Civil Engineering
  if (d.includes('civil')) {
    return p.includes('civil');
  }

  // Biotechnology & Biomedical
  if (d.includes('biotech') || d.includes('biomedical') || d.includes('bio')) {
    return p.includes('biotechnology') || p.includes('biomedical');
  }

  // Management / MBA / BBA
  if (d.includes('management') || d.includes('mba') || d.includes('bba')) {
    return p.includes('mba') || p.includes('management') || p.includes('business');
  }

  // Architecture / B.Arch
  if (d.includes('architecture') || d.includes('b.arch') || d.includes('arch')) {
    return p.includes('architecture') || p.includes('b.arch');
  }

  return p.includes(d) || d.includes(p);
}

export const AdmissionsView: React.FC<AdmissionsViewProps> = ({ 
  onNavigateToAdmin,
  currentUser,
  onOpenAuthModal,
  liveStudents = [],
  liveAdmissionsInfo = null,
  liveFeeStructures = [],
  livePlacements = [],
  liveAnnouncements = [],
  onOpenAnnouncement = (_ann: AnnouncementItem) => {},
  isLiveConnected = true,
  lastLiveSync,
  onRefreshAll,
  onSubmitEnquiry,
  onAskQuestion,
  onOpenEnquiryModal
}) => {
  // Local states with solid preloaded fallbacks
  const [localAdmissionsInfo, setLocalAdmissionsInfo] = useState<AdmissionsInfo | null>(liveAdmissionsInfo || INITIAL_ADMISSIONS_INFO);
  const [localFeeStructures, setLocalFeeStructures] = useState<FeeStructureItem[]>(
    liveFeeStructures && liveFeeStructures.length > 0 ? liveFeeStructures : INITIAL_FEE_STRUCTURES
  );
  const [localPlacements, setLocalPlacements] = useState<PlacedStudentItem[]>(
    livePlacements && livePlacements.length > 0 ? livePlacements : INITIAL_PLACEMENTS
  );
  const [localStudents, setLocalStudents] = useState<StudentUser[]>(
    liveStudents && liveStudents.length > 0 ? liveStudents : INITIAL_STUDENTS
  );
  const [loading, setLoading] = useState(false);

  // Enquiry Modal state
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryProgramPreselect, setEnquiryProgramPreselect] = useState('');

  const [selectedDegree, setSelectedDegree] = useState<'All' | 'UG' | 'PG'>('All');

  // Selected Placed Member for Details Modal
  const [selectedPlacement, setSelectedPlacement] = useState<PlacedStudentItem | null>(null);
  const [congratsCount, setCongratsCount] = useState<{ [id: string]: number }>(() => {
    try {
      const saved = localStorage.getItem('kare_placement_congrats_counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [hasCongratulated, setHasCongratulated] = useState<{ [id: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('kare_placement_user_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Toggle like / remove like handler
  const handleToggleLike = (id: string) => {
    const isCurrentlyLiked = !!hasCongratulated[id];
    const newLikedState = !isCurrentlyLiked;

    setHasCongratulated(prev => {
      const updated = { ...prev, [id]: newLikedState };
      try {
        localStorage.setItem('kare_placement_user_likes', JSON.stringify(updated));
      } catch {
        // Ignore localStorage quota errors
      }
      return updated;
    });

    setCongratsCount(prev => {
      const currentDelta = prev[id] || 0;
      const updatedCount = isCurrentlyLiked ? Math.max(0, currentDelta - 1) : currentDelta + 1;
      const updated = { ...prev, [id]: updatedCount };
      try {
        localStorage.setItem('kare_placement_congrats_counts', JSON.stringify(updated));
      } catch {
        // Ignore localStorage quota errors
      }
      return updated;
    });
  };

  // Keyboard shortcut listener to close details modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPlacement(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Interactive Merit Concession Simulator State
  const [simulatedMarks, setSimulatedMarks] = useState<number>(88);

  // Live Concession Calculator / Claim Form for Logged-In Student
  const [claimMarksInput, setClaimMarksInput] = useState<string>('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Live Application Lookup for Visitors / Guests
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<StudentUser | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isSearchingLookup, setIsSearchingLookup] = useState(false);

  // Synchronize from props when live updates arrive
  useEffect(() => {
    if (liveAdmissionsInfo) setLocalAdmissionsInfo(liveAdmissionsInfo);
  }, [liveAdmissionsInfo]);

  useEffect(() => {
    if (liveFeeStructures && liveFeeStructures.length > 0) setLocalFeeStructures(liveFeeStructures);
  }, [liveFeeStructures]);

  useEffect(() => {
    if (livePlacements && livePlacements.length > 0) setLocalPlacements(livePlacements);
  }, [livePlacements]);

  useEffect(() => {
    if (liveStudents && liveStudents.length > 0) setLocalStudents(liveStudents);
  }, [liveStudents]);

  // Initial fetch fallback if empty
  useEffect(() => {
    if (localFeeStructures.length === 0) {
      const fetchInitial = async () => {
        try {
          setLoading(true);
          const [admResult, stuResult] = await Promise.allSettled([
            apiFetch('/api/admissions/all').then(r => r.ok ? r.json() : null),
            apiFetch('/api/auth/students').then(r => r.ok ? r.json() : null)
          ]);

          if (admResult.status === 'fulfilled' && admResult.value) {
            const data = admResult.value;
            if (data.admissionsInfo) setLocalAdmissionsInfo(data.admissionsInfo);
            if (data.feeStructures?.length) setLocalFeeStructures(data.feeStructures);
            if (data.placements?.length) setLocalPlacements(data.placements);
          }
          if (stuResult.status === 'fulfilled' && stuResult.value) {
            const data = stuResult.value;
            if (data.students?.length) setLocalStudents(data.students);
          }
        } catch {
          // Gracefully retain preloaded fallback
        } finally {
          setLoading(false);
        }
      };
      fetchInitial();
    }
  }, []);

  const feeStructures = localFeeStructures;
  const admissionsInfo = localAdmissionsInfo;
  const placements = localPlacements;
  const students = localStudents;

  // Active student matching current user
  const activeStudent = currentUser 
    ? (students.find(s => s.id === currentUser.id || s.identifier === currentUser.identifier) || currentUser)
    : null;

  // Effective student (either logged-in or looked up via application number)
  const effectiveStudent = activeStudent || lookupResult;
  const studentRegisteredDept = effectiveStudent?.department || null;

  // Department filter state: defaults to student's registered department when available
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>(() => {
    return studentRegisteredDept || 'All';
  });
  const [showAllDepartments, setShowAllDepartments] = useState<boolean>(false);

  // Sync with student registration updates
  useEffect(() => {
    if (studentRegisteredDept) {
      setSelectedDeptFilter(studentRegisteredDept);
      setShowAllDepartments(false);
    }
  }, [studentRegisteredDept]);

  // Sync simulator marks with student intermediate marks
  useEffect(() => {
    if (effectiveStudent?.intermediateMarks && effectiveStudent.intermediateMarks > 0) {
      setSimulatedMarks(Math.round(effectiveStudent.intermediateMarks));
    }
  }, [effectiveStudent?.intermediateMarks]);

  // The active department to filter by
  const activeDeptFilter = (!showAllDepartments && selectedDeptFilter !== 'All')
    ? selectedDeptFilter
    : null;

  const filteredFees = feeStructures.filter(item => {
    // If a registered department filter is active, only show that department's program
    if (activeDeptFilter) {
      return isProgramForDepartment(item.program, activeDeptFilter);
    }
    // Otherwise filter by selected degree (UG / PG / All)
    if (selectedDegree === 'All') return true;
    return item.degree === selectedDegree;
  });

  // Program to base simulator calculations on
  const activeFeeProgram = (filteredFees.length > 0 ? filteredFees[0] : null) || feeStructures[0];
  const activeAnnualTuitionNum = activeFeeProgram
    ? parseInt(activeFeeProgram.annualTuition.replace(/[^0-9]/g, ''), 10) || 140000
    : 140000;

  const getSimulatedConcession = (marks: number) => {
    let percent = 0;
    let label = 'Standard Tuition';
    let tier = 'Eligible for Concession';
    if (marks >= 95) {
      percent = 50;
      label = '50% Tuition Waiver';
      tier = 'Super Merit S1';
    } else if (marks >= 90) {
      percent = 25;
      label = '25% Tuition Waiver';
      tier = 'Merit S2';
    } else if (marks >= 80) {
      percent = 15;
      label = '15% Tuition Waiver';
      tier = 'Merit S3';
    } else if (marks >= 70) {
      percent = 10;
      label = '10% Tuition Waiver';
      tier = 'Merit S4';
    }
    const saveAmt = Math.round((activeAnnualTuitionNum * percent) / 100);
    const savings = percent > 0 ? `₹${saveAmt.toLocaleString('en-IN')} / yr` : '₹0 / yr';
    const netPayable = activeAnnualTuitionNum - saveAmt;
    return {
      percent,
      label,
      savings,
      saveAmt,
      tier,
      netPayable: `₹${netPayable.toLocaleString('en-IN')} / yr`,
      baseTuition: activeFeeProgram?.annualTuition || `₹${activeAnnualTuitionNum.toLocaleString('en-IN')} / yr`,
      programName: activeFeeProgram?.program || 'Program Fee'
    };
  };

  // Handle student claiming / updating Intermediate Marks Concession
  const handleClaimConcession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent) return;
    const marks = parseFloat(claimMarksInput);
    if (isNaN(marks) || marks < 0 || marks > 100) {
      setClaimMessage({ text: 'Please enter a valid percentage between 0 and 100.', isError: true });
      return;
    }

    try {
      setIsClaiming(true);
      setClaimMessage(null);
      const res = await apiFetch('/api/students/claim-concession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: activeStudent.identifier,
          intermediateMarks: marks
        })
      });

      const data = await res.json();
      if (res.ok) {
        setClaimMessage({ text: data.message || 'Concession calculated and updated live!' });
        setClaimMarksInput('');
        if (onRefreshAll) onRefreshAll();
      } else {
        setClaimMessage({ text: data.error || 'Failed to claim concession.', isError: true });
      }
    } catch (err) {
      console.error('Error claiming concession:', err);
      setClaimMessage({ text: 'Network error while updating concession.', isError: true });
    } finally {
      setIsClaiming(false);
    }
  };

  // Handle live status lookup for guests
  const handleLookup = async (queryToUse?: string) => {
    const q = (queryToUse || lookupQuery).trim();
    if (!q) return;

    try {
      setIsSearchingLookup(true);
      setLookupError(null);
      setLookupResult(null);

      const res = await apiFetch(`/api/admissions/student-status/${encodeURIComponent(q)}`);
      const data = await res.json();
      if (res.ok && data.student) {
        setLookupResult(data.student);
      } else {
        setLookupError(data.error || `No admission record found for "${q}".`);
      }
    } catch (err) {
      console.error('Error looking up admission status:', err);
      setLookupError('Network error while looking up admission status.');
    } finally {
      setIsSearchingLookup(false);
    }
  };

  if (loading && feeStructures.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-500 font-mono">Loading Admissions & Student Live Synchronized Module...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 text-zinc-100">
      
      {/* Real-Time Live Sync Status Notification Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-zinc-900/60 to-emerald-950/40 border border-blue-800/40 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className={`w-3 h-3 rounded-full ${isLiveConnected ? 'bg-emerald-500' : 'bg-amber-500'} ring-4 ${isLiveConnected ? 'ring-emerald-500/20 animate-pulse' : 'ring-amber-500/20'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Live Linked Architecture Active
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                Admissions ⇄ Student Module
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Any changes made to fee structures, concessions, or student enrollments propagate in real-time across both modules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="text-[10px] text-zinc-400 font-mono hidden md:inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-500" />
            Last synced: {lastLiveSync ? new Date(lastLiveSync).toLocaleTimeString() : 'Live Stream Active'}
          </span>
          {onRefreshAll && (
            <button
              onClick={onRefreshAll}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
              title="Force Sync Re-fetch"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Official University Announcements & Circulars */}
      {liveAnnouncements && liveAnnouncements.length > 0 && (
        <div className="bg-[#0e0e0e] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Official Announcements & Circulars
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/60">
                    Active
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Directives, fee waiver verification schedules, and university circulars
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
              {liveAnnouncements.length} {liveAnnouncements.length === 1 ? 'Circular' : 'Circulars'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {liveAnnouncements.map((ann) => {
              const isUrgent = ann.priority === 'urgent';
              return (
                <div
                  key={ann.id}
                  onClick={() => onOpenAnnouncement(ann)}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 cursor-pointer transition-all hover:scale-[1.006] group ${
                    isUrgent
                      ? 'bg-rose-950/30 border-rose-800/60 hover:bg-rose-950/50 text-rose-100'
                      : 'bg-zinc-900/70 border-zinc-800 hover:border-blue-500/40 hover:bg-zinc-900 text-zinc-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                        isUrgent ? 'bg-rose-900/80 text-rose-200' : 'bg-blue-950 text-blue-300 border border-blue-800/40'
                      }`}>
                        {ann.category}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {ann.circularNumber}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 shrink-0">
                      {new Date(ann.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                    {ann.title}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/40 text-[11px] text-zinc-400">
                    <span className="truncate max-w-[200px]">{ann.authorRole}</span>
                    <span className="inline-flex items-center gap-1 text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform shrink-0">
                      View Circular <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Admissions Banner */}
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <KalasalingamLogo size="md" variant="badge" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Admissions, Fee Structure & Placements
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {admissionsInfo?.overview || 'Official admission portal for undergraduate, postgraduate, and research programs with transparent fee structures and merit scholarship concessions.'}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-400">
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-blue-300 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                {admissionsInfo?.admissionYear || 'Academic Year 2025 - 2026'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 font-semibold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                NAAC A++ Accredited Deemed University
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-300 font-semibold flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                Up to 50% Concession on Intermediate Marks
              </span>
            </div>
          </div>

          {/* Admissions Helpdesk & Counseling Contact Box */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2">
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs space-y-1.5 min-w-[220px]">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Admissions Helpdesk</span>
              <p className="text-white font-semibold flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>{admissionsInfo?.contactPhone || '+91 4563 289 042'}</span>
              </p>
              <button
                type="button"
                onClick={() => openFacultyGmail({
                  to: admissionsInfo?.contactEmail || 'admissions@kare.ac.in',
                  subject: 'Admissions Inquiry - Kalasalingam Academy of Research and Education',
                  department: 'Admissions & Scholarships'
                })}
                className="text-sky-300 hover:text-white text-[11px] flex items-center gap-2 truncate group cursor-pointer transition-colors"
                title="Click to compose email via Gmail"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400 group-hover:text-white" />
                <span className="group-hover:underline font-mono">{admissionsInfo?.contactEmail || 'admissions@kare.ac.in'}</span>
              </button>
              <p className="text-zinc-500 text-[10px] pt-1 border-t border-zinc-800 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                <span className="truncate">{admissionsInfo?.admissionsOfficeLocation || 'Administrative Block, Ground Floor'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* UNIQUE ANIMATION 1: LIVE PLACEMENTS WALL-OF-FAME MARQUEE TICKER WITH PHOTOS */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[#0b0b0b] border border-emerald-500/30 p-3.5 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute top-0 right-1/4 w-72 h-20 bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2 border-b border-zinc-800/80 px-1 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Office of Placements • High Achievers Wall of Fame
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 shadow-sm font-mono">
              Peak: 44.0 LPA
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[10px] text-zinc-500 font-mono">
              (Hover to pause ticker • Click any card for details)
            </span>
          </div>
        </div>

        {/* Marquee Ticker Track */}
        <div className="overflow-hidden py-1 relative">
          <div className="animate-marquee flex gap-3">
            {[...placements, ...placements].map((p, idx) => {
              const numLpa = parseFloat(p.lpaDetails) || 0;
              const isSuperDream = numLpa >= 20;
              return (
                <div
                  key={`${p.id}-${idx}`}
                  className={`inline-flex items-center gap-3 px-3.5 py-2 rounded-xl bg-zinc-900/90 border transition-all shrink-0 select-none shadow-md hover:scale-[1.02] cursor-pointer ${
                    isSuperDream 
                      ? 'border-emerald-500/50 bg-gradient-to-r from-[#121212] via-emerald-950/30 to-[#121212] ring-1 ring-emerald-500/20' 
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                  onClick={() => {
                    setSelectedPlacement(p);
                  }}
                  title={p.studentName ? `${p.studentName} placed at ${p.companyName} for ${p.lpaDetails} - Click to view details` : `${p.companyName}: ${p.lpaDetails} - Click to view details`}
                >
                  {/* Student Photo Avatar */}
                  <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0 flex items-center justify-center">
                    {p.photoUrl ? (
                      <img 
                        src={p.photoUrl} 
                        alt={p.studentName || p.companyName} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-300 font-bold text-xs">
                        {p.studentName ? p.studentName.charAt(0) : p.companyName.charAt(0)}
                      </div>
                    )}
                    {isSuperDream && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center ring-1 ring-black shadow-xs">
                        <Sparkles className="w-1.5 h-1.5 text-black fill-black" />
                      </span>
                    )}
                  </div>

                  {/* Company and Student info */}
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{p.companyName}</span>
                      {isSuperDream && (
                        <span className="text-[9px] font-extrabold text-amber-300 bg-amber-950/80 px-1 rounded border border-amber-800/60 font-mono">
                          Tier 1
                        </span>
                      )}
                    </div>
                    {p.studentName ? (
                      <span className="text-[10px] text-zinc-400 block font-medium">
                        {p.studentName} {p.department ? <span className="text-zinc-500 font-normal">({p.department})</span> : ''}
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-500 block">{p.placementYear || '2024-2025'}</span>
                    )}
                  </div>

                  {/* LPA Badge & Liked Indicator */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {hasCongratulated[p.id] && (
                      <Heart className="w-3 h-3 fill-rose-400 text-rose-400 animate-pulse" />
                    )}
                    <span className="px-2 py-0.8 rounded-lg text-xs font-mono font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800/70 shadow-sm">
                      {p.lpaDetails}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADMISSION & FEE CONCESSION ENQUIRY PORTAL BANNER (GUEST / PROSPECTIVE ONLY) */}
      {/* ========================================================================= */}
      {!currentUser && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-[#0e0e0e] to-zinc-900 border border-blue-600/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
              <Inbox className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Submit Campus & Admission Enquiry
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  Official Admissions Desk
                </span>
              </div>
              <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                Have questions about scholarships, 50% Intermediate fee waivers, hostel room types, or branch selection? Submit your enquiry details directly to our server. Our counselors will call and assist you promptly.
              </p>
            </div>
          </div>

          <button
            id="btn-admissions-open-enquiry"
            onClick={() => {
              setEnquiryProgramPreselect('');
              setShowEnquiryModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xl shadow-blue-600/30 transition-all shrink-0 hover:scale-[1.02]"
          >
            <Inbox className="w-4 h-4" />
            <span>Enquire Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LINKED MODULE INTERACTIVE PORTAL: LOGGED-IN STUDENT OR GUEST LOOKUP */}
      {/* ========================================================================= */}
      {activeStudent ? (
        /* Logged-In Student: Personalized Live Admission & Fee Concession Record */
        <div className="bg-[#0a0a0a] border border-blue-800/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-base shadow-lg shadow-blue-600/20">
                {activeStudent.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">{activeStudent.name}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/60">
                    {getDisplayYearOfStudy(activeStudent)}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono">
                  {activeStudent.cohort === 'first_year' ? `Application #${activeStudent.applicationNumber || activeStudent.identifier}` : activeStudent.collegeEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-400">Live Admission Status:</span>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {activeStudent.admissionStatus || 'Provisional Confirmed'}
              </span>
            </div>
          </div>

          {/* 4-Stat Grid Linked to Admissions Fee Structure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#121212] border border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Program / Branch</span>
              <span className="text-xs font-bold text-zinc-200 block leading-tight">{activeStudent.department}</span>
              <span className="text-[10px] text-zinc-500 font-mono">Academic Year 2025-2026</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121212] border border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">+2 / Intermediate Score</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-white font-mono">
                  {activeStudent.intermediateMarks ? `${activeStudent.intermediateMarks}%` : 'Not Submitted'}
                </span>
                {activeStudent.intermediateMarks && activeStudent.intermediateMarks >= 90 && (
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                    <Award className="w-3 h-3" /> Top Tier
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-500">Board exam percentage</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Merit Concession</span>
              <span className="text-xs font-bold text-amber-300 block leading-tight">
                {activeStudent.concessionApplied || 'Standard Tuition'}
              </span>
              <span className="text-[10px] text-amber-400/80 font-mono">Calculated live from fee slab</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Net Tuition Due</span>
              <span className="text-xs font-bold text-emerald-300 block font-mono leading-tight">
                {activeStudent.annualTuitionDue || 'Refer Fee Schedule'}
              </span>
              <span className="text-[10px] text-zinc-400">
                Hostel: <span className="text-zinc-200">{activeStudent.hostelAllotted || 'Day Scholar'}</span>
              </span>
            </div>
          </div>

          {/* Interactive Concession Claim Form */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 to-zinc-900 border border-blue-800/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-0.5 max-w-lg">
              <h3 className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Update +2 Intermediate Marks to Re-calculate Merit Concession Live
              </h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Enter your official +2 / 12th board score (MPC / BiPC). The Admissions system will immediately recalculate your fee waiver and update both this module and the Admin records in real-time.
              </p>
            </div>

            <form onSubmit={handleClaimConcession} className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="40"
                  max="100"
                  required
                  value={claimMarksInput}
                  onChange={(e) => setClaimMarksInput(e.target.value)}
                  placeholder="e.g. 96.5"
                  className="w-28 bg-[#0a0a0a] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-blue-500"
                />
                <span className="absolute right-2.5 top-2 text-xs text-zinc-400 font-mono">%</span>
              </div>
              <button
                type="submit"
                disabled={isClaiming}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20"
              >
                {isClaiming ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>Apply Live</span>
              </button>
            </form>
          </div>

          {claimMessage && (
            <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
              claimMessage.isError 
                ? 'bg-rose-950/40 text-rose-300 border border-rose-800/40' 
                : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
            }`}>
              {claimMessage.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{claimMessage.text}</span>
            </div>
          )}
        </div>
      ) : (
        /* Guest / Applicant View: Live Application Status & Concession Tracker */
        <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
                  <Search className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white">Live Student Admission & Concession Tracker</h2>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Check real-time application confirmation, merit fee waivers, and hostel room allotment
              </p>
            </div>

            {onOpenAuthModal && (
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <User className="w-3.5 h-3.5" />
                <span>Log in for Full Student Portal</span>
              </button>
            )}
          </div>

          {/* Quick Lookup Form */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Hash className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                placeholder="Enter 1st Year Application Number (e.g. 2025KARE04128) or College Email..."
                className="w-full bg-[#121212] border border-[#222222] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => handleLookup()}
              disabled={isSearchingLookup || !lookupQuery.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              {isSearchingLookup ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Track Live Status</span>
            </button>
          </div>

          {/* Lookup Error */}
          {lookupError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{lookupError}</span>
            </div>
          )}

          {/* Lookup Result Card */}
          {lookupResult && (
            <div className="p-4 rounded-xl bg-[#121212] border border-blue-500/40 space-y-3 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{lookupResult.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                      {getDisplayYearOfStudy(lookupResult)}
                    </span>
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    {lookupResult.cohort === 'first_year' ? `Application #${lookupResult.applicationNumber}` : lookupResult.collegeEmail} • {lookupResult.department}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 self-start sm:self-auto">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {lookupResult.admissionStatus || 'Provisional Confirmed'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-0.5">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold block">Intermediate Score</span>
                  <span className="font-bold text-white font-mono text-sm">
                    {lookupResult.intermediateMarks ? `${lookupResult.intermediateMarks}%` : 'Pending'}
                  </span>
                  <span className="text-[10px] text-zinc-400 block">Marks on record</span>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/40 space-y-0.5">
                  <span className="text-amber-400 text-[10px] uppercase font-bold block">Concession Approved</span>
                  <span className="font-bold text-amber-300 text-xs block truncate">
                    {lookupResult.concessionApplied || 'Standard Fee'}
                  </span>
                  <span className="text-[10px] text-zinc-400 block font-mono">
                    Due: {lookupResult.annualTuitionDue || 'Standard'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-0.5">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold block">Campus & Hostel</span>
                  <span className="font-bold text-zinc-200 text-xs block truncate">
                    {lookupResult.hostelAllotted || 'Day Scholar'}
                  </span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {lookupResult.documentsVerified ? 'Documents Verified' : 'Verification In-Progress'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT: Admissions Information & Fee Structure */}
      {/* ========================================================================= */}
      <div className="space-y-8">
          
          {/* SECTION 1: FEE STRUCTURE & INTERMEDIATE CONCESSIONS */}
          <section className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#222222] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-white">
                        {activeDeptFilter ? `Fee Structure & Concessions` : 'University Fee Structure & Concessions'}
                      </h2>
                      {activeDeptFilter ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                          {activeDeptFilter.includes('AIML') ? 'AIML Department' : activeDeptFilter}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 font-mono">
                          {filteredFees.length} Programs
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">
                      {activeDeptFilter 
                        ? `Displaying tailored tuition fee schedule and +2 concession slabs for your registered course. Other departments are hidden.`
                        : `Annual tuition fee schedules & Intermediate (+2) percentage concession slabs`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Department & Degree Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Department Selector */}
                <div className="flex items-center gap-1.5 bg-zinc-900/90 px-2.5 py-1.5 rounded-xl border border-zinc-800 text-xs">
                  <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <select
                    value={activeDeptFilter || 'All'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'All') {
                        setShowAllDepartments(true);
                        setSelectedDeptFilter('All');
                      } else {
                        setSelectedDeptFilter(val);
                        setShowAllDepartments(false);
                      }
                    }}
                    className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer pr-1"
                    title="Filter by Department"
                  >
                    <option value="All" className="bg-zinc-900 text-zinc-200">All Departments</option>
                    {ALL_DEPARTMENT_OPTIONS.map(dept => (
                      <option key={dept} value={dept} className="bg-zinc-900 text-zinc-200">
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* If student has registered department, provide 1-click toggle */}
                {studentRegisteredDept && (
                  showAllDepartments ? (
                    <button
                      onClick={() => {
                        setShowAllDepartments(false);
                        setSelectedDeptFilter(studentRegisteredDept);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Filter to My Course</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowAllDepartments(true)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-all"
                    >
                      View All Depts ({feeStructures.length})
                    </button>
                  )
                )}

                {/* Degree Filter Chips with Motion Layout Transition (when showing all degrees) */}
                {(!activeDeptFilter || showAllDepartments) && (
                  <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs">
                    {(['All', 'UG', 'PG'] as const).map(deg => {
                      const isActive = selectedDegree === deg;
                      return (
                        <button
                          key={deg}
                          onClick={() => setSelectedDegree(deg)}
                          className={`relative px-3 py-1.5 rounded-lg font-semibold transition-colors z-10 ${
                            isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="activeDegreeTabIndicator"
                              className="absolute inset-0 bg-blue-600 rounded-lg -z-10 shadow-md shadow-blue-600/30"
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                            />
                          )}
                          {deg === 'All' ? 'All Degrees' : deg}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Department Isolation Status Banner */}
            {activeDeptFilter && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-zinc-900/60 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">Registered Course / Dept:</span>
                      <span className="font-bold text-blue-300 font-mono">{activeDeptFilter}</span>
                      {effectiveStudent && (
                        <span className="text-[11px] text-zinc-400">
                          (Student: {effectiveStudent.name})
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Showing admission and fee details specifically for this course. Other department details are hidden.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowAllDepartments(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium hover:underline flex items-center gap-1"
                  >
                    <span>Compare with other departments &rarr;</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* UNIQUE ANIMATION 2: INTERACTIVE MERIT CONCESSION SIMULATOR */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/20 via-[#101010] to-[#0c0c0c] border border-amber-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Intermediate (+2) Merit Concession Simulator</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                        Live Calc
                      </span>
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Calculated for <strong className="text-zinc-200">{activeFeeProgram?.program}</strong> (Base: {activeFeeProgram?.annualTuition})
                    </p>
                  </div>
                </div>

                {/* Live Concession Badge */}
                {(() => {
                  const calc = getSimulatedConcession(simulatedMarks);
                  return (
                    <div className="flex items-center gap-2 shrink-0">
                      <motion.div 
                        key={`${calc.percent}-${calc.saveAmt}`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-right"
                      >
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-xs font-bold text-amber-300">{calc.label}</span>
                          {activeDeptFilter && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/30 text-amber-200 font-mono">
                              {activeDeptFilter.includes('AIML') ? 'AIML' : 'Filtered'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono justify-end mt-0.5">
                          <span>Est. Save: <strong className="text-emerald-400">{calc.savings}</strong></span>
                          <span>•</span>
                          <span>Net Tuition: <strong className="text-zinc-200">{calc.netPayable}</strong></span>
                        </div>
                      </motion.div>
                    </div>
                  );
                })()}
              </div>

              {/* Slider & Quick Presets */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>Your Marks: <strong className="text-white text-sm">{simulatedMarks}%</strong></span>
                  <div className="flex items-center gap-1.5">
                    {[96, 92, 85, 75].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setSimulatedMarks(pct)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                          simulatedMarks === pct
                            ? 'bg-amber-500 text-black font-bold'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="range"
                  min="60"
                  max="100"
                  step="1"
                  value={simulatedMarks}
                  onChange={(e) => setSimulatedMarks(parseInt(e.target.value) || 60)}
                  className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />

                {/* Animated Visual Gauge */}
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getSimulatedConcession(simulatedMarks).percent * 2}%` }}
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                  />
                </div>
              </div>
            </div>

            {/* Fee Items List */}
            <div className="space-y-4">
              {filteredFees.length === 0 ? (
                <div className="p-8 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">No Programs Found</h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    No matching fee schedule found for "{activeDeptFilter || selectedDegree}".
                  </p>
                  <button
                    onClick={() => {
                      setShowAllDepartments(true);
                      setSelectedDeptFilter('All');
                      setSelectedDegree('All');
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                  >
                    View All Programs
                  </button>
                </div>
              ) : (
                filteredFees.map((fee) => (
                  <div 
                    key={fee.id}
                    className="bg-[#121212] border border-[#222222] hover:border-zinc-700 rounded-xl p-5 space-y-4 transition-all"
                  >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800">
                          {fee.degree} Program
                        </span>
                        <h3 className="text-base font-bold text-white">{fee.program}</h3>
                      </div>
                      {fee.specialNotes && (
                        <p className="text-xs text-zinc-400 mt-1">{fee.specialNotes}</p>
                      )}
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 block">Annual Tuition</span>
                      <span className="text-lg font-extrabold text-amber-400 font-mono">{fee.annualTuition}</span>
                    </div>
                  </div>

                  {/* Intermediate (+2) Marks Concession Box */}
                  {fee.intermediateConcessions && fee.intermediateConcessions.length > 0 && (
                    <div className="bg-[#0a0a0a] border border-amber-500/20 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Intermediate / +2 Marks Scholarship & Concession Slabs:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {fee.intermediateConcessions.map((slab, sIdx) => (
                          <div 
                            key={sIdx}
                            className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-900/80 border border-zinc-800"
                          >
                            <span className="text-zinc-300">{slab.marksRange}</span>
                            <span className="font-bold text-emerald-400 shrink-0 text-right bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                              {slab.concession}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Facilities & Payment Terms */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-zinc-400 border-t border-zinc-800/60 font-mono">
                    {fee.hostelFee && (
                      <div>
                        <span className="text-zinc-500 text-[10px] uppercase block">Hostel & Dining</span>
                        <span className="text-zinc-300 font-sans">{fee.hostelFee}</span>
                      </div>
                    )}
                    {fee.cautionDeposit && (
                      <div>
                        <span className="text-zinc-500 text-[10px] uppercase block">Caution Deposit</span>
                        <span className="text-zinc-300 font-sans">{fee.cautionDeposit}</span>
                      </div>
                    )}
                    {fee.installments && (
                      <div>
                        <span className="text-zinc-500 text-[10px] uppercase block">Installment Terms</span>
                        <span className="text-zinc-300 font-sans">{fee.installments}</span>
                      </div>
                    )}
                  </div>

                  {/* Program Enquiry Action Button (Guest / Prospective Only) */}
                  {!currentUser && (
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/40">
                      <span className="text-[11px] text-zinc-500">
                        Need admission cutoff or fee concession verification?
                      </span>
                      <button
                        onClick={() => {
                          setEnquiryProgramPreselect(fee.program);
                          setShowEnquiryModal(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 text-xs font-semibold transition-all"
                      >
                        <Inbox className="w-3.5 h-3.5" />
                        Enquire for {fee.degree} {fee.program.split(' ')[0]}
                      </button>
                    </div>
                  )}
                </div>
              )))}
            </div>
          </section>

      </div>

      {/* Campus Admissions Enquiry Modal */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        defaultProgram={enquiryProgramPreselect}
        onSubmitEnquiry={onSubmitEnquiry || (async (payload) => {
          try {
            const res = await apiFetch('/api/enquiries', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            const data = await res.json();
            return {
              success: data.success ?? res.ok,
              message: data.message || data.error || 'Enquiry saved successfully.'
            };
          } catch (err: any) {
            return {
              success: false,
              message: err.message || 'Network error saving enquiry.'
            };
          }
        })}
      />

      {/* ========================================================================= */}
      {/* PLACED MEMBER DETAILS MODAL (Opens on clicking any placed student card) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedPlacement && (
          <div 
            id="modal-placement-details-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedPlacement(null)}
          >
            <motion.div
              id="modal-placement-details-card"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#0e0e0e] border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-5 relative overflow-hidden text-left"
            >
              {/* Background ambient lighting effects */}
              <div className="absolute top-0 right-0 w-64 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 blur-3xl pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Trophy className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Placement Achiever Profile
                    </h3>
                    <p className="text-[11px] text-zinc-400">Office of Placements & Career Advancement</p>
                  </div>
                </div>
                <button
                  id="btn-close-placement-details"
                  onClick={() => setSelectedPlacement(null)}
                  className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Close details (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Student Profile & Placement Details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10">
                {/* Photo / Avatar */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-zinc-900 border-2 border-emerald-500/60 shadow-xl shrink-0 group">
                  {selectedPlacement.photoUrl ? (
                    <img
                      src={selectedPlacement.photoUrl}
                      alt={selectedPlacement.studentName || selectedPlacement.companyName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-emerald-400 font-extrabold text-3xl">
                      {selectedPlacement.studentName ? selectedPlacement.studentName.charAt(0) : selectedPlacement.companyName.charAt(0)}
                    </div>
                  )}
                  {parseFloat(selectedPlacement.lpaDetails) >= 20 && (
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-amber-400 text-black text-[9px] font-extrabold flex items-center gap-0.5 shadow">
                      <Sparkles className="w-2.5 h-2.5 fill-black" /> Super Dream
                    </span>
                  )}
                </div>

                {/* Core Info */}
                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {selectedPlacement.studentName || 'Placed Student'}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                      Verified Campus Offer
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400">
                    {selectedPlacement.department || 'B.Tech Engineering'} • Batch {selectedPlacement.placementYear || '2024-2025'}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {/* Company Badge */}
                    <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center gap-2 shadow-sm">
                      <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-sm font-bold text-white">{selectedPlacement.companyName}</span>
                    </div>

                    {/* CTC Package */}
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center gap-1.5 shadow-sm">
                      <Flame className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-extrabold text-emerald-300 font-mono">
                        {selectedPlacement.lpaDetails}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Placement Metrics Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 relative z-10">
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Package Tier</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    {parseFloat(selectedPlacement.lpaDetails) >= 20 
                      ? 'Super Dream Offer' 
                      : parseFloat(selectedPlacement.lpaDetails) >= 10 
                        ? 'Dream Tier' 
                        : 'Premier Campus'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Est. Monthly Gross</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {(() => {
                      const val = parseFloat(selectedPlacement.lpaDetails);
                      if (val > 0) {
                        const monthly = Math.round((val * 100000) / 12);
                        return `₹${monthly.toLocaleString('en-IN')}/mo`;
                      }
                      return 'Competitive';
                    })()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Drive Status</span>
                  <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    On-Campus Selection
                  </span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 relative z-10">
                {/* Congratulate / Like & Remove Like Button Group */}
                <div className="flex items-center gap-1.5">
                  <button
                    id="btn-toggle-like-placement"
                    type="button"
                    onClick={() => handleToggleLike(selectedPlacement.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer group ${
                      hasCongratulated[selectedPlacement.id]
                        ? 'bg-rose-950/50 border-rose-500/60 text-rose-300 hover:bg-rose-900/60 hover:border-rose-400'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800'
                    }`}
                    title={hasCongratulated[selectedPlacement.id] ? "Click to remove like" : "Click to like / congratulate"}
                  >
                    <motion.div
                      whileTap={{ scale: 0.8 }}
                      animate={hasCongratulated[selectedPlacement.id] ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Heart 
                        className={`w-3.5 h-3.5 transition-colors ${
                          hasCongratulated[selectedPlacement.id] 
                            ? 'fill-rose-400 text-rose-400' 
                            : 'text-zinc-400 group-hover:text-rose-400'
                        }`} 
                      />
                    </motion.div>
                    
                    <span>
                      {hasCongratulated[selectedPlacement.id] ? 'Liked' : 'Like'}
                    </span>

                    <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] font-mono text-zinc-200">
                      {(congratsCount[selectedPlacement.id] || 0) + 18}
                    </span>
                  </button>

                  {/* Explicit Remove Like action button when already liked */}
                  {hasCongratulated[selectedPlacement.id] && (
                    <button
                      id="btn-remove-like-placement"
                      type="button"
                      onClick={() => handleToggleLike(selectedPlacement.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      title="Remove your like"
                    >
                      <X className="w-3 h-3 text-zinc-400 group-hover:text-rose-300" />
                      <span>Remove Like</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Ask AI about Company/Interview */}
                  {onAskQuestion && (
                    <button
                      id="btn-ask-ai-placement"
                      type="button"
                      onClick={() => {
                        const company = selectedPlacement.companyName;
                        const lpa = selectedPlacement.lpaDetails;
                        setSelectedPlacement(null);
                        onAskQuestion(`What is the placement interview process, technical rounds, and preparation roadmap for ${company} campus recruitment offering ${lpa}?`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Ask AI About {selectedPlacement.companyName}</span>
                    </button>
                  )}

                  <button
                    id="btn-close-placement-modal"
                    type="button"
                    onClick={() => setSelectedPlacement(null)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
