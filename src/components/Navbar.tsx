import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  MessageSquareText, 
  Cpu, 
  BookOpen, 
  BarChart3, 
  Building2, 
  GraduationCap,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  Hash,
  Mail,
  ShieldCheck,
  Lock,
  Clock,
  Shield,
  FileText,
  Home,
  KeyRound,
  Calendar
} from 'lucide-react';
import { StudentUser, StudentCohort, AdminUser, AnnouncementItem } from '../types';
import { NotificationCenter } from './NotificationCenter';
import { KalasalingamLogo } from './KalasalingamLogo';
import { calculateStudentYearInfo } from '../utils/studentYearHelper';

interface NavbarProps {
  activeTab: 'home' | 'chat' | 'nlp' | 'faqs' | 'admin' | 'admissions' | 'academics' | 'faculty';
  setActiveTab: (tab: 'home' | 'chat' | 'nlp' | 'faqs' | 'admin' | 'admissions' | 'academics' | 'faculty') => void;
  faqCount: number;
  currentUser: StudentUser | null;
  onOpenAuthModal: (mode?: 'login' | 'forgot_password', cohort?: StudentCohort) => void;
  onLogout: () => void;
  currentAdmin: AdminUser | null;
  onOpenAdminAuthModal: () => void;
  onOpenUnifiedAuthModal?: (initialRole?: 'student' | 'faculty') => void;
  onAdminLogout: () => void;
  onOpenChangePassword?: () => void;
  isLiveConnected?: boolean;
  lastLiveSync?: Date | null;
  announcements?: AnnouncementItem[];
  unreadAnnouncementIds?: string[];
  onOpenAnnouncement?: (announcement: AnnouncementItem) => void;
  onMarkAllAnnouncementsAsRead?: () => void;
  sessionRemainingSeconds?: number;
  onExtendSession?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  faqCount,
  currentUser,
  onOpenAuthModal,
  onLogout,
  currentAdmin,
  onOpenAdminAuthModal,
  onOpenUnifiedAuthModal,
  onAdminLogout,
  onOpenChangePassword,
  isLiveConnected = true,
  lastLiveSync,
  announcements = [],
  unreadAnnouncementIds = [],
  onOpenAnnouncement = () => {},
  onMarkAllAnnouncementsAsRead = () => {},
  sessionRemainingSeconds,
  onExtendSession
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const studentYearInfo = useMemo(() => {
    if (!currentUser) return null;
    return calculateStudentYearInfo(
      currentUser.rollNumber || currentUser.identifier || currentUser.applicationNumber,
      currentUser.joinedYear
    );
  }, [currentUser]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine whether current view is in Admin Console Mode
  const isAdminView = Boolean(currentAdmin || activeTab === 'admin');

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#222222] text-[#e0e0e0]">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand - Only in Admin Console; regular view starts cleanly with Home & AI Assistant navigation */}
          {isAdminView && (
            <div className="flex items-center gap-2.5 shrink-0">
              <KalasalingamLogo size="md" variant="crest" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm tracking-widest uppercase text-white font-sans">
                    KARE ADMIN CONSOLE
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-600/10 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" /> Faculty Access
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 font-mono hidden md:block">
                  Kalasalingam Academy of Research and Education • Administrative Portal
                </p>
              </div>
            </div>
          )}

          {/* Center Navigation Tabs - Completely removed in Admin Module */}
          {!isAdminView && (
            <nav className="hidden lg:flex items-center gap-1">
              <button
                id="nav-tab-home"
                onClick={() => setActiveTab('home')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  activeTab === 'home'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              <button
                id="nav-tab-chat"
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>AI Assistant</span>
              </button>

              <button
                id="nav-tab-admissions"
                onClick={() => setActiveTab('admissions')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  activeTab === 'admissions'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Admissions</span>
              </button>

              <button
                id="nav-tab-academics"
                onClick={() => setActiveTab('academics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  activeTab === 'academics'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Academics</span>
              </button>

              <button
                id="nav-tab-faculty"
                onClick={() => setActiveTab('faculty')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  activeTab === 'faculty'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Faculty & Mail IDs</span>
              </button>

              <button
                id="nav-tab-faqs"
                onClick={() => setActiveTab('faqs')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  activeTab === 'faqs'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Knowledge Base</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {faqCount}
                </span>
              </button>
            </nav>
          )}

          {/* Right Action Section */}
          <div className="flex items-center gap-2">
            
            {/* Live Synchronized Status Badge */}
            <div 
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-zinc-900/90 border border-zinc-800 text-zinc-300"
              title="Admissions & Student Modules linked in real-time"
            >
              <span className={`w-2 h-2 rounded-full ${isLiveConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-zinc-300">Live Sync</span>
            </div>

            {/* Session Security Inactivity Timer Badge */}
            {(currentUser || currentAdmin) && sessionRemainingSeconds !== undefined && (
              <div
                className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all border ${
                  sessionRemainingSeconds <= 60
                    ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
                    : sessionRemainingSeconds <= 180
                    ? 'bg-amber-950/70 border-amber-600 text-amber-300'
                    : 'bg-zinc-900/90 border-zinc-800 text-zinc-300'
                }`}
                title="Security session remaining time"
              >
                <Shield className={`w-3 h-3 ${sessionRemainingSeconds <= 60 ? 'text-rose-400' : 'text-emerald-400'}`} />
                <span className="font-mono">Session: {Math.floor(sessionRemainingSeconds / 60)}:{(sessionRemainingSeconds % 60).toString().padStart(2, '0')}</span>
              </div>
            )}

            {/* In Admin Module: Show only Admin Identity & Sign Out; ALL Student tabs/login buttons completely removed */}
            {isAdminView ? (
              <div className="flex items-center gap-2">
                {currentAdmin && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold text-white">{currentAdmin.name || currentAdmin.username}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                )}

                {currentAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={() => onOpenChangePassword?.()}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/60 hover:border-amber-600 text-amber-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      title="Change Faculty / Admin Password"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Change Password</span>
                    </button>

                    {/* Sign Out Administrator button */}
                    <button
                      type="button"
                      onClick={() => {
                        onAdminLogout();
                        setActiveTab('chat');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 hover:border-rose-600 text-rose-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      id="admin-logout-btn"
                      title="Sign Out of Administrator Account"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              /* Student Portal Navigation Icons & Authentication */
              <>
                {/* Mobile Nav Tabs Icons */}
                <div className="flex lg:hidden items-center gap-1">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`p-1.5 rounded-lg text-xs ${activeTab === 'chat' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}
                    title="AI Assistant"
                  >
                    <MessageSquareText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('admissions')}
                    className={`p-1.5 rounded-lg text-xs ${activeTab === 'admissions' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}
                    title="Admissions"
                  >
                    <GraduationCap className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('academics')}
                    className={`p-1.5 rounded-lg text-xs ${activeTab === 'academics' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}
                    title="Academics"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('faculty')}
                    className={`p-1.5 rounded-lg text-xs ${activeTab === 'faculty' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}
                    title="Faculty & Mail IDs"
                  >
                    <Mail className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => setActiveTab('faqs')}
                    className={`p-1.5 rounded-lg text-xs ${activeTab === 'faqs' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}
                    title="Knowledge Base"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  {currentAdmin && (
                    <button
                      onClick={() => setActiveTab('admin')}
                      className="p-1.5 rounded-lg text-xs text-emerald-400 hover:text-white"
                      title="Admin"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Official University Announcements Notification Center */}
                <NotificationCenter
                  announcements={announcements}
                  unreadIds={unreadAnnouncementIds}
                  onOpenAnnouncement={onOpenAnnouncement}
                  onMarkAllAsRead={onMarkAllAnnouncementsAsRead}
                  currentUser={currentUser}
                />

                {/* If Logged In: Show Student Profile Menu */}
                {currentUser ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowUserDropdown(prev => !prev)}
                      className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-left group"
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        (studentYearInfo?.cohort || currentUser.cohort) === 'first_year' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-indigo-600 text-white'
                      }`}>
                        {(currentUser.name || 'Student').charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden sm:block">
                        <div className="text-xs font-semibold text-white leading-tight truncate max-w-[120px] md:max-w-[150px]">
                          {currentUser.name || 'Student'}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                          <span className={(studentYearInfo?.cohort || currentUser.cohort) === 'first_year' ? 'text-blue-400' : 'text-indigo-400'}>
                            {studentYearInfo?.yearOfStudy || currentUser.yearOfStudy || 'Student'} • {currentUser.rollNumber || (currentUser.collegeEmail || currentUser.identifier || 'kare.ac.in').split('@')[0]}
                          </span>
                        </div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown Card */}
                    {showUserDropdown && (
                      <div className="absolute right-0 mt-2 w-72 bg-[#0e0e0e] border border-zinc-800 rounded-2xl p-3 shadow-2xl z-50 animate-fadeIn space-y-3">
                        <div className="flex items-start gap-2.5 pb-2.5 border-b border-zinc-800/80">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                            (studentYearInfo?.cohort || currentUser.cohort) === 'first_year' ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white'
                          }`}>
                            {(currentUser.name || 'Student').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-white truncate">{currentUser.name || 'Student'}</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                (studentYearInfo?.cohort || currentUser.cohort) === 'first_year' 
                                  ? 'bg-blue-950 text-blue-400 border border-blue-800/60' 
                                  : 'bg-indigo-950 text-indigo-400 border border-indigo-800/60'
                              }`}>
                                {studentYearInfo?.displayBadge || currentUser.yearOfStudy || 'Student'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Details List */}
                        <div className="space-y-1.5 text-[11px] text-zinc-300">
                          {/* Roll / Register Number */}
                          {(currentUser.rollNumber || (currentUser.identifier && /^\d+$/.test(currentUser.identifier))) && (
                            <div className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                              <span className="text-zinc-500 flex items-center gap-1">
                                <Hash className="w-3 h-3 text-indigo-400" /> Reg / Roll No:
                              </span>
                              <span className="font-mono text-indigo-300 font-semibold">{currentUser.rollNumber || currentUser.identifier}</span>
                            </div>
                          )}

                          {/* Year of Study & Batch */}
                          <div className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                            <span className="text-zinc-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-purple-400" /> Year of Study:
                            </span>
                            <span className="font-semibold text-purple-300">
                              {studentYearInfo?.yearOfStudy || currentUser.yearOfStudy} (Batch {studentYearInfo?.joinedYear || currentUser.joinedYear || '2024'})
                            </span>
                          </div>

                          {currentUser.applicationNumber && (
                            <div className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                              <span className="text-zinc-500 flex items-center gap-1">
                                <Hash className="w-3 h-3 text-blue-400" /> App No:
                              </span>
                              <span className="font-mono text-blue-300 font-semibold">{currentUser.applicationNumber}</span>
                            </div>
                          )}

                          {currentUser.collegeEmail && (
                            <div className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                              <span className="text-zinc-500 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-indigo-400" /> Clg Mail:
                              </span>
                              <span className="font-mono text-indigo-300 font-semibold truncate max-w-[140px]">{currentUser.collegeEmail}</span>
                            </div>
                          )}

                          <div className="p-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 space-y-0.5">
                            <span className="text-zinc-500 text-[10px] block">Department / Branch</span>
                            <span className="text-zinc-200 font-medium block leading-tight">{currentUser.department || 'Admissions / General'}</span>
                          </div>

                          {/* Linked Admissions Status Card */}
                          <div className="p-2 rounded-xl bg-blue-950/30 border border-blue-800/40 space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-zinc-400 font-medium flex items-center gap-1">
                                <GraduationCap className="w-3 h-3 text-blue-400" />
                                Admission Status:
                              </span>
                              <span className="font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                                {currentUser.admissionStatus || 'Provisional Confirmed'}
                              </span>
                            </div>
                            {currentUser.concessionApplied && (
                              <div className="text-[10px] text-amber-300 font-medium pt-1 border-t border-blue-900/40">
                                {currentUser.concessionApplied}
                              </div>
                            )}
                            {currentUser.annualTuitionDue && (
                              <div className="text-[10px] text-zinc-300 font-mono">
                                Due: <span className="font-bold text-white">{currentUser.annualTuitionDue}</span>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setShowUserDropdown(false);
                              setActiveTab('admissions');
                            }}
                            className="w-full py-1.5 px-2 rounded-lg text-[10px] font-semibold text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 border border-blue-900/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>Live Admissions & Fee Portal</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowUserDropdown(false);
                              onOpenChangePassword?.();
                            }}
                            className="w-full py-1.5 px-2 rounded-lg text-[10px] font-semibold text-amber-300 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-900/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Change Student Password</span>
                          </button>
                        </div>

                        {/* Logout Button */}
                        <div className="pt-2 border-t border-zinc-800/80">
                          <button
                            type="button"
                            onClick={() => {
                              setShowUserDropdown(false);
                              onLogout();
                            }}
                            className="w-full py-1.5 px-3 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out Student</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* If Not Logged In: Only ONE single Login button that shows both modules */
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenUnifiedAuthModal) onOpenUnifiedAuthModal('student');
                        else onOpenAuthModal('login');
                      }}
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                      id="navbar-login-btn"
                      title="Login - Access Student Portal or Faculty Console"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Login</span>
                    </button>
                  </div>
                )}

                {/* Admin Authentication Status - shown in student portal when administrator is logged in */}
                {currentAdmin && (
                  <div className="flex items-center pl-1 border-l border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => setActiveTab('admin')}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-950/80 border border-blue-700/60 text-blue-300 text-xs hover:border-blue-500 transition-colors shadow-sm"
                      title={`Logged in as Administrator: ${currentAdmin.name}`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold hidden md:inline">Admin: {currentAdmin.username}</span>
                      <span className="md:hidden font-bold">Admin</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </button>
                  </div>
                )}
              </>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
