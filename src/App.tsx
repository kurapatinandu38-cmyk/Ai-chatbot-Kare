import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ChatInterface } from './components/ChatInterface';
import { NLPVisualizer } from './components/NLPVisualizer';
import { KnowledgeBase } from './components/KnowledgeBase';
import { AdminDashboard } from './components/AdminDashboard';
import { UniversityInfo } from './components/UniversityInfo';
import { AdmissionsView } from './components/AdmissionsView';
import { StudentAuthModal } from './components/StudentAuthModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { AnnouncementModal } from './components/AnnouncementModal';
import { AnnouncementToast } from './components/AnnouncementToast';
import { EnquiryModal } from './components/EnquiryModal';
import { PortalHome } from './components/PortalHome';
import { AcademicsView } from './components/AcademicsView';
import { FacultyDirectoryView } from './components/FacultyDirectoryView';
import { UnifiedAuthModal } from './components/UnifiedAuthModal';
import { MainLandingPage } from './components/MainLandingPage';
import { FAQItem, StudentUser, StudentCohort, AdminUser, AnnouncementItem } from './types';
import { INITIAL_FAQS } from './data/initialFaqs';
import { useLiveSync } from './utils/useLiveSync';
import { useSessionTimeout } from './utils/useSessionTimeout';
import { SessionTimeoutModal } from './components/SessionTimeoutModal';
import { UniqueCursorEffect } from './components/UniqueCursorEffect';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Bot, Lock, KeyRound, Sparkles } from 'lucide-react';

