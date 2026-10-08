import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  X, 
  ArrowRight,
  Mail,
  Building2
} from 'lucide-react';
import { StudentUser, AdminUser, StudentCohort } from '../types';
import { KalasalingamLogo } from './KalasalingamLogo';

interface UnifiedAuthModalProps {
  isOpen: boolean;
  initialRole?: 'student' | 'faculty';
  onClose: () => void;
  onStudentSuccess: (student: StudentUser, token?: string) => void;
  onFacultySuccess: (admin: AdminUser) => void;
}

export const UnifiedAuthModal: React.FC<UnifiedAuthModalProps> = ({
  isOpen,
  initialRole = 'student',
  onClose,
  onStudentSuccess,
  onFacultySuccess
}) => {
  const [activeRole, setActiveRole] = useState<'student' | 'faculty'>(initialRole);

  useEffect(() => {
    if (initialRole) {
      setActiveRole(initialRole);
    }
  }, [initialRole, isOpen]);

  // ==========================================
  // Student Login State
  // ==========================================
  const [studentCredential, setStudentCredential] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError(null);

    const cleanInput = studentCredential.trim();
    const cleanPass = studentPassword.trim();

    if (!cleanInput || !cleanPass) {
      setStudentError('Please enter your register number / college email and password.');
      return;
    }

    try {
      setStudentLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationNumber: cleanInput,
          credential: cleanInput,
          collegeEmail: cleanInput,
          email: cleanInput,
          password: cleanPass
        })
      });

      const data = await res.json();

      if (res.ok && data.success && data.student) {
        if (data.token) {
          localStorage.setItem('kare_student_token', data.token);
        }
        localStorage.setItem('kare_student_user', JSON.stringify(data.student));
        onStudentSuccess(data.student, data.token);
        onClose();
      } else {
        setStudentError(data.error || 'Invalid password');
      }
    } catch (err) {
      setStudentError('Connection error. Please verify network and try again.');
    } finally {
      setStudentLoading(false);
    }
  };

  // ==========================================
  // Faculty Login State
  // ==========================================
  const [facultyIdentifier, setFacultyIdentifier] = useState('');
  const [facultyPassword, setFacultyPassword] = useState('');
  const [isFacultyPassEdited, setIsFacultyPassEdited] = useState(false);
  const [showFacultyPassword, setShowFacultyPassword] = useState(false);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [facultyError, setFacultyError] = useState<string | null>(null);

  const handleFacultyIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFacultyIdentifier(val);
    if (facultyError) setFacultyError(null);

    // Default password is what the faculty entered ID is (unless manually changed)
    if (!isFacultyPassEdited) {
      setFacultyPassword(val);
    }
  };

  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFacultyError(null);

    const cleanId = facultyIdentifier.trim();
    const cleanPass = (facultyPassword || cleanId).trim();

    if (!cleanId) {
      setFacultyError('Please enter your Faculty ID or University Email.');
      return;
    }

    try {
      setFacultyLoading(true);
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identifier: cleanId, 
          password: cleanPass 
        })
      });

      const data = await res.json();

      if (res.ok && data.success && data.admin) {
        localStorage.setItem('kare_admin_user', JSON.stringify(data.admin));
        onFacultySuccess(data.admin);
        onClose();
      } else {
        setFacultyError(data.error || 'Invalid credentials. Default password is your entered Faculty ID.');
      }
    } catch (err) {
      setFacultyError('Network error during authentication. Please check connection and try again.');
    } finally {
      setFacultyLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0b0f1d] border border-blue-500/25 p-6 sm:p-8 shadow-2xl text-zinc-100 overflow-hidden my-auto">
        
        {/* Top glowing accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
          activeRole === 'faculty' 
            ? 'bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400' 
            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-400'
        }`} />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header with 3D Logo View */}
        <div className="mb-5 space-y-2.5">
          <KalasalingamLogo size="md" variant="3d-card" className="w-full max-w-md mx-auto" />
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>University Institutional Login</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Choose your university module below to access student services or faculty administration.
            </p>
          </div>
        </div>

        {/* The 2 Modules Shown Clearly Side-by-Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Module 1: Student Login */}
          <button
            type="button"
            onClick={() => {
              setActiveRole('student');
              setStudentError(null);
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              activeRole === 'student'
                ? 'bg-gradient-to-br from-blue-950/80 via-[#0e162e] to-[#0a1024] border-blue-500 shadow-lg shadow-blue-600/25 ring-1 ring-blue-500/50'
                : 'bg-[#060812] hover:bg-[#0b1022] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                activeRole === 'student'
                  ? 'bg-blue-600 text-white font-mono'
                  : 'bg-white/5 text-zinc-400'
              }`}>
                Module 1
              </span>
              <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                activeRole === 'student'
                  ? 'border-blue-400 bg-blue-500'
                  : 'border-zinc-600'
              }`}>
                {activeRole === 'student' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                activeRole === 'student'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                  : 'bg-zinc-800 text-zinc-400'
              }`}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white leading-tight">
                  Student Login
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                  Register No. / Email
                </p>
              </div>
            </div>
          </button>

          {/* Module 2: Faculty Login */}
          <button
            type="button"
            onClick={() => {
              setActiveRole('faculty');
              setFacultyError(null);
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              activeRole === 'faculty'
                ? 'bg-gradient-to-br from-indigo-950/80 via-[#14122e] to-[#0d1024] border-indigo-500 shadow-lg shadow-indigo-600/25 ring-1 ring-indigo-500/50'
                : 'bg-[#060812] hover:bg-[#0b1022] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                activeRole === 'faculty'
                  ? 'bg-indigo-600 text-white font-mono'
                  : 'bg-white/5 text-zinc-400'
              }`}>
                Module 2
              </span>
              <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                activeRole === 'faculty'
                  ? 'border-indigo-400 bg-indigo-500'
                  : 'border-zinc-600'
              }`}>
                {activeRole === 'faculty' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                activeRole === 'faculty'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                  : 'bg-zinc-800 text-zinc-400'
              }`}>
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white leading-tight">
                  Faculty Login
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                  Staff ID / Institutional Mail
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* ======================================================== */}
        {/* STUDENT LOGIN FORM                                       */}
        {/* ======================================================== */}
        {activeRole === 'student' && (
          <div className="space-y-4 animate-fadeIn">
            {studentError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{studentError}</span>
              </div>
            )}

            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>Register Number / College Email</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={studentCredential}
                    onChange={(e) => {
                      setStudentCredential(e.target.value);
                      if (studentError) setStudentError(null);
                    }}
                    placeholder="Enter Register Number or Email"
                    className="w-full bg-[#060812] border border-white/10 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono transition-colors"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>Password</span>
                </label>
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
                    className="w-full bg-[#060812] border border-white/10 focus:border-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowStudentPassword(!showStudentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={studentLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                {studentLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In as Student</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* FACULTY LOGIN FORM                                       */}
        {/* ======================================================== */}
        {activeRole === 'faculty' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Faculty & Academic Staff Portal
              </span>
              <p className="text-[11px] text-zinc-400">
                Staff ID or official mail ID (e.g. <span className="font-mono text-indigo-300">faculty@kare.ac.in</span>). Default password is your entered Faculty ID.
              </p>
            </div>

            {facultyError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{facultyError}</span>
              </div>
            )}

            <form onSubmit={handleFacultySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Faculty Staff Code / ID or Official Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={facultyIdentifier}
                    onChange={handleFacultyIdentifierChange}
                    placeholder="e.g. FACULTY_CSE_01 or faculty@kare.ac.in"
                    className="w-full bg-[#060812] border border-white/10 focus:border-indigo-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono transition-colors"
                    required
                    autoFocus
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
                    className="w-full bg-[#060812] border border-white/10 focus:border-indigo-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowFacultyPassword(!showFacultyPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showFacultyPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={facultyLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-slate-800 hover:from-indigo-500 hover:to-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                {facultyLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Faculty Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
