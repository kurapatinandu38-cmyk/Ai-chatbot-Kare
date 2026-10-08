import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  GraduationCap, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Hash,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { StudentCohort, StudentUser } from '../types';

interface StudentRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (student: StudentUser, prefillRegNumber: string, prefillPassword?: string, token?: string) => void;
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
  'School of Architecture (B.Arch)'
];

export const StudentRegisterModal: React.FC<StudentRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess
}) => {
  const [cohort, setCohort] = useState<StudentCohort>('senior_year');
  const [name, setName] = useState('');
  const [appNumber, setAppNumber] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState<'1st Year' | '2nd Year' | '3rd Year' | '4th Year'>('2nd Year');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ message: string; student: StudentUser; regNumber: string; password?: string; token?: string } | null>(null);
  const [showSuccessPassword, setShowSuccessPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setAppNumber('');
    setRollNumber('');
    setCollegeEmail('');
    setDepartment(DEPARTMENTS[0]);
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
    setSuccessData(null);
    setShowSuccessPassword(false);
    setCopiedField(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanPass = password.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    if (cohort === 'first_year') {
      const cleanApp = appNumber.trim().toUpperCase();
      if (!cleanApp) {
        setErrorMessage('Please enter your Application Number (e.g., 2025KARE04128).');
        return;
      }
    } else {
      const cleanEmail = collegeEmail.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        setErrorMessage('Please enter your official college email (e.g., regnum@klu.ac.in or name@kare.ac.in).');
        return;
      }
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
      const payload: any = {
        cohort,
        name: cleanName,
        password: cleanPass,
        department,
        phone: phone.trim() || undefined
      };

      if (cohort === 'first_year') {
        payload.applicationNumber = appNumber.trim().toUpperCase();
        payload.joinedYear = 2025;
        payload.yearOfStudy = '1st Year';
      } else {
        payload.collegeEmail = collegeEmail.trim().toLowerCase();
        payload.rollNumber = rollNumber.trim() || collegeEmail.trim().split('@')[0];
        payload.yearOfStudy = yearOfStudy;
        payload.joinedYear = yearOfStudy === '2nd Year' ? 2024 : yearOfStudy === '3rd Year' ? 2023 : 2022;
      }

      let res: Response;
      try {
        res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (fetchErr: any) {
        console.warn('Initial registration request failed, retrying once...', fetchErr);
        try {
          await new Promise(r => setTimeout(r, 400));
          res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        } catch (retryErr: any) {
          setErrorMessage(retryErr?.message ? `Connection error: ${retryErr.message}` : 'Network error while connecting to university server. Please verify connection and try again.');
          setIsLoading(false);
          return;
        }
      }

      let data: any = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setErrorMessage(`Server response error (${res.status || '500'}). Please try again.`);
        setIsLoading(false);
        return;
      }

      if (res.ok && data?.success && data?.student) {
        const regNum = cohort === 'first_year' 
          ? (data.student.applicationNumber || appNumber.trim().toUpperCase())
          : (data.student.rollNumber || rollNumber.trim() || collegeEmail.trim().split('@')[0]);

        setSuccessData({
          message: data.message || 'Student registration successful!',
          student: data.student,
          regNumber: regNum,
          password: cleanPass,
          token: data.token
        });
      } else {
        setErrorMessage(data?.error || data?.message || 'Registration failed. Please check your inputs and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unexpected registration issue. Please try again.');
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
        className="relative w-full max-w-lg my-8 rounded-2xl bg-[#0d1424] border border-blue-500/30 p-6 shadow-2xl text-slate-100 overflow-hidden"
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
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">First Time Student Registration</h3>
            <p className="text-xs text-slate-400">Create your official student portal credentials</p>
          </div>
        </div>

        {successData ? (
          <div className="space-y-4 py-2">
            <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Registration Complete!</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Welcome to Kalasalingam Academy of Research and Education, <span className="font-semibold text-white">{successData.student.name}</span>. Your student profile and credentials have been verified and saved.
              </p>
              
              {/* Credentials Box */}
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-700/60 text-left space-y-3 mt-2">
                <div>
                  <div className="text-[11px] text-slate-400 mb-1">Your Student Login Identifier (Registration Number):</div>
                  <div className="flex items-center justify-between gap-2 p-2 rounded bg-slate-950/80 border border-slate-800">
                    <span className="font-mono text-sm font-bold text-cyan-400 select-all">
                      {successData.regNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(successData.regNumber, 'regNumber')}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-[10px]"
                      title="Copy registration number"
                    >
                      {copiedField === 'regNumber' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {successData.password && (
                  <div>
                    <div className="text-[11px] text-slate-400 mb-1">Your Registered Password:</div>
                    <div className="flex items-center justify-between gap-2 p-2 rounded bg-slate-950/80 border border-slate-800">
                      <span className="font-mono text-sm font-semibold text-amber-300 select-all">
                        {showSuccessPassword ? successData.password : '••••••••••••'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setShowSuccessPassword(!showSuccessPassword)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title={showSuccessPassword ? "Hide password" : "Show password"}
                        >
                          {showSuccessPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(successData.password!, 'password')}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-[10px]"
                          title="Copy password"
                        >
                          {copiedField === 'password' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Department: {successData.student.department}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Stored in local records
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onRegisterSuccess(successData.student, successData.regNumber, successData.password, successData.token);
                handleClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Proceed to Login with New Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Cohort Switcher */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Select Student Category
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setCohort('senior_year');
                    setErrorMessage(null);
                  }}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                    cohort === 'senior_year'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2nd+ Year Student
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCohort('first_year');
                    setErrorMessage(null);
                  }}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                    cohort === 'first_year'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1st Year (Freshman)
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full legal name"
                  className="w-full bg-[#141c30] border border-slate-700/80 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            {/* Conditional Identifier Field */}
            {cohort === 'first_year' ? (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Application Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={appNumber}
                    onChange={(e) => setAppNumber(e.target.value)}
                    placeholder="e.g. 2025KARE04128"
                    className="w-full bg-[#141c30] border border-slate-700/80 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Found on your provisional admission letter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Registration / Roll Number
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRollNumber(val);
                        // Auto-suggest official college email when typing roll number if empty or using default pattern
                        if (!collegeEmail || collegeEmail.endsWith('@klu.ac.in')) {
                          if (val.trim()) {
                            setCollegeEmail(`${val.trim()}@klu.ac.in`);
                          }
                        }
                      }}
                      placeholder="e.g. 99240040272"
                      className="w-full bg-[#141c30] border border-slate-700/80 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Official College Email <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={collegeEmail}
                      onChange={(e) => setCollegeEmail(e.target.value)}
                      placeholder="e.g. 99240040272@klu.ac.in"
                      className="w-full bg-[#141c30] border border-slate-700/80 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Department and Year selection */}
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
                    className="w-full bg-[#141c30] border border-slate-700/80 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept} className="bg-slate-900 text-white">
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {cohort === 'senior_year' ? (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Current Year of Study
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={yearOfStudy}
                      onChange={(e: any) => setYearOfStudy(e.target.value)}
                      className="w-full bg-[#141c30] border border-slate-700/80 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="2nd Year" className="bg-slate-900 text-white">2nd Year</option>
                      <option value="3rd Year" className="bg-slate-900 text-white">3rd Year</option>
                      <option value="4th Year" className="bg-slate-900 text-white">4th Year</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Contact Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-[#141c30] border border-slate-700/80 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              )}
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
                    className="w-full bg-[#141c30] border border-slate-700/80 focus:border-blue-500 rounded-xl pl-10 pr-9 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                    className="w-full bg-[#141c30] border border-slate-700/80 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete Student Registration</span>
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
