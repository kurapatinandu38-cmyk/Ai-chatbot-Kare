import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  KeyRound, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  X,
  Bot,
  Building2,
  BookOpen,
  Bus,
  CreditCard,
  FileText,
  HelpCircle,
  Phone,
  ExternalLink,
  Award,
  Hash,
  ChevronRight
} from 'lucide-react';
import { StudentUser, AdminUser } from '../types';
import { KalasalingamLogo } from './KalasalingamLogo';

const computeDefaultStudentPassword = (cred: string): string => {
  if (!cred) return '';
  const digits = cred.replace(/\D/g, '');
  if (digits.length >= 5) {
    return `Kare@${digits.slice(-5)}`;
  } else if (digits.length >= 4) {
    return `Kare@${digits.slice(-4)}`;
  } else if (digits.length > 0) {
    return `Kare@${digits.padStart(4, '0')}`;
  }
  return '';
};

interface PortalHomeProps {
  onStudentLoginSuccess: (student: StudentUser, token?: string) => void;
  onAdminLoginSuccess: (admin: AdminUser) => void;
  onOpenResetPassword?: (token: string) => void;
  initialRole?: 'student' | 'admin';
  allowedRoles?: 'both' | 'student-only' | 'admin-only';
  onBackToMain?: () => void;
}

