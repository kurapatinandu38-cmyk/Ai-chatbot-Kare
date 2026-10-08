import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { AdminUser } from '../types';

interface FacultyRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (admin: AdminUser, prefillId: string) => void;
}

const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Artificial Intelligence & Machine Learning (AIML)',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Biotechnology & Biomedical',
  'Civil Engineering',
  'School of Management (MBA/BBA)',
  'School of Architecture (B.Arch)',
  'Department of Mathematics',
  'Department of Physics',
  'Department of Chemistry'
];

const ROLES = [
  'Faculty Member / Department Coordinator',
  'Assistant Professor',
  'Associate Professor',
  'Professor',
  'Associate Professor & Student Advisor',
  'Head of Department (HOD)',
  'Director of Admissions',
  'Dean of Academic Affairs'
];

export const FacultyRegisterModal: React.FC<FacultyRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [role, setRole] = useState(ROLES[0]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ message: string; admin: AdminUser; username: string } | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setUsername('');
    setEmail('');
    setDepartment(DEPARTMENTS[0]);
    setRole(ROLES[0]);
    setPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
    setSuccessData(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please enter your full faculty name (at least 2 characters).');
      return;
    }

    if (!cleanUsername || cleanUsername.length < 3) {
      setErrorMessage('Please enter a Faculty ID or Username (e.g., FAC202509 or ramesh.cse).');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter your faculty or institutional email address (e.g., faculty@kare.ac.in).');
      return;
    }

    if (!cleanPass || cleanPass.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    if (cleanPass !== cleanConfirm) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          username: cleanUsername,
          email: cleanEmail,
          department,
          role,
          password: cleanPass
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.admin) {
        setSuccessData({
          message: data.message || 'Faculty registered successfully!',
          admin: data.admin,
          username: cleanUsername
        });
      } else {
        setErrorMessage(data.error || 'Registration failed. Please check inputs and try again.');
      }
    } catch (err) {
      setErrorMessage('Network error while registering faculty account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-lg my-8 rounded-2xl bg-[#0d1424] border border-indigo-500/30 p-6 shadow-2xl text-slate-100 overflow-hidden"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">First Time Faculty Registration</h3>
            <p className="text-xs text-slate-400">Institutional registration for faculty and department staff</p>
          </div>
        </div>

        {successData ? (
          <div className="space-y-4 py-2">
            <div className="p-5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-center space-y-2.5">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Faculty Registration Complete!</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Welcome to Kalasalingam University, <span className="font-semibold text-white">{successData.admin.name}</span>. Your institutional faculty record has been created.
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-left space-y-1.5 mt-2">
                <div className="text-[11px] text-slate-400">Your Faculty Sign-In ID:</div>
                <div className="font-mono text-sm font-bold text-indigo-400 select-all">
                  {successData.username}
                </div>
                <div className="text-[11px] text-slate-400">Role: {successData.admin.role}</div>
                <div className="text-[11px] text-slate-400">Department: {successData.admin.department}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onRegisterSuccess(successData.admin, successData.username);
                handleClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-slate-800 hover:from-indigo-500 hover:to-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-500/30 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Proceed to Login with Faculty Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Faculty Full Name (with Title) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. S. Ramakrishnan or Prof. A. Priya"
                  className="w-full bg-[#141c30] border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            {/* Faculty ID & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Faculty ID / Username <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. FAC202509 or ramesh.cse"
                    className="w-full bg-[#141c30] border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Faculty Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ramesh@kare.ac.in"
                    className="w-full bg-[#141c30] border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Department and Role selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Department
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#141c30] border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept} className="bg-slate-900 text-white">
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Designation / Role
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#141c30] border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r} className="bg-slate-900 text-white">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Create Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 4 characters"
                    className="w-full bg-[#141c30] border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-10 pr-9 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full bg-[#141c30] border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-slate-800 hover:from-indigo-500 hover:to-slate-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40 border border-indigo-500/30 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete Faculty Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
