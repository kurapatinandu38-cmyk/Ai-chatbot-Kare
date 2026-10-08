import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Sparkles, 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  Award,
  HelpCircle,
  BadgeCheck,
  UserCheck
} from 'lucide-react';
import { EnquirySubmissionPayload, StudentUser } from '../types';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitEnquiry: (payload: EnquirySubmissionPayload) => Promise<{ success: boolean; message: string }>;
  defaultProgram?: string;
  defaultMarks?: string;
  currentUser?: StudentUser | null;
}

const PROGRAM_OPTIONS = [
  'B.Tech Computer Science and Engineering',
  'B.Tech Artificial Intelligence & Data Science',
  'B.Tech Electronics and Communication Engineering',
  'B.Tech Mechanical Engineering',
  'B.Tech Civil Engineering',
  'B.Tech Biotechnology',
  'B.Tech Biomedical Engineering',
  'B.Tech Electrical & Electronics Engineering',
  'Master of Business Administration (MBA)',
  'Master of Computer Applications (MCA)',
  'M.Tech Computer Science & Engineering',
  'Ph.D Research Programs'
];

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  onSubmitEnquiry,
  defaultProgram = '',
  defaultMarks = '',
  currentUser = null
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.collegeEmail || currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [studentIdInput, setStudentIdInput] = useState(
    currentUser?.rollNumber || currentUser?.applicationNumber || ''
  );
  const [programInterested, setProgramInterested] = useState(defaultProgram || PROGRAM_OPTIONS[0]);
  const [degreeType, setDegreeType] = useState<'UG' | 'PG' | 'Ph.D'>('UG');
  const [intermediateMarks, setIntermediateMarks] = useState(
    currentUser?.intermediateMarks ? currentUser.intermediateMarks.toString() : defaultMarks || ''
  );
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [categoryQuota, setCategoryQuota] = useState('Intermediate Merit / Concession');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.name);
      if (!email) setEmail(currentUser.collegeEmail || currentUser.email);
      if (!phone && currentUser.phone) setPhone(currentUser.phone);
      if (!studentIdInput) {
        setStudentIdInput(currentUser.rollNumber || currentUser.applicationNumber || '');
      }
      if (!intermediateMarks && currentUser.intermediateMarks) {
        setIntermediateMarks(currentUser.intermediateMarks.toString());
      }
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Calculate potential concession hint based on intermediate marks
  const parsedMarks = parseFloat(intermediateMarks);
  let concessionHint = '';
  if (!isNaN(parsedMarks) && parsedMarks > 0) {
    if (parsedMarks >= 95) concessionHint = '🎉 Eligible for 50% Tuition Fee Waiver (Highest Slab)';
    else if (parsedMarks >= 90) concessionHint = '✨ Eligible for 25% Tuition Fee Waiver';
    else if (parsedMarks >= 80) concessionHint = '👍 Eligible for 15% - 20% Tuition Fee Waiver';
    else if (parsedMarks >= 60) concessionHint = 'Eligible for Direct Admissions & Hostel Allotment';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !programInterested.trim() || !message.trim()) {
      setSubmitResult({ success: false, message: 'Please fill in all required fields marked with *' });
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    const resolvedStudentId = studentIdInput.trim() || currentUser?.rollNumber || currentUser?.applicationNumber || undefined;

    const payload: EnquirySubmissionPayload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      programInterested: programInterested.trim(),
      degreeType,
      intermediateMarks: !isNaN(parsedMarks) ? parsedMarks : undefined,
      city: city.trim() || undefined,
      state: stateName.trim() || undefined,
      categoryQuota: categoryQuota.trim() || undefined,
      message: message.trim(),
      studentIdentifier: resolvedStudentId,
      rollNumber: currentUser?.rollNumber || (resolvedStudentId && resolvedStudentId.startsWith('99') ? resolvedStudentId : undefined),
      applicationNumber: currentUser?.applicationNumber || (resolvedStudentId && resolvedStudentId.toUpperCase().includes('KARE') ? resolvedStudentId : undefined),
      department: currentUser?.department || undefined,
      yearOfStudy: currentUser?.yearOfStudy || undefined,
      cohort: currentUser?.cohort || undefined,
      isStudentAccount: Boolean(currentUser || resolvedStudentId)
    };

    const res = await onSubmitEnquiry(payload);
    setIsSubmitting(false);
    setSubmitResult(res);

    if (res.success) {
      // Reset form after 2.5 seconds
      setTimeout(() => {
        if (!currentUser) {
          setName('');
          setEmail('');
          setPhone('');
          setStudentIdInput('');
          setIntermediateMarks('');
        }
        setCity('');
        setStateName('');
        setMessage('');
        setSubmitResult(null);
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="modal-admission-enquiry"
        className="relative w-full max-w-2xl bg-[#0e0e0e] border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-zinc-100"
      >
        {/* Close Button */}
        <button
          id="btn-close-enquiry-modal"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-1">
              <Sparkles className="w-3 h-3" /> Official Admissions Desk
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Campus & Admissions Enquiry</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Submit your enquiry directly to the KARE Admissions Office. Your details will be saved and assigned to a dedicated counselor.
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {submitResult && (
          <div className={`mb-6 p-4 rounded-xl text-xs flex items-start gap-3 border ${
            submitResult.success 
              ? 'bg-emerald-950/40 text-emerald-200 border-emerald-500/30' 
              : 'bg-rose-950/40 text-rose-200 border-rose-500/30'
          }`}>
            {submitResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-sm">{submitResult.success ? 'Enquiry Saved Successfully' : 'Submission Issue'}</p>
              <p className="mt-0.5 opacity-90">{submitResult.message}</p>
            </div>
          </div>
        )}

        {/* Verified Student Banner if logged in */}
        {currentUser && (
          <div className="mb-5 p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs flex items-center justify-between gap-3 text-blue-200">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-white">Registered Student Account: </span>
                <span>{currentUser.name} ({currentUser.rollNumber || currentUser.applicationNumber || currentUser.id})</span>
                <span className="text-[11px] text-zinc-400 block sm:inline sm:ml-2">
                  • {currentUser.department} ({currentUser.yearOfStudy || 'Undergraduate'})
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
              Auto-Linked
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Name, Phone, and Student Roll/Application Number */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="input-enquiry-name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Sai Varun Reddy"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 text-xs transition-colors"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">
                Phone Number <span className="text-rose-400">*</span>
              </label>
              <input
                id="input-enquiry-phone"
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. +91 98480 22334"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 text-xs transition-colors"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5 flex items-center justify-between">
                <span>Roll / App No.</span>
                <span className="text-[10px] text-zinc-500">Student ID</span>
              </label>
              <input
                id="input-enquiry-student-id"
                type="text"
                value={studentIdInput}
                onChange={e => setStudentIdInput(e.target.value)}
                placeholder="e.g. 9921004123 or KARE-2024-ADM"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 text-xs transition-colors font-mono"
              />
            </div>
          </div>

          {/* Row 2: Email and Degree Level */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-zinc-300 font-medium mb-1.5">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                id="input-enquiry-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. student@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 text-xs transition-colors"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Degree Level</label>
              <select
                id="select-enquiry-degree"
                value={degreeType}
                onChange={e => setDegreeType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-blue-500 text-xs"
              >
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="Ph.D">Doctoral (Ph.D)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Program of Interest */}
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">
              Program / Course of Interest <span className="text-rose-400">*</span>
            </label>
            <select
              id="select-enquiry-program"
              value={programInterested}
              onChange={e => setProgramInterested(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-blue-500 text-xs"
            >
              {PROGRAM_OPTIONS.map((prog, idx) => (
                <option key={idx} value={prog}>{prog}</option>
              ))}
            </select>
          </div>

          {/* Row 4: Intermediate Marks & Concession Hint */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5 flex items-center justify-between">
                <span>12th / Inter Marks (%)</span>
                <span className="text-[10px] text-zinc-500 font-normal">Optional</span>
              </label>
              <input
                id="input-enquiry-marks"
                type="number"
                step="0.1"
                min="35"
                max="100"
                value={intermediateMarks}
                onChange={e => setIntermediateMarks(e.target.value)}
                placeholder="e.g. 94.5"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">City</label>
              <input
                id="input-enquiry-city"
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Hyderabad / Madurai"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">State</label>
              <input
                id="input-enquiry-state"
                type="text"
                value={stateName}
                onChange={e => setStateName(e.target.value)}
                placeholder="e.g. Tamil Nadu / AP"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          {concessionHint && (
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 flex items-center gap-2 text-[11px]">
              <Award className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{concessionHint}</span>
            </div>
          )}

          {/* Row 5: Admission Category Quota */}
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">Admission Category / Quota</label>
            <select
              id="select-enquiry-quota"
              value={categoryQuota}
              onChange={e => setCategoryQuota(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-blue-500 text-xs"
            >
              <option value="Intermediate Merit / Concession">Intermediate (+2) Merit / Concession</option>
              <option value="KARE Entrance Exam Merit">KARE Entrance Exam Rank Holder</option>
              <option value="JEE Main / Top Percentile">JEE Main 90+ Percentile</option>
              <option value="Other State / All India Quota">Other State / All India Quota</option>
              <option value="Lateral Entry (Diploma)">Lateral Entry (Diploma to 2nd Year)</option>
              <option value="Sports Quota / Special Category">Sports Quota / Special Category</option>
            </select>
          </div>

          {/* Row 6: Query / Message */}
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">
              Your Question or Specific Enquiry <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="textarea-enquiry-message"
              required
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="State any questions regarding fee concession, hostel fees, syllabus, document verification, or admission timelines..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 text-xs leading-relaxed resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>Helpline: +91 4563 289 042</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-submit-enquiry-form"
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving Details...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Submit Enquiry
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