export const PortalHome: React.FC<PortalHomeProps> = ({
  onStudentLoginSuccess,
  onAdminLoginSuccess,
  onOpenResetPassword,
  initialRole = 'student',
  allowedRoles = 'both',
  onBackToMain
}) => {
  // Feature Switch: 'student' | 'admin'
  const determineEffectiveRole = (): 'student' | 'admin' => {
    if (allowedRoles === 'admin-only') return 'admin';
    if (allowedRoles === 'student-only') return 'student';
    return initialRole === 'admin' ? 'admin' : 'student';
  };

  const [role, setRole] = useState<'student' | 'admin'>(determineEffectiveRole);

  useEffect(() => {
    if (allowedRoles === 'admin-only') setRole('admin');
    else if (allowedRoles === 'student-only') setRole('student');
    else if (initialRole) setRole(initialRole);
  }, [initialRole, allowedRoles]);

  // Student Login Credentials
  const [cohort, setCohort] = useState<'first_year' | 'senior_year'>('senior_year');
  const [studentRegNumber, setStudentRegNumber] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [isStudentSubmitting, setIsStudentSubmitting] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);

  const cleanStudentEmailInput = studentRegNumber.trim().toLowerCase();
  const isKluDomain = cleanStudentEmailInput.endsWith('@klu.ac.in');

  // Faculty Login Credentials
  const [facultyId, setFacultyId] = useState('');
  const [facultyPassword, setFacultyPassword] = useState('');
  const [isFacultyPassEdited, setIsFacultyPassEdited] = useState(false);
  const [showFacultyPassword, setShowFacultyPassword] = useState(false);
  const [isFacultySubmitting, setIsFacultySubmitting] = useState(false);
  const [facultyError, setFacultyError] = useState<string | null>(null);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotRole, setForgotRole] = useState<'student' | 'faculty'>('student');
  const [forgotMethod, setForgotMethod] = useState<'otp' | 'email'>('email');

  // Email Reset State
  const [emailInput, setEmailInput] = useState('');
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [dispatchedAddress, setDispatchedAddress] = useState('');
  const [generatedResetToken, setGeneratedResetToken] = useState<string | null>(null);
  const [generatedResetUrl, setGeneratedResetUrl] = useState<string | null>(null);

  // OTP Reset State
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [otpCollegeEmail, setOtpCollegeEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpNewPassword, setOtpNewPassword] = useState('');
  const [otpConfirmPassword, setOtpConfirmPassword] = useState('');
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState<string | null>(null);
  const [showOtpNewPass, setShowOtpNewPass] = useState(false);

  // Handle Student Login
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError(null);

    const cleanEmail = studentRegNumber.trim();
    const cleanPass = studentPassword.trim();

    if (!cleanEmail || !cleanPass) {
      setStudentError('Please enter your register number or college email and password.');
      return;
    }

    setIsStudentSubmitting(true);
    try {
      const res = await fetch('/api/auth/student-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          collegeEmail: cleanEmail,
          registrationNumber: cleanEmail, 
          credential: cleanEmail,
          email: cleanEmail,
          identifier: cleanEmail,
          password: cleanPass 
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.student) {
        onStudentLoginSuccess(data.student, data.token);
      } else {
        setStudentError(data?.error || 'Invalid password');
      }
    } catch (err) {
      setStudentError('Unable to connect. Please try again.');
    } finally {
      setIsStudentSubmitting(false);
    }
  };

  // Handle Faculty / Admin Login
  const handleFacultyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFacultyError(null);

    const cleanId = facultyId.trim();
    const cleanPass = facultyPassword.trim();

    if (!cleanId || !cleanPass) {
      setFacultyError('Invalid credentials. Please enter the correct credentials.');
      return;
    }

    setIsFacultySubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password: cleanPass })
      });

      const data = await res.json();
      if (res.ok && data.success && data.admin) {
        onAdminLoginSuccess(data.admin);
      } else {
        setFacultyError('Invalid credentials. Please enter the correct credentials.');
      }
    } catch (err) {
      setFacultyError('Invalid credentials. Please enter the correct credentials.');
    } finally {
      setIsFacultySubmitting(false);
    }
  };

  // Handle Email Reset Request (Dispatches 10-minute reset link to entered address)
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccessMsg(null);
    setGeneratedResetToken(null);
    setGeneratedResetUrl(null);

    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setEmailError(forgotRole === 'faculty' 
        ? 'Please enter your faculty email or ID.' 
        : 'Please enter your college email or student email address.');
      return;
    }

    setIsEmailSending(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          emailOrIdentifier: cleanEmail,
          enteredEmail: cleanEmail,
          userType: forgotRole === 'faculty' ? 'admin' : 'student'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEmailSuccessMsg(data.message || `Password reset link dispatched to ${cleanEmail}. Link is valid for 10 minutes.`);
        setDispatchedAddress(data.sentTo || cleanEmail);
        if (data.token) {
          setGeneratedResetToken(data.token);
        }
        if (data.resetUrl) {
          setGeneratedResetUrl(data.resetUrl);
        }
      } else {
        setEmailError(data.error || 'Unable to dispatch reset link. Please check your entered address.');
      }
    } catch (err) {
      setEmailError('Network error. Please try again.');
    } finally {
      setIsEmailSending(false);
    }
  };

  // Handle Request OTP via Official College Email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setOtpSuccessMsg(null);

    const cleanMail = otpCollegeEmail.trim().toLowerCase();

    // STRICT USER REQUIREMENT:
    // Format check: official student mail will include @klu.ac.in (not mentioned in UI)
    if (forgotRole === 'student') {
      if (!cleanMail || !cleanMail.includes('@klu.ac.in')) {
        setOtpError('Invalid credentials. Please enter the correct credentials.');
        return;
      }
    } else {
      if (!cleanMail || !cleanMail.includes('@')) {
        setOtpError('Invalid credentials. Please enter the correct credentials.');
        return;
      }
    }

    setIsOtpLoading(true);
    try {
      const res = await fetch('/api/auth/student/otp-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          collegeEmail: cleanMail,
          userType: forgotRole === 'faculty' ? 'admin' : 'student'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOtpStep('verify');
        setOtpSuccessMsg(data.message || 'OTP has been dispatched to your official email.');
      } else {
        setOtpError('Invalid credentials. Please enter the correct credentials.');
      }
    } catch (err) {
      setOtpError('Invalid credentials. Please enter the correct credentials.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  // Handle Verify OTP and Reset Password
  const handleVerifyOtpAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setOtpSuccessMsg(null);

    const cleanMail = otpCollegeEmail.trim().toLowerCase();
    const cleanOtp = otpCode.trim();
    const cleanPass = otpNewPassword.trim();
    const cleanConfirm = otpConfirmPassword.trim();

    if (!cleanMail.includes('@klu.ac.in')) {
      setOtpError('Invalid credentials. Please enter the correct credentials.');
      return;
    }

    if (!cleanOtp) {
      setOtpError('Invalid credentials. Please enter the correct credentials.');
      return;
    }

    if (cleanPass.length < 4) {
      setOtpError('Password must be at least 4 characters long.');
      return;
    }

    if (cleanPass !== cleanConfirm) {
      setOtpError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsOtpLoading(true);
    try {
      const res = await fetch('/api/auth/student/otp-verify-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeEmail: cleanMail,
          otp: cleanOtp,
          newPassword: cleanPass
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSuccessMsg(data.message || 'Password updated successfully! You can now log in.');
        // Pre-fill password in student login form for convenience
        setStudentPassword(cleanPass);
      } else {
        setOtpError('Invalid credentials. Please enter the correct credentials.');
      }
    } catch (err) {
      setOtpError('Invalid credentials. Please enter the correct credentials.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const closeForgotModal = () => {
    setIsForgotModalOpen(false);
    setOtpStep('request');
    setOtpError(null);
    setOtpSuccessMsg(null);
    setEmailError(null);
    setEmailSuccessMsg(null);
    setDispatchedAddress('');
    setGeneratedResetToken(null);
    setGeneratedResetUrl(null);
    setOtpCode('');
    setOtpNewPassword('');
    setOtpConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      
      {/* High-End Ambient Background Graphics with Floating University Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glowing Kalasalingam Crimson & Royal Blue ambient orbs */}
        <motion.div 
          animate={{ scale: [1, 1.08, 1], opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-b from-red-900/25 via-indigo-900/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ x: [-20, 20, -20], y: [-15, 15, -15] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -left-48 w-[420px] h-[420px] bg-blue-700/15 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ x: [20, -20, 20], y: [15, -15, 15] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 -right-48 w-[450px] h-[450px] bg-rose-700/15 rounded-full blur-3xl" 
        />
        
        {/* Subtle geometric digital grid */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(#93c5fd 1px, transparent 1px)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      {/* Main Centered Container (Card directly in the middle) */}
      <div className="relative z-10 max-w-md mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center items-center">
        
        {/* Focused & Clean Kalasalingam University Login Card in the Middle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative w-full rounded-3xl bg-[#0c101d]/95 backdrop-blur-xl border border-red-500/30 hover:border-red-500/50 p-6 sm:p-8 shadow-2xl shadow-red-950/50 flex flex-col justify-between"
        >
          {/* Top Glowing Edge */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-amber-500/70 via-red-500/70 to-transparent" />

          {/* Clean University Card Brand Header with Official 3D Logo */}
          <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
            <KalasalingamLogo size="md" variant="badge" />
          </div>

          {/* Role Switcher (Student vs Faculty ERP) */}
          {allowedRoles === 'both' && (
            <div className="grid grid-cols-2 p-1 bg-[#070a14] rounded-xl border border-slate-800 mb-5 relative">
              <button
                type="button"
                onClick={() => {
                  setRole('student');
                  setStudentError(null);
                  setFacultyError(null);
                }}
                className={`relative z-10 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'student' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                <span>Student Login</span>
                {role === 'student' && (
                  <motion.div
                    layoutId="portalActiveRole"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-700 via-rose-700 to-indigo-700 shadow-md shadow-red-700/40 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('admin');
                  setStudentError(null);
                  setFacultyError(null);
                }}
                className={`relative z-10 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'admin' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                <span>Faculty & Admin</span>
                {role === 'admin' && (
                  <motion.div
                    layoutId="portalActiveRole"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-700 via-blue-700 to-slate-800 shadow-md shadow-indigo-700/40 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
              </button>
            </div>
          )}

          {role === 'student' ? (
            <div>
              {/* Student Error Banner */}
              {studentError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{studentError}</span>
                </div>
              )}

              {/* Just Login and Password Boxes */}
              <form onSubmit={handleStudentLogin} className="space-y-4">
                {/* 1. Login Box (Register Number / College Email) */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                    <span>Register Number / College Email</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={studentRegNumber}
                      onChange={(e) => {
                        setStudentRegNumber(e.target.value);
                        if (studentError) setStudentError(null);
                      }}
                      placeholder="Enter Register Number or Email"
                      className="w-full bg-[#070a14] border border-slate-700/80 focus:border-red-500 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono transition-colors"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* 2. Password Box */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-zinc-300">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showStudentPassword ? 'text' : 'password'}
                      value={studentPassword}
                      onChange={(e) => {
                        setStudentPassword(e.target.value);
                        if (studentError) setStudentError(null);
                      }}
                      placeholder="Enter Password"
                      className="w-full bg-[#070a14] border border-slate-700/80 focus:border-red-500 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowStudentPassword(!showStudentPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none transition-colors"
                      tabIndex={-1}
                    >
                      {showStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isStudentSubmitting}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-700 via-rose-700 to-indigo-700 hover:from-red-600 hover:to-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-950/60 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {isStudentSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div>
              {/* Faculty Login Form */}
              {facultyError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{facultyError}</span>
                </div>
              )}

              <form onSubmit={handleFacultyLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Faculty Staff Code / ID
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={facultyId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFacultyId(val);
                        if (facultyError) setFacultyError(null);
                        if (!isFacultyPassEdited) {
                          setFacultyPassword(val);
                        }
                      }}
                      placeholder="e.g. FACULTY_CSE_01"
                      className="w-full bg-[#070a14] border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Staff Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showFacultyPassword ? 'text' : 'password'}
                      value={facultyPassword}
                      onChange={(e) => {
                        setFacultyPassword(e.target.value);
                        setIsFacultyPassEdited(true);
                        if (facultyError) setFacultyError(null);
                      }}
                      placeholder="Enter Staff Password"
                      className="w-full bg-[#070a14] border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowFacultyPassword(!showFacultyPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none transition-colors"
                      tabIndex={-1}
                    >
                      {showFacultyPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isFacultySubmitting}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-700 to-slate-800 hover:from-indigo-600 hover:to-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-950/50 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {isFacultySubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Login to Faculty Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>

        {/* Official Subtext */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>KARE Academic & AI Concierge Service Live • Kalasalingam University</span>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* FORGOT PASSWORD MODAL (OTP OR EMAIL RESET)                   */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-md rounded-2xl bg-[#0f1629] border border-blue-500/30 p-6 shadow-2xl text-slate-100 overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={closeForgotModal}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  forgotRole === 'faculty' 
                    ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' 
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                }`}>
                  {forgotRole === 'faculty' ? <ShieldCheck className="w-5 h-5" /> : <KeyRound className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {forgotRole === 'faculty' ? 'Reset Faculty & Staff Password' : 'Reset Student Password'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {forgotRole === 'faculty' 
                      ? 'Select recovery method for faculty institutional account' 
                      : 'Select your preferred verification method'}
                  </p>
                </div>
              </div>

              {/* Method Switcher Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setForgotMethod('otp');
                    setOtpError(null);
                    setOtpSuccessMsg(null);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    forgotMethod === 'otp'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Verify via OTP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForgotMethod('email');
                    setEmailError(null);
                    setEmailSuccessMsg(null);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    forgotMethod === 'email'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Email Reset Link
                </button>
              </div>

              {/* ======================================================== */}
              {/* METHOD 1: VERIFY VIA OTP (OFFICIAL COLLEGE EMAIL)        */}
              {/* ======================================================== */}
              {forgotMethod === 'otp' && (
                <div>
                  {/* Step 1: Request OTP */}
                  {otpStep === 'request' && (
                    <form onSubmit={handleRequestOtp} className="space-y-4">
                      {otpError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{otpError}</span>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Official College Email
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={otpCollegeEmail}
                            onChange={(e) => {
                              setOtpCollegeEmail(e.target.value);
                              if (otpError) setOtpError(null);
                            }}
                            placeholder="Enter your official college email"
                            className="w-full bg-[#141c30] border border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isOtpLoading}
                        className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {isOtpLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Send OTP</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Step 2: Enter OTP & Set New Password */}
                  {otpStep === 'verify' && (
                    <form onSubmit={handleVerifyOtpAndReset} className="space-y-3.5">
                      {otpSuccessMsg && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{otpSuccessMsg}</span>
                        </div>
                      )}

                      {otpError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{otpError}</span>
                        </div>
                      )}

                      {/* OTP Input */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          6-Digit OTP Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => {
                            setOtpCode(e.target.value.replace(/\D/g, ''));
                            if (otpError) setOtpError(null);
                          }}
                          placeholder="Enter 6-digit OTP"
                          className="w-full bg-[#141c30] border border-slate-700 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-center tracking-widest text-lg font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          required
                        />
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          New Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type={showOtpNewPass ? 'text' : 'password'}
                            value={otpNewPassword}
                            onChange={(e) => {
                              setOtpNewPassword(e.target.value);
                              if (otpError) setOtpError(null);
                            }}
                            placeholder="Enter new password"
                            className="w-full bg-[#141c30] border border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowOtpNewPass(!showOtpNewPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                            tabIndex={-1}
                          >
                            {showOtpNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type={showOtpNewPass ? 'text' : 'password'}
                            value={otpConfirmPassword}
                            onChange={(e) => {
                              setOtpConfirmPassword(e.target.value);
                              if (otpError) setOtpError(null);
                            }}
                            placeholder="Confirm new password"
                            className="w-full bg-[#141c30] border border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            required
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setOtpStep('request')}
                          className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isOtpLoading}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
                        >
                          {isOtpLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <span>Update Password</span>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* METHOD 2: SEND RESET LINK TO EMAIL                       */}
              {/* ======================================================== */}
              {forgotMethod === 'email' && (
                <div>
                  {emailSuccessMsg ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold text-white">Reset Password Link Dispatched!</h4>
                        <p className="text-xs text-slate-300">
                          A secure password reset link has been dispatched to:
                        </p>
                        <div className="inline-block px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
                          {dispatchedAddress || emailInput}
                        </div>
                        <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-amber-300/90 font-medium">
                          <span>⏰</span>
                          <span>Link is valid for 10 minutes</span>
                        </div>
                      </div>

                      {/* Open Reset Link Direct Option */}
                      <button
                        type="button"
                        onClick={() => {
                          if (generatedResetToken && onOpenResetPassword) {
                            onOpenResetPassword(generatedResetToken);
                            closeForgotModal();
                          } else if (generatedResetUrl) {
                            window.location.href = generatedResetUrl;
                          }
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>Open Reset Password Option Link (Valid for 10 min)</span>
                      </button>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEmailSuccessMsg(null);
                            setEmailError(null);
                            setGeneratedResetToken(null);
                            setGeneratedResetUrl(null);
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Send to another address
                        </button>
                        <button
                          type="button"
                          onClick={closeForgotModal}
                          className="py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                        >
                          Back to Login
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSendResetEmail} className="space-y-4">
                      {emailError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{emailError}</span>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          {forgotRole === 'faculty' ? 'Faculty Email or ID' : 'College Email or Student Email Address'}
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={emailInput}
                            onChange={(e) => {
                              setEmailInput(e.target.value);
                              if (emailError) setEmailError(null);
                            }}
                            placeholder={forgotRole === 'faculty' ? 'Enter faculty email (e.g. faculty@kare.ac.in)' : 'Enter your college email or address'}
                            className="w-full bg-[#141c30] border border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            required
                          />
                        </div>
                        <p className="mt-1.5 text-[11px] text-slate-400 flex items-center gap-1">
                          <span>⏰ Password reset link will be valid for 10 minutes</span>
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isEmailSending}
                        className={`w-full py-2.5 px-4 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer shadow-lg ${
                          forgotRole === 'faculty' 
                            ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20' 
                            : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                        }`}
                      >
                        {isEmailSending ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Send Reset Password Link</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