export default function App() {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('kare_admin_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading saved admin user:', err);
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'nlp' | 'faqs' | 'admin' | 'admissions' | 'academics' | 'faculty'>('home');
  const [adminSection, setAdminSection] = useState<'analytics' | 'admissions' | 'placements' | 'students' | 'announcements' | 'enquiries'>('analytics');
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  // Unified Student / Faculty Modal State
  const [isUnifiedAuthModalOpen, setIsUnifiedAuthModalOpen] = useState(false);
  const [unifiedAuthInitialRole, setUnifiedAuthInitialRole] = useState<'student' | 'faculty'>('student');

  const handleOpenUnifiedModal = (role: 'student' | 'faculty' = 'student') => {
    setUnifiedAuthInitialRole(role);
    setIsUnifiedAuthModalOpen(true);
  };

  // Active announcement modal state
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);

  // Read announcements persistence
  const [readAnnouncementIds, setReadAnnouncementIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kare_read_announcements');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Password reset token state (from query parameter or direct link action)
  const [resetPasswordToken, setResetPasswordToken] = useState<string | null>(null);

  // Active Change Password Modal state for Student and Faculty/Admin modules
  const [changePasswordTarget, setChangePasswordTarget] = useState<'student' | 'admin' | null>(null);

  // Check URL query parameters for resetToken upon landing
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('resetToken');
      if (token) {
        setResetPasswordToken(token);
        // Clean URL parameter without page reload
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('resetToken');
        window.history.replaceState({}, '', newUrl.toString());
      }
    } catch (err) {
      console.error('Error reading URL resetToken param:', err);
    }
  }, []);

  // Live SSE Synchronization Hook
  const liveSync = useLiveSync();

  // Student Authentication State
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => {
    try {
      const saved = localStorage.getItem('kare_student_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading saved student user:', err);
    }
    return null;
  });

  // Verify persistent session with backend upon application mount / refresh
  useEffect(() => {
    const verifyStoredSession = async () => {
      try {
        const token = localStorage.getItem('kare_student_token');
        if (!token) return;

        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.student) {
            setCurrentUser(data.student);
            localStorage.setItem('kare_student_user', JSON.stringify(data.student));
          }
        } else if (res.status === 401) {
          // Token expired or invalidated in database
          localStorage.removeItem('kare_student_token');
          localStorage.removeItem('kare_student_user');
          setCurrentUser(null);
        }
      } catch (err) {
        console.warn('Session verification fallback notice:', err);
      }
    };
    verifyStoredSession();
  }, []);

  // Keep logged in student user synced with live server updates without infinite loops
  const currentUserId = currentUser?.id;
  const currentIdentifier = currentUser?.identifier;
  useEffect(() => {
    if (!currentUserId && !currentIdentifier) return;
    if (!liveSync.students || liveSync.students.length === 0) return;

    const currentRoll = currentUser?.rollNumber;
    const currentApp = currentUser?.applicationNumber;
    const match = liveSync.students.find(s => 
      (currentUserId && s.id === currentUserId) || 
      (currentIdentifier && s.identifier === currentIdentifier) ||
      (currentRoll && s.rollNumber === currentRoll) ||
      (currentApp && s.applicationNumber === currentApp)
    );
    if (!match) return;

    setCurrentUser(prev => {
      if (!prev) return null;
      const isDiff = (
        match.name !== prev.name ||
        match.collegeEmail !== prev.collegeEmail ||
        match.email !== prev.email ||
        match.admissionStatus !== prev.admissionStatus ||
        match.concessionApplied !== prev.concessionApplied ||
        match.annualTuitionDue !== prev.annualTuitionDue ||
        match.intermediateMarks !== prev.intermediateMarks ||
        match.hostelAllotted !== prev.hostelAllotted ||
        match.documentsVerified !== prev.documentsVerified ||
        match.department !== prev.department
      );
      if (!isDiff) return prev;
      try {
        localStorage.setItem('kare_student_user', JSON.stringify({ ...prev, ...match }));
      } catch {}
      return { ...prev, ...match };
    });
  }, [liveSync.students, currentUserId, currentIdentifier]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'forgot_password'>('login');
  const [authModalCohort, setAuthModalCohort] = useState<StudentCohort>('first_year');

  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [portalInitialRole, setPortalInitialRole] = useState<'student' | 'admin'>('student');
  const [portalAllowedRoles, setPortalAllowedRoles] = useState<'both' | 'student-only' | 'admin-only'>('both');

  const handleAdminLoginSuccess = (admin: AdminUser) => {
    setCurrentAdmin(admin);
    setActiveTab('admin');
    try {
      localStorage.setItem('kare_admin_user', JSON.stringify(admin));
    } catch (err) {
      console.error('Error storing admin user:', err);
    }
    setIsAdminAuthModalOpen(false);
    setPortalAllowedRoles('both');
  };

  const handleAdminLogout = () => {
    setCurrentAdmin(null);
    setActiveTab('chat');
    try {
      localStorage.removeItem('kare_admin_user');
    } catch (err) {
      console.error('Error removing admin user:', err);
    }
    setPortalInitialRole('admin');
    setPortalAllowedRoles('admin-only');
  };

  const handleOpenAuthModal = (mode: 'login' | 'forgot_password' | 'register' = 'login', cohort: StudentCohort = 'first_year') => {
    setAuthModalMode(mode === 'forgot_password' ? 'forgot_password' : 'login');
    setAuthModalCohort(cohort);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (student: StudentUser, token?: string) => {
    setCurrentUser(student);
    setActiveTab(prev => (prev === 'admin' ? 'chat' : prev));
    try {
      localStorage.setItem('kare_student_user', JSON.stringify(student));
      if (token) {
        localStorage.setItem('kare_student_token', token);
      }
    } catch (err) {
      console.error('Error storing student user:', err);
    }
    setIsAuthModalOpen(false);
    setPortalAllowedRoles('both');
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('kare_student_token');
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ token })
        });
      } catch (err) {
        console.warn('Logout network notification notice:', err);
      }
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem('kare_student_user');
      localStorage.removeItem('kare_student_token');
    } catch (err) {
      console.error('Error removing student user:', err);
    }
    setPortalInitialRole('student');
    setPortalAllowedRoles('student-only');
  };

  // High-Security Session Inactivity Auto-Logout Timer (15 minutes idle, 60s warning modal)
  const sessionTimeout = useSessionTimeout({
    timeoutSeconds: 15 * 60,
    warningSeconds: 60,
    isLoggedIn: !!(currentUser || currentAdmin),
    userLabel: currentUser?.name || currentAdmin?.name || 'Authenticated User',
    onTimeout: () => {
      if (currentUser) handleLogout();
      if (currentAdmin) handleAdminLogout();
    }
  });

  const fetchFaqs = async (retries = 3, delayMs = 800) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch('/api/faqs', {
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFaqs(data);
            return;
          }
        }
      } catch (err) {
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, delayMs * attempt));
        } else {
          // Gracefully retain INITIAL_FAQS on transient offline or startup states
          console.warn('Using preloaded university FAQs during initial server startup.');
        }
      }
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleAddFaq = async (newFaqData: Omit<FAQItem, 'id' | 'viewsCount' | 'helpfulCount' | 'updatedAt'>) => {
    try {
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFaqData)
      });
      if (res.ok) {
        fetchFaqs();
      }
    } catch (err) {
      console.error('Error adding FAQ:', err);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      const res = await fetch(`/api/faqs/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setFaqs(prev => prev.filter(f => f.id !== id));
      }
    } catch (err) {
      console.error('Error deleting FAQ:', err);
    }
  };

  const handleAskFaqInChat = (questionText: string) => {
    setActiveTab('chat');
  };

  // Compute unread announcements
  const unreadAnnouncementIds = (liveSync.announcements || [])
    .map(a => a.id)
    .filter(id => !readAnnouncementIds.includes(id));

  // Open an announcement in the modal & mark as read
  const handleOpenAnnouncement = (ann: AnnouncementItem) => {
    setSelectedAnnouncement(ann);
    if (!readAnnouncementIds.includes(ann.id)) {
      const updated = [...readAnnouncementIds, ann.id];
      setReadAnnouncementIds(updated);
      try {
        localStorage.setItem('kare_read_announcements', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving read announcement ids:', err);
      }
    }
  };

  // Mark all announcements read
  const handleMarkAllAnnouncementsAsRead = () => {
    const allIds = (liveSync.announcements || []).map(a => a.id);
    setReadAnnouncementIds(allIds);
    try {
      localStorage.setItem('kare_read_announcements', JSON.stringify(allIds));
    } catch (err) {
      console.error('Error saving read announcement ids:', err);
    }
  };

  return (
    <ErrorBoundary fallbackTitle="Portal Workspace">
      <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
        {/* 1. If activeTab is 'home': Render Orchid Main Landing Page with Project Options */}
        {activeTab === 'home' ? (
          <MainLandingPage
            onNavigateTab={(tab) => {
              if (tab === 'admin' && !currentAdmin) {
                handleOpenUnifiedModal('faculty');
              } else {
                setActiveTab(tab);
              }
            }}
            onOpenStudentLogin={() => handleOpenUnifiedModal('student')}
            onOpenStudentRegister={() => handleOpenUnifiedModal('student')}
            onOpenAdminLogin={() => handleOpenUnifiedModal('faculty')}
            onOpenUnifiedLogin={handleOpenUnifiedModal}
            currentUser={currentUser}
            currentAdmin={currentAdmin}
          />
        ) : (
          /* 2. TABBED APPLICATION VIEW WITH FULL NAVIGATION */
          <>
            {/* Top Navbar */}
            <Navbar
              activeTab={currentAdmin && activeTab === 'admin' ? 'admin' : activeTab}
              setActiveTab={setActiveTab}
              faqCount={faqs.length}
              currentUser={currentUser}
              onOpenAuthModal={() => handleOpenUnifiedModal('student')}
              onLogout={handleLogout}
              currentAdmin={currentAdmin}
              onOpenAdminAuthModal={() => handleOpenUnifiedModal('faculty')}
              onOpenUnifiedAuthModal={handleOpenUnifiedModal}
              onAdminLogout={handleAdminLogout}
              isLiveConnected={liveSync.isConnected}
              lastLiveSync={liveSync.lastSync}
              announcements={liveSync.announcements}
              unreadAnnouncementIds={unreadAnnouncementIds}
              onOpenAnnouncement={handleOpenAnnouncement}
              onMarkAllAnnouncementsAsRead={handleMarkAllAnnouncementsAsRead}
              sessionRemainingSeconds={sessionTimeout.remainingSeconds}
              onExtendSession={sessionTimeout.extendSession}
              onOpenChangePassword={() => {
                if (currentAdmin && activeTab === 'admin') {
                  setChangePasswordTarget('admin');
                } else if (currentUser) {
                  setChangePasswordTarget('student');
                } else if (currentAdmin) {
                  setChangePasswordTarget('admin');
                }
              }}
            />

            {/* Main Tab Content */}
            <main className="flex-1">
              {activeTab === 'chat' && (
                !currentUser ? (
                  <div className="max-w-2xl mx-auto my-12 p-6 sm:p-8 rounded-3xl bg-[#0c0e14]/90 border border-indigo-500/30 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-fadeIn">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/20 via-indigo-600/30 to-purple-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400 shadow-inner">
                      <Bot className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Student Sign In Required</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        KARE AI Campus Assistant
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
                        To consult the AI Agent and receive official information about admissions, courses, fee concessions, and hostel allocations, please sign in with your student register number first.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenAuthModal('login')}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>Sign In with Student Register Number</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('home')}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition-all cursor-pointer"
                      >
                        <span>Back to Home</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <ChatInterface
                    onInspectNLP={() => setActiveTab('nlp')}
                    currentUser={currentUser}
                    onOpenAuthModal={handleOpenAuthModal}
                  />
                )
              )}

              {activeTab === 'nlp' && (
                <NLPVisualizer />
              )}

              {activeTab === 'faqs' && (
                <KnowledgeBase
                  faqs={faqs}
                  onAskFaq={handleAskFaqInChat}
                />
              )}

              {activeTab === 'admissions' && (
                <AdmissionsView
                  currentUser={currentUser}
                  onOpenAuthModal={handleOpenAuthModal}
                  liveStudents={liveSync.students}
                  liveAdmissionsInfo={liveSync.admissionsInfo}
                  liveFeeStructures={liveSync.feeStructures}
                  livePlacements={liveSync.placements}
                  liveAnnouncements={liveSync.announcements}
                  onOpenAnnouncement={handleOpenAnnouncement}
                  isLiveConnected={liveSync.isConnected}
                  lastLiveSync={liveSync.lastSync}
                  onRefreshAll={liveSync.refreshAll}
                  onSubmitEnquiry={liveSync.submitEnquiry}
                  onNavigateToAdmin={(sec) => {
                    setAdminSection(sec);
                    if (currentAdmin) {
                      setActiveTab('admin');
                    } else {
                      setIsAdminAuthModalOpen(true);
                    }
                  }}
                />
              )}

              {activeTab === 'academics' && (
                <AcademicsView
                  currentUser={currentUser}
                  onAskAcademicQuestion={(query) => {
                    handleAskFaqInChat(query);
                  }}
                  onNavigateToChat={() => setActiveTab('chat')}
                />
              )}

              {activeTab === 'faculty' && (
                <FacultyDirectoryView
                  onOpenFacultyLogin={() => handleOpenUnifiedModal('faculty')}
                  onOpenStudentLogin={() => handleOpenUnifiedModal('student')}
                />
              )}

              {activeTab === 'admin' && (
                currentAdmin ? (
                  <AdminDashboard
                    faqs={faqs}
                    onAddFaq={handleAddFaq}
                    onDeleteFaq={handleDeleteFaq}
                    onRefreshFaqs={fetchFaqs}
                    initialSection={adminSection}
                    currentAdmin={currentAdmin}
                    onAdminLogin={handleAdminLoginSuccess}
                    onAdminLogout={handleAdminLogout}
                    liveStudents={liveSync.students}
                    liveFeeStructures={liveSync.feeStructures}
                    liveAdmissionsInfo={liveSync.admissionsInfo}
                    livePlacements={liveSync.placements}
                    liveAnnouncements={liveSync.announcements}
                    liveEnquiries={liveSync.enquiries}
                    onOpenAnnouncement={handleOpenAnnouncement}
                    onUpdateEnquiryStatus={liveSync.updateEnquiryStatus}
                    onDeleteEnquiry={liveSync.deleteEnquiry}
                    isLiveConnected={liveSync.isConnected}
                    lastLiveSync={liveSync.lastSync}
                    onRefreshAll={liveSync.refreshAll}
                    liveDislikeFeedback={liveSync.dislikeFeedbackList}
                    onOpenChangePassword={() => setChangePasswordTarget('admin')}
                  />
                ) : (
                  <PortalHome
                    initialRole="admin"
                    allowedRoles="admin-only"
                    onBackToMain={() => setActiveTab('home')}
                    onStudentLoginSuccess={handleLoginSuccess}
                    onAdminLoginSuccess={handleAdminLoginSuccess}
                  />
                )
              )}
            </main>
          </>
        )}

        {/* Global Student Authentication Modal */}
        <StudentAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Global Unified Authentication Modal with separate Faculty & Student Login */}
        <UnifiedAuthModal
          isOpen={isUnifiedAuthModalOpen}
          initialRole={unifiedAuthInitialRole}
          onClose={() => setIsUnifiedAuthModalOpen(false)}
          onStudentSuccess={(student, token) => {
            handleLoginSuccess(student, token);
          }}
          onFacultySuccess={(admin) => {
            handleAdminLoginSuccess(admin);
          }}
        />

        {/* Global Admin Authentication Modal */}
        <AdminAuthModal
          isOpen={isAdminAuthModalOpen}
          onClose={() => setIsAdminAuthModalOpen(false)}
          onSuccess={handleAdminLoginSuccess}
        />

        {/* Global Account Change Password Modal for both Student and Faculty/Admin modules */}
        {changePasswordTarget && (
          <ChangePasswordModal
            isOpen={!!changePasswordTarget}
            onClose={() => setChangePasswordTarget(null)}
            userType={changePasswordTarget}
            user={changePasswordTarget === 'student' ? (currentUser || {}) : (currentAdmin || {})}
          />
        )}

        {/* Global Password Reset Modal */}
        <ResetPasswordModal
          isOpen={!!resetPasswordToken}
          token={resetPasswordToken}
          onClose={() => setResetPasswordToken(null)}
          onSuccess={() => {
            setResetPasswordToken(null);
          }}
          onRequestNewLink={() => {
            setResetPasswordToken(null);
          }}
        />

        {/* Global Official Announcement Modal */}
        <AnnouncementModal
          isOpen={!!selectedAnnouncement}
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          onNavigate={(tab) => {
            setActiveTab(tab as any);
          }}
          onNavigateTab={(tab) => {
            setActiveTab(tab as any);
          }}
        />

        {/* Session Security Inactivity Warning Modal */}
        <SessionTimeoutModal
          isOpen={sessionTimeout.isWarningVisible}
          remainingSeconds={sessionTimeout.remainingSeconds}
          totalWarningSeconds={60}
          currentUser={currentUser}
          currentAdmin={currentAdmin}
          onLogout={() => {
            sessionTimeout.logoutImmediately();
            if (currentUser) handleLogout();
            if (currentAdmin) handleAdminLogout();
          }}
        />

        {/* Floating Announcement Live Alert Toast */}
        <AnnouncementToast
          announcement={liveSync.latestAnnouncementAlert}
          onOpen={handleOpenAnnouncement}
          onDismiss={liveSync.clearLatestAnnouncementAlert}
        />

        {/* Global Campus Admissions Enquiry Modal */}
        <EnquiryModal
          isOpen={isEnquiryModalOpen}
          onClose={() => setIsEnquiryModalOpen(false)}
          onSubmitEnquiry={liveSync.submitEnquiry}
        />

        {/* Unique Ambient Stardust & Magnetic Cursor Animation */}
        <UniqueCursorEffect />

      </div>
    </ErrorBoundary>
  );
}

