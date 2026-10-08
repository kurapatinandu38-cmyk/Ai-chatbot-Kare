import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  Search,
  Database,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  MessageSquareWarning,
  CornerDownRight,
  GraduationCap,
  UserCheck,
  Hash,
  Mail,
  ShieldAlert,
  Briefcase,
  IndianRupee,
  FileCheck,
  Calendar,
  Award,
  ShieldCheck,
  Lock,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  User,
  Bell,
  Inbox,
  X,
  Upload,
  Camera,
  Image as ImageIcon,
  HardDrive
} from 'lucide-react';
import { 
  FAQItem, 
  AnalyticsData, 
  Department, 
  StudentUser, 
  FeeStructureItem,
  AdmissionsInfo,
  PlacedStudentItem,
  IntermediateConcession,
  AdminUser,
  AnnouncementItem,
  EnquiryItem,
  EnquiryStatus
} from '../types';
import { AdminAnnouncementsManager } from './AdminAnnouncementsManager';
import { AdminEnquiriesManager } from './AdminEnquiriesManager';
import { PortalHome } from './PortalHome';
import { DriveFileExplorer } from './DriveFileExplorer';
import { KalasalingamLogo } from './KalasalingamLogo';

interface AdminDashboardProps {
  faqs: FAQItem[];
  onAddFaq: (newFaq: Omit<FAQItem, 'id' | 'viewsCount' | 'helpfulCount' | 'updatedAt'>) => void;
  onDeleteFaq: (id: string) => void;
  onRefreshFaqs: () => void;
  initialSection?: 'analytics' | 'admissions' | 'placements' | 'students' | 'announcements' | 'enquiries' | 'documents';
  currentAdmin: AdminUser | null;
  onAdminLogin: (admin: AdminUser) => void;
  onAdminLogout: () => void;
  liveStudents?: StudentUser[];
  liveFeeStructures?: FeeStructureItem[];
  liveAdmissionsInfo?: AdmissionsInfo | null;
  livePlacements?: PlacedStudentItem[];
  liveAnnouncements?: AnnouncementItem[];
  liveEnquiries?: EnquiryItem[];
  onOpenAnnouncement?: (announcement: AnnouncementItem) => void;
  onUpdateEnquiryStatus?: (id: string, status: EnquiryStatus, notes?: string, counselor?: string) => Promise<boolean>;
  onDeleteEnquiry?: (id: string) => Promise<boolean>;
  isLiveConnected?: boolean;
  lastLiveSync?: Date | null;
  onRefreshAll?: () => void;
  liveDislikeFeedback?: any[];
  onOpenChangePassword?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  faqs,
  onAddFaq,
  onDeleteFaq,
  onRefreshFaqs,
  initialSection = 'analytics',
  currentAdmin,
  onAdminLogin,
  onAdminLogout,
  liveStudents = [],
  liveFeeStructures = [],
  liveAdmissionsInfo = null,
  livePlacements = [],
  liveAnnouncements = [],
  liveEnquiries = [],
  onOpenAnnouncement,
  onUpdateEnquiryStatus,
  onDeleteEnquiry,
  isLiveConnected = true,
  lastLiveSync,
  onRefreshAll,
  liveDislikeFeedback = [],
  onOpenChangePassword
}) => {
  const [activeSection, setActiveSection] = useState<'analytics' | 'admissions' | 'placements' | 'students' | 'announcements' | 'enquiries' | 'documents'>(initialSection);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(liveAnnouncements);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedFaqModal, setSelectedFaqModal] = useState<FAQItem | null>(null);

  // AI Dislike Feedback states
  const [dislikeFeedbackList, setDislikeFeedbackList] = useState<any[]>(liveDislikeFeedback || []);
  const [userViewMode, setUserViewMode] = useState<'roster' | 'dislikes'>('roster');
  const [selectedDislikeModal, setSelectedDislikeModal] = useState<any | null>(null);
  const [dislikeSearch, setDislikeSearch] = useState('');
  const [dislikeCategoryFilter, setDislikeCategoryFilter] = useState('all');

  // Student Admission Record Edit Modal State
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentUser | null>(null);
  const [stuAdmissionStatus, setStuAdmissionStatus] = useState('Provisional Confirmed');
  const [stuIntermediateMarks, setStuIntermediateMarks] = useState('');
  const [stuHostel, setStuHostel] = useState('Bhabha Hostel - Room 304');
  const [stuDocsVerified, setStuDocsVerified] = useState(true);
  const [stuCollegeEmail, setStuCollegeEmail] = useState('');
  const [stuSubmitting, setStuSubmitting] = useState(false);

  // Admin Gate Form State (When not logged in)
  const [gateIdentifier, setGateIdentifier] = useState('admin@kare.ac.in');
  const [gatePassword, setGatePassword] = useState('');
  const [gateShowPassword, setGateShowPassword] = useState(false);
  const [gateLoading, setGateLoading] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);

  // FAQ Form states
  const [newCategory, setNewCategory] = useState<Department>('Admissions');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newKeywords, setNewKeywords] = useState('');

  // Student list states
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [studentCohortFilter, setStudentCohortFilter] = useState<'all' | 'first_year' | 'senior_year'>('all');

  // Admissions & Fee Structure states
  const [feeStructures, setFeeStructures] = useState<FeeStructureItem[]>([]);
  const [admissionsInfo, setAdmissionsInfo] = useState<AdmissionsInfo | null>(null);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [editingFeeItem, setEditingFeeItem] = useState<FeeStructureItem | null>(null);

  // Fee Form state
  const [feeProgram, setFeeProgram] = useState('');
  const [feeDegree, setFeeDegree] = useState<'UG' | 'PG' | 'Ph.D'>('UG');
  const [feeTuition, setFeeTuition] = useState('');
  const [feeHostel, setFeeHostel] = useState('');
  const [feeCaution, setFeeCaution] = useState('');
  const [feeInstallments, setFeeInstallments] = useState('');
  const [feeNotes, setFeeNotes] = useState('');
  const [concessionsList, setConcessionsList] = useState<IntermediateConcession[]>([
    { marksRange: 'Above 95% in Intermediate / +2', concession: '50% Tuition Fee Waiver' },
    { marksRange: '90% - 94.9% in Intermediate', concession: '25% Tuition Fee Waiver' }
  ]);

  // Admissions Info Edit state
  const [showEditAdmissionsModal, setShowEditAdmissionsModal] = useState(false);
  const [admYear, setAdmYear] = useState('');
  const [admOverview, setAdmOverview] = useState('');
  const [admEligibilityText, setAdmEligibilityText] = useState('');
  const [admProcedureText, setAdmProcedureText] = useState('');
  const [admEmail, setAdmEmail] = useState('');
  const [admPhone, setAdmPhone] = useState('');
  const [admLocation, setAdmLocation] = useState('');

  // Placements states
  const [placements, setPlacements] = useState<PlacedStudentItem[]>([]);
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<PlacedStudentItem | null>(null);
  const [plcCompanyName, setPlcCompanyName] = useState('');
  const [plcLpaDetails, setPlcLpaDetails] = useState('');
  const [plcStudentName, setPlcStudentName] = useState('');
  const [plcDepartment, setPlcDepartment] = useState('');
  const [plcPlacementYear, setPlcPlacementYear] = useState('2024-2025');
  const [plcPhotoUrl, setPlcPhotoUrl] = useState('');
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);

  // Success Notification toast
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/auth/students');
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
        if (data.dislikeFeedbackList && Array.isArray(data.dislikeFeedbackList)) {
          setDislikeFeedbackList(data.dislikeFeedbackList);
        }
      }
      try {
        const dRes = await fetch('/api/admin/dislikes');
        if (dRes.ok) {
          const dData = await dRes.json();
          if (dData.dislikes && Array.isArray(dData.dislikes)) {
            setDislikeFeedbackList(dData.dislikes);
          }
        }
      } catch {
        // quiet fallback
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleResolveDislike = async (feedbackId: string) => {
    try {
      const res = await fetch('/api/admin/dislikes/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackId })
      });
      if (res.ok) {
        showNotification('Dislike feedback successfully marked as reviewed & resolved.');
        setDislikeFeedbackList(prev => prev.filter(item => item.id !== feedbackId));
        if (selectedDislikeModal?.id === feedbackId) {
          setSelectedDislikeModal(null);
        }
        fetchStudents();
      }
    } catch (err) {
      console.error('Error resolving dislike feedback:', err);
    }
  };

  const handlePromoteDislikeToFaq = (dislike: any) => {
    setNewQuestion(dislike.userQuery || '');
    setNewAnswer(dislike.expectedResponse || dislike.aiResponse || '');
    setNewCategory((dislike.department as Department) || 'Admissions');
    setShowAddModal(true);
    setSelectedDislikeModal(null);
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const fetchAdmissionsAndPlacements = async () => {
    try {
      const res = await fetch('/api/admissions/all');
      if (res.ok) {
        const data = await res.json();
        setFeeStructures(data.feeStructures || []);
        setAdmissionsInfo(data.admissionsInfo || null);
        setPlacements(data.placements || []);
      }
    } catch (err) {
      console.error('Error fetching admissions and placements:', err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (err) {
      console.error('Error fetching announcements in admin:', err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchStudents();
    fetchAdmissionsAndPlacements();
    fetchAnnouncements();
  }, []);

  // Sync state when live updates arrive from server
  useEffect(() => {
    if (liveAnnouncements && liveAnnouncements.length > 0) {
      setAnnouncements(liveAnnouncements);
    }
  }, [liveAnnouncements]);

  useEffect(() => {
    if (liveStudents && liveStudents.length > 0) {
      setStudents(liveStudents);
    }
  }, [liveStudents]);

  useEffect(() => {
    if (liveDislikeFeedback && liveDislikeFeedback.length > 0) {
      setDislikeFeedbackList(liveDislikeFeedback);
    }
  }, [liveDislikeFeedback]);

  useEffect(() => {
    if (liveFeeStructures && liveFeeStructures.length > 0) {
      setFeeStructures(liveFeeStructures);
    }
  }, [liveFeeStructures]);

  useEffect(() => {
    if (liveAdmissionsInfo) {
      setAdmissionsInfo(liveAdmissionsInfo);
    }
  }, [liveAdmissionsInfo]);

  useEffect(() => {
    if (livePlacements && livePlacements.length > 0) {
      setPlacements(livePlacements);
    }
  }, [livePlacements]);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // Student Admission Handlers
  const handleOpenEditStudentModal = (student: StudentUser) => {
    setEditingStudent(student);
    setStuAdmissionStatus(student.admissionStatus || 'Provisional Confirmed');
    setStuIntermediateMarks(student.intermediateMarks !== undefined ? String(student.intermediateMarks) : '');
    setStuHostel(student.hostelAllotted || 'Bhabha Hostel - Room 304');
    setStuDocsVerified(!!student.documentsVerified);
    setStuCollegeEmail(student.collegeEmail || student.email || '');
    setShowEditStudentModal(true);
  };

  const handleSaveStudentAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      setStuSubmitting(true);
      const marksNum = stuIntermediateMarks ? parseFloat(stuIntermediateMarks) : undefined;
      const cleanEmail = stuCollegeEmail.trim().toLowerCase();
      const res = await fetch(`/api/students/${editingStudent.id}/admission`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admissionStatus: stuAdmissionStatus,
          intermediateMarks: marksNum,
          hostelAllotted: stuHostel.trim(),
          documentsVerified: stuDocsVerified,
          collegeEmail: cleanEmail,
          email: cleanEmail
        })
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? data.student : s));
        showNotification(`Admission & email record for ${editingStudent.name} updated live across all portals.`);
        setShowEditStudentModal(false);
        if (onRefreshAll) onRefreshAll();
      }
    } catch (err) {
      console.error('Error saving student admission record:', err);
    } finally {
      setStuSubmitting(false);
    }
  };

  const handleQuickStudentAction = async (
    studentId: string, 
    action: 'approve_concession' | 'confirm_seat' | 'verify_documents' | 'allot_hostel',
    studentName: string
  ) => {
    try {
      const res = await fetch('/api/students/admission-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, action })
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(prev => prev.map(s => s.id === studentId ? data.student : s));
        showNotification(`Action "${action.replace('_', ' ')}" executed for ${studentName} (Live Synced).`);
        if (onRefreshAll) onRefreshAll();
      }
    } catch (err) {
      console.error('Error executing quick student action:', err);
    }
  };

  // FAQ Handlers
  const handleCreateFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    onAddFaq({
      category: newCategory,
      question: newQuestion,
      answer: newAnswer,
      keywords: newKeywords.split(',').map(k => k.trim()).filter(Boolean)
    });

    setNewQuestion('');
    setNewAnswer('');
    setNewKeywords('');
    setShowAddModal(false);
    showNotification('New FAQ entry indexed into university knowledge base.');
  };

  // Fee Structure Handlers
  const handleOpenAddFeeModal = () => {
    setEditingFeeItem(null);
    setFeeProgram('');
    setFeeDegree('UG');
    setFeeTuition('');
    setFeeHostel('₹65,000 - ₹95,000 / year');
    setFeeCaution('₹5,000 (Refundable)');
    setFeeInstallments('2 equal semester installments');
    setFeeNotes('');
    setConcessionsList([
      { marksRange: 'Above 95% in Intermediate / +2', concession: '50% Tuition Fee Waiver' },
      { marksRange: '90% - 94.9% in Intermediate', concession: '25% Tuition Fee Waiver' }
    ]);
    setShowFeeModal(true);
  };

  const handleOpenEditFeeModal = (item: FeeStructureItem) => {
    setEditingFeeItem(item);
    setFeeProgram(item.program);
    setFeeDegree((item.degree as any) || 'UG');
    setFeeTuition(item.annualTuition);
    setFeeHostel(item.hostelFee || '');
    setFeeCaution(item.cautionDeposit || '');
    setFeeInstallments(item.installments || '');
    setFeeNotes(item.specialNotes || '');
    setConcessionsList(item.intermediateConcessions ? [...item.intermediateConcessions] : []);
    setShowFeeModal(true);
  };

  const handleSaveFeeItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeProgram.trim() || !feeTuition.trim()) return;

    const payload = {
      program: feeProgram.trim(),
      degree: feeDegree,
      annualTuition: feeTuition.trim(),
      intermediateConcessions: concessionsList.filter(c => c.marksRange.trim() && c.concession.trim()),
      hostelFee: feeHostel.trim(),
      cautionDeposit: feeCaution.trim(),
      installments: feeInstallments.trim(),
      specialNotes: feeNotes.trim()
    };

    try {
      if (editingFeeItem) {
        // Edit existing
        const res = await fetch(`/api/admissions/fee-structure/${editingFeeItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          setFeeStructures(prev => prev.map(f => f.id === editingFeeItem.id ? data.item : f));
          showNotification(`Fee structure for "${payload.program}" updated successfully.`);
        }
      } else {
        // Add new
        const res = await fetch('/api/admissions/fee-structure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          setFeeStructures(prev => [...prev, data.item]);
          showNotification(`Added new fee structure for "${payload.program}".`);
        }
      }
      setShowFeeModal(false);
    } catch (err) {
      console.error('Error saving fee item:', err);
    }
  };

  const handleDeleteFeeItem = async (id: string, program: string) => {
    if (!confirm(`Are you sure you want to delete the fee structure for ${program}?`)) return;
    try {
      const res = await fetch(`/api/admissions/fee-structure/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeeStructures(prev => prev.filter(f => f.id !== id));
        showNotification(`Removed fee structure for ${program}.`);
      }
    } catch (err) {
      console.error('Error deleting fee item:', err);
    }
  };

  // Admissions Info Handlers
  const handleOpenEditAdmissionsModal = () => {
    if (!admissionsInfo) return;
    setAdmYear(admissionsInfo.admissionYear);
    setAdmOverview(admissionsInfo.overview);
    setAdmEligibilityText(admissionsInfo.eligibilityCriteria.join('\n'));
    setAdmProcedureText(admissionsInfo.admissionProcedure.join('\n'));
    setAdmEmail(admissionsInfo.contactEmail);
    setAdmPhone(admissionsInfo.contactPhone);
    setAdmLocation(admissionsInfo.admissionsOfficeLocation);
    setShowEditAdmissionsModal(true);
  };

  const handleSaveAdmissionsInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionsInfo) return;

    const payload = {
      ...admissionsInfo,
      admissionYear: admYear.trim(),
      overview: admOverview.trim(),
      eligibilityCriteria: admEligibilityText.split('\n').map(s => s.trim()).filter(Boolean),
      admissionProcedure: admProcedureText.split('\n').map(s => s.trim()).filter(Boolean),
      contactEmail: admEmail.trim(),
      contactPhone: admPhone.trim(),
      admissionsOfficeLocation: admLocation.trim()
    };

    try {
      const res = await fetch('/api/admissions/info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setAdmissionsInfo(data.admissionsInfo);
        showNotification('Admissions guidelines and criteria updated successfully.');
        setShowEditAdmissionsModal(false);
      }
    } catch (err) {
      console.error('Error updating admissions info:', err);
    }
  };

  // Placements Handlers
  const handleOpenAddPlacement = () => {
    setEditingPlacement(null);
    setPlcCompanyName('');
    setPlcLpaDetails('');
    setPlcStudentName('');
    setPlcDepartment('CSE');
    setPlcPlacementYear('2024-2025');
    setPlcPhotoUrl('');
    setPhotoUploadError(null);
    setShowPlacementModal(true);
  };

  const handleOpenEditPlacement = (item: PlacedStudentItem) => {
    setEditingPlacement(item);
    setPlcCompanyName(item.companyName);
    setPlcLpaDetails(item.lpaDetails);
    setPlcStudentName(item.studentName || '');
    setPlcDepartment(item.department || '');
    setPlcPlacementYear(item.placementYear || '2024-2025');
    setPlcPhotoUrl(item.photoUrl || '');
    setPhotoUploadError(null);
    setShowPlacementModal(true);
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      setPhotoUploadError('Image size exceeds 2.5 MB. Please select a smaller photo.');
      return;
    }

    setPhotoUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPlcPhotoUrl(event.target.result);
      }
    };
    reader.onerror = () => {
      setPhotoUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSavePlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plcCompanyName.trim() || !plcLpaDetails.trim()) return;

    const payload = {
      companyName: plcCompanyName.trim(),
      lpaDetails: plcLpaDetails.trim(),
      studentName: plcStudentName.trim(),
      department: plcDepartment.trim(),
      placementYear: plcPlacementYear.trim(),
      photoUrl: plcPhotoUrl.trim()
    };

    try {
      if (editingPlacement) {
        const res = await fetch(`/api/placements/${editingPlacement.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          setPlacements(prev => prev.map(p => p.id === editingPlacement.id ? data.placement : p));
          showNotification(`Placement for "${payload.companyName}" updated.`);
        }
      } else {
        const res = await fetch('/api/placements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          setPlacements(prev => [data.placement, ...prev]);
          showNotification(`Added new placement record for "${payload.companyName} (${payload.lpaDetails})".`);
        }
      }
      setShowPlacementModal(false);
    } catch (err) {
      console.error('Error saving placement:', err);
    }
  };

  const handleDeletePlacement = async (id: string, company: string) => {
    if (!confirm(`Are you sure you want to remove placement record for ${company}?`)) return;
    try {
      const res = await fetch(`/api/placements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPlacements(prev => prev.filter(p => p.id !== id));
        showNotification(`Placement record for ${company} removed.`);
      }
    } catch (err) {
      console.error('Error deleting placement:', err);
    }
  };

  const faqMatchPct = analytics && analytics.totalQueries > 0
    ? ((analytics.faqMatchCount / analytics.totalQueries) * 100).toFixed(1)
    : '74.2';

  const helpfulPct = analytics && (analytics.helpfulCount + analytics.unhelpfulCount) > 0
    ? ((analytics.helpfulCount / (analytics.helpfulCount + analytics.unhelpfulCount)) * 100).toFixed(0)
    : '93';

  const handleGateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateError(null);
    if (!gateIdentifier.trim()) {
      setGateError('Please enter your Admin Username or Official Email.');
      return;
    }
    if (!gatePassword.trim()) {
      setGateError('Please enter your admin password.');
      return;
    }
    try {
      setGateLoading(true);
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: gateIdentifier.trim(), password: gatePassword.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success && data.admin) {
        onAdminLogin(data.admin);
        showNotification(`Welcome, ${data.admin.name}.`);
      } else {
        setGateError(data.error || 'Incorrect credentials entered. Please enter the correct credentials.');
      }
    } catch (err) {
      setGateError('Network error connecting to university server. Please retry.');
    } finally {
      setGateLoading(false);
    }
  };

  // If Admin is NOT logged in: Show Admin Authentication using the exact same portal login page configured strictly for Admin
  if (!currentAdmin) {
    return (
      <div className="w-full">
        {statusMessage && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs shadow-2xl animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
        <PortalHome
          allowedRoles="admin-only"
          onAdminLoginSuccess={onAdminLogin}
          onStudentLoginSuccess={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 text-zinc-100">
      
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Top Dashboard Header with Integrated Faculty Member Details & Mail ID */}
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 flex-wrap">
            <KalasalingamLogo size="sm" variant="badge" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-600/15 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Faculty Member: {currentAdmin.name}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-700/60 uppercase tracking-wider">
              {currentAdmin.role}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Console Session</span>
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            University Control & Modification Center
          </h1>

          {/* Department & Faculty Email Address */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-400 font-mono">
            <span className="text-zinc-200 font-semibold">{currentAdmin.department}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-blue-400 font-semibold">{currentAdmin.email}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">Admissions, Fees, Placements & Curricula Management</span>
          </div>
        </div>

        {/* Action Controls: Change Password, Refresh Data, Sign Out */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {onOpenChangePassword && (
            <button
              type="button"
              onClick={onOpenChangePassword}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/60 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Change Faculty / Admin Password"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
          )}

          <button
            onClick={() => {
              fetchAnalytics();
              fetchStudents();
              fetchAdmissionsAndPlacements();
              showNotification('All admin records refreshed from server.');
            }}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title="Refresh metrics"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <button
            onClick={onAdminLogout}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Sign out of Administrator Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADMINISTRATIVE COMMAND DECK: EXECUTIVE QUICK HEADINGS & MODULE SWITCHER */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Administrative Command Modules & Quick Headings
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
            6 Core Administration Desks Active
          </span>
        </div>

        {/* Responsive Grid of Unique Quick Heading Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {[
            {
              id: 'admissions',
              label: 'Admissions & Fees',
              badge: feeStructures.length,
              icon: IndianRupee,
              accentText: 'text-amber-400',
              accentBg: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
              activeGlow: 'border-amber-500/80 bg-gradient-to-b from-amber-950/20 to-zinc-950 shadow-amber-500/10',
              tagline: 'Fees & Slabs'
            },
            {
              id: 'placements',
              label: 'Placements Office',
              badge: placements.length,
              icon: Briefcase,
              accentText: 'text-emerald-400',
              accentBg: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40',
              activeGlow: 'border-emerald-500/80 bg-gradient-to-b from-emerald-950/20 to-zinc-950 shadow-emerald-500/10',
              tagline: 'Tier-1 Recruiters'
            },
            {
              id: 'analytics',
              label: 'Analytics & FAQs',
              badge: faqs.length,
              icon: BarChart3,
              accentText: 'text-blue-400',
              accentBg: 'bg-blue-950/40 text-blue-300 border-blue-800/40',
              activeGlow: 'border-blue-500/80 bg-gradient-to-b from-blue-950/20 to-zinc-950 shadow-blue-500/10',
              tagline: 'AI Knowledge Index'
            },
            {
              id: 'students',
              label: 'All Users & Feedback',
              badge: students.length,
              subBadge: dislikeFeedbackList.length > 0 ? `${dislikeFeedbackList.length} Dislikes` : undefined,
              icon: GraduationCap,
              accentText: 'text-indigo-400',
              accentBg: 'bg-indigo-950/40 text-indigo-300 border-indigo-800/40',
              activeGlow: 'border-indigo-500/80 bg-gradient-to-b from-indigo-950/20 to-zinc-950 shadow-indigo-500/10',
              tagline: 'Roster & AI Dislikes'
            },
            {
              id: 'announcements',
              label: 'Circulars & Directives',
              badge: announcements.length,
              icon: Bell,
              accentText: 'text-cyan-400',
              accentBg: 'bg-cyan-950/40 text-cyan-300 border-cyan-800/40',
              activeGlow: 'border-cyan-500/80 bg-gradient-to-b from-cyan-950/20 to-zinc-950 shadow-cyan-500/10',
              tagline: 'Campus Broadcasts'
            },
            {
              id: 'enquiries',
              label: 'Leads & Enquiries',
              badge: liveEnquiries.length,
              alertBadge: liveEnquiries.filter(e => e.status === 'Pending').length > 0 ? `${liveEnquiries.filter(e => e.status === 'Pending').length} new` : undefined,
              icon: Inbox,
              accentText: 'text-emerald-400',
              accentBg: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40',
              activeGlow: 'border-emerald-500/80 bg-gradient-to-b from-emerald-950/20 to-zinc-950 shadow-emerald-500/10',
              tagline: 'Direct Applicant Inflow'
            },
            {
              id: 'documents',
              label: 'Drive Documents',
              badge: 'Drive',
              icon: HardDrive,
              accentText: 'text-blue-400',
              accentBg: 'bg-blue-950/40 text-blue-300 border-blue-800/40',
              activeGlow: 'border-blue-500/80 bg-gradient-to-b from-blue-950/20 to-zinc-950 shadow-blue-500/10',
              tagline: 'Student Certificates'
            }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`btn-admin-tab-${item.id}`}
                onClick={() => setActiveSection(item.id as any)}
                className={`relative text-left p-3 rounded-2xl border transition-all duration-200 group flex flex-col justify-between min-h-[96px] ${
                  isActive
                    ? `${item.activeGlow} shadow-lg ring-1 ring-white/10`
                    : 'bg-[#0e0e0e] hover:bg-[#151515] border-[#222222] hover:border-[#333333]'
                }`}
              >
                {/* Top row: Icon & Badges */}
                <div className="flex items-center justify-between gap-1 w-full">
                  <div className={`p-2 rounded-xl border transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? `${item.accentBg} shadow-sm` : 'bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:text-white'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                      isActive ? 'bg-white/15 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}>
                      {item.badge}
                    </span>

                    {item.subBadge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
                        {item.subBadge}
                      </span>
                    )}

                    {item.alertBadge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                        {item.alertBadge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom row: Heading Title & Tagline */}
                <div className="mt-2.5">
                  <h4 className={`text-xs font-bold tracking-tight transition-colors line-clamp-1 ${
                    isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'
                  }`}>
                    {item.label}
                  </h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5 truncate group-hover:text-zinc-400">
                    {item.tagline}
                  </p>
                </div>

                {/* Active Underline Accent Pill */}
                {isActive && (
                  <span className="absolute bottom-1.5 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                )}
              </button>
            );
          })}
        </div>

        {/* HUD Sub-Header for Active Domain */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#111111] via-[#141414] to-[#111111] border border-[#242424] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="space-y-0.5">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                {activeSection === 'admissions' && 'Admissions, Tuition & Slabs Console'}
                {activeSection === 'placements' && 'Office of Career Opportunities & Placement Records'}
                {activeSection === 'analytics' && 'Campus AI Telemetry & Knowledge FAQs Directory'}
                {activeSection === 'students' && 'Registered Student Accounts & AI Feedback Reason Audit'}
                {activeSection === 'announcements' && 'Official Campus Broadcasts & Notification Directives'}
                {activeSection === 'enquiries' && 'Prospective Student Inflow & Online Admission Leads'}
                {activeSection === 'documents' && 'Google Drive Student Document Repository & Certificates'}
              </span>
              <p className="text-[11px] text-zinc-400">
                {activeSection === 'admissions' && 'Live changes reflect instantly across the student portal, fee calculator, and admissions chat.'}
                {activeSection === 'placements' && 'Manage marquee recruiters, salary packages, and placement rate statistics.'}
                {activeSection === 'analytics' && 'Audit student search queries, verified knowledge entries, and AI response accuracy.'}
                {activeSection === 'students' && 'Review registered 1st and senior year students, tuition waivers, and inspect reasons for disliked AI answers.'}
                {activeSection === 'announcements' && 'Publish critical circulars, emergency announcements, and semester dates.'}
                {activeSection === 'enquiries' && 'Review submitted admission inquiries from prospective candidates.'}
                {activeSection === 'documents' && 'Authenticate and explore verified student certificates, marksheets, hall tickets, and fee receipts on Google Drive.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-mono">
              Status: Live Broadcast Ready
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: ADMISSIONS & FEE STRUCTURE MANAGEMENT */}
      {/* ========================================================================= */}
      {activeSection === 'admissions' && (
        <div className="space-y-6">
          
          {/* Top Bar for Fee Structures */}
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-amber-400" /> University Fee Structure & Concession Slabs
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Add, edit, or modify annual tuition fees, Intermediate (+2) marks concession slabs, hostel charges, and installment terms.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-admin-add-fee"
                  onClick={handleOpenAddFeeModal}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Fee Structure</span>
                </button>

                <button
                  id="btn-admin-edit-admissions-guidelines"
                  onClick={handleOpenEditAdmissionsModal}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Edit className="w-4 h-4 text-blue-400" />
                  <span>Edit Admission Guidelines</span>
                </button>
              </div>
            </div>

            {/* Fee Items Table / Cards */}
            <div className="space-y-3 pt-2">
              {feeStructures.map((fee) => (
                <div
                  key={fee.id}
                  className="p-4 rounded-xl bg-[#121212] border border-[#222222] hover:border-zinc-700 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                        {fee.degree}
                      </span>
                      <h4 className="text-sm font-bold text-white">{fee.program}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-amber-400 font-mono">
                        {fee.annualTuition}
                      </span>
                      
                      {/* Action Buttons: Edit & Delete */}
                      <button
                        onClick={() => handleOpenEditFeeModal(fee)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        title="Edit fee structure"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFeeItem(fee.id, fee.program)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 border border-rose-800/50 text-rose-300 transition-colors"
                        title="Delete fee structure"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Concessions preview */}
                  {fee.intermediateConcessions && fee.intermediateConcessions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1 text-xs">
                      {fee.intermediateConcessions.map((c, idx) => (
                        <span key={idx} className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                          <strong>{c.marksRange}:</strong> <span className="text-emerald-400 font-semibold">{c.concession}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Auxiliary notes */}
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 font-mono pt-1">
                    {fee.hostelFee && <span>Hostel: {fee.hostelFee}</span>}
                    {fee.cautionDeposit && <span>Deposit: {fee.cautionDeposit}</span>}
                    {fee.installments && <span>Terms: {fee.installments}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Admissions Guidelines Preview Box */}
          {admissionsInfo && (
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#222222] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-blue-400" /> Active Admissions Criteria & Procedure
                  </h3>
                  <span className="text-xs text-zinc-400">{admissionsInfo.admissionYear}</span>
                </div>
                <button
                  onClick={handleOpenEditAdmissionsModal}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Guidelines</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-300">
                <div className="space-y-2 p-3 rounded-xl bg-[#121212] border border-[#222222]">
                  <span className="font-bold text-blue-400 uppercase text-[10px] block">Eligibility Requirements:</span>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300">
                    {admissionsInfo.eligibilityCriteria.map((e, idx) => (
                      <li key={idx}>{e}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 p-3 rounded-xl bg-[#121212] border border-[#222222]">
                  <span className="font-bold text-blue-400 uppercase text-[10px] block">Admission Procedures:</span>
                  <ul className="list-decimal list-inside space-y-1 text-zinc-300">
                    {admissionsInfo.admissionProcedure.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: OFFICE OF PLACEMENTS MANAGEMENT */}
      {/* USER MANDATE: "office of placements coloumn showing the recent year placed students and their package and their placed company dont shw the headings just show company name and lpa details and add the edit or add button to modify all these things in the admin module or admin login" */}
      {/* ========================================================================= */}
      {activeSection === 'placements' && (
        <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" /> Office of Placements Records Management
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Add, edit, or modify placed companies, CTC/LPA packages, and placed student details.
              </p>
            </div>

            <button
              id="btn-admin-add-placement"
              onClick={handleOpenAddPlacement}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Placed Record</span>
            </button>
          </div>

          {/* Placements List with Edit/Delete Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {placements.map((p) => (
              <div
                key={p.id}
                onClick={() => handleOpenEditPlacement(p)}
                className="p-4 rounded-xl bg-[#121212] border border-[#222222] hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
                title="Click to open & edit placement record"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-sm text-zinc-200 group-hover:border-emerald-500/40 transition-colors shrink-0">
                      {p.photoUrl ? (
                        <img 
                          src={p.photoUrl} 
                          alt={p.studentName || p.companyName} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-zinc-800/80 text-zinc-300 font-bold text-xs">
                          {p.studentName ? p.studentName.charAt(0) : p.companyName.charAt(0)}
                        </div>
                      )}
                      {p.photoUrl && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-900" title="Photo attached" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{p.companyName}</h4>
                      {p.studentName ? (
                        <p className="text-[11px] text-zinc-400 font-medium">
                          {p.studentName} {p.department ? <span className="text-zinc-500 font-normal">({p.department})</span> : ''}
                        </p>
                      ) : (
                        <p className="text-[10px] text-zinc-500 italic">No student name specified</p>
                      )}
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 shrink-0">
                    {p.lpaDetails}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
                  <span className="text-[11px] text-zinc-500 font-mono">{p.placementYear || 'Recent Batch'}</span>
                  
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenEditPlacement(p)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <Edit className="w-3 h-3 text-blue-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeletePlacement(p.id, p.companyName)}
                      className="p-1 rounded-lg bg-rose-950/30 hover:bg-rose-900 border border-rose-800/40 text-rose-300 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: ANALYTICS & FAQ KNOWLEDGE BASE */}
      {/* ========================================================================= */}
      {activeSection === 'analytics' && (
        <div className="space-y-6">
          {/* Metrics 4-Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0a0a0a] border border-[#222222] rounded-xl p-4 space-y-1 shadow-lg">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Total Queries</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white font-mono">{analytics?.totalQueries || 0}</span>
                <span className="text-[10px] text-emerald-400 flex items-center font-semibold">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +14%
                </span>
              </div>
              <p className="text-[10px] text-zinc-500">Student sessions logged</p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#222222] rounded-xl p-4 space-y-1 shadow-lg">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Vector FAQ Match Rate</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-blue-400 font-mono">{faqMatchPct}%</span>
                <span className="text-[10px] text-zinc-400">({analytics?.faqMatchCount || 0} hits)</span>
              </div>
              <p className="text-[10px] text-zinc-500">Direct TF-IDF matches</p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#222222] rounded-xl p-4 space-y-1 shadow-lg">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Student Satisfaction</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400 font-mono">{helpfulPct}%</span>
                <span className="text-[10px] text-zinc-400">({analytics?.helpfulCount || 0} 👍)</span>
              </div>
              <p className="text-[10px] text-zinc-500">Helpful rating feedback</p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#222222] rounded-xl p-4 space-y-1 shadow-lg">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Indexed FAQs</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white font-mono">{faqs.length}</span>
                <span className="text-[10px] text-zinc-400">entries</span>
              </div>
              <p className="text-[10px] text-zinc-500">Active university policies</p>
            </div>
          </div>

          {/* FAQs Manager */}
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" /> Knowledge Base Management
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Expand official answers and keywords recognized by the TF-IDF matching engine.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/20 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New FAQ</span>
              </button>
            </div>

            {/* FAQs Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter indexed questions..."
                className="w-full bg-[#121212] border border-[#222222] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* FAQs List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {faqs
                .filter(f => !searchFilter || f.question.toLowerCase().includes(searchFilter.toLowerCase()))
                .map((faq) => (
                  <div
                    key={faq.id}
                    onClick={() => setSelectedFaqModal(faq)}
                    className="p-3.5 rounded-xl bg-[#121212] border border-[#222222] hover:border-blue-500/50 transition-colors flex items-start justify-between gap-4 cursor-pointer group"
                    title="Click to open full FAQ details"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300">
                          {faq.category}
                        </span>
                        <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors truncate">{faq.question}</h4>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2">{faq.answer}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFaq(faq.id);
                      }}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-rose-500 text-zinc-400 hover:text-rose-400 transition-colors shrink-0"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: REGISTERED STUDENT ACCOUNTS & ALL USERS DIRECTORY */}
      {/* ========================================================================= */}
      {activeSection === 'students' && (
        <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 space-y-4 shadow-xl">
          {/* Header & Sub-Module View Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#1c1c1c] pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" /> Student Accounts & All Users Module
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Manage registered user admissions, fee concessions, and student-reported AI response feedback reasons
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-2 bg-[#121212] p-1 rounded-xl border border-[#262626]">
              <button
                onClick={() => setUserViewMode('roster')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  userViewMode === 'roster'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>All Users Roster ({students.length})</span>
              </button>

              <button
                onClick={() => setUserViewMode('dislikes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  userViewMode === 'dislikes'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/40'
                }`}
              >
                <MessageSquareWarning className="w-3.5 h-3.5" />
                <span>AI Disliked Responses</span>
                {dislikeFeedbackList.length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    userViewMode === 'dislikes' ? 'bg-white text-rose-700' : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {dislikeFeedbackList.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: ALL USERS ROSTER */}
          {userViewMode === 'roster' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
                  <button
                    onClick={() => setStudentCohortFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      studentCohortFilter === 'all' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    All ({students.length})
                  </button>
                  <button
                    onClick={() => setStudentCohortFilter('first_year')}
                    className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                      studentCohortFilter === 'first_year' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Hash className="w-3 h-3 text-blue-400" />
                    <span>1st Year ({students.filter(s => s.cohort === 'first_year').length})</span>
                  </button>
                  <button
                    onClick={() => setStudentCohortFilter('senior_year')}
                    className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                      studentCohortFilter === 'senior_year' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3 h-3 text-indigo-400" />
                    <span>2nd+ Year ({students.filter(s => s.cohort === 'senior_year').length})</span>
                  </button>
                </div>

                {/* Quick Dislike Alert Chip */}
                {dislikeFeedbackList.length > 0 && (
                  <button
                    onClick={() => setUserViewMode('dislikes')}
                    className="px-3 py-1 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs font-medium hover:bg-rose-900/50 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>{dislikeFeedbackList.length} AI response dislike reasons awaiting review &rarr;</span>
                  </button>
                )}
              </div>

              {/* Live Link Banner */}
              <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-800/30 flex items-center justify-between text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">Live Admissions ⇄ Student Module Synchronization Active</span>
                </div>
                <span className="text-[11px] text-zinc-400 hidden sm:inline">
                  Updates propagate instantly to public admissions and student profiles
                </span>
              </div>

              <div className="border border-[#222222] rounded-xl overflow-x-auto bg-[#121212]">
                <table className="w-full text-left text-xs min-w-[1050px]">
                  <thead className="bg-[#0a0a0a] text-zinc-400 border-b border-[#222222] font-semibold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Cohort</th>
                      <th className="p-3">Identifier</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Admission Status</th>
                      <th className="p-3">Intermediate & Concession</th>
                      <th className="p-3">AI Response Feedback</th>
                      <th className="p-3">Hostel & Docs</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222222]">
                    {students
                      .filter(s => studentCohortFilter === 'all' || s.cohort === studentCohortFilter)
                      .map((student) => {
                        // Check if this student has recorded dislike feedback
                        const studentDislikes = dislikeFeedbackList.filter(d => 
                          (d.studentId && (d.studentId === student.applicationNumber || d.studentId === student.collegeEmail || d.studentId === student.id)) ||
                          (d.studentName && d.studentName.toLowerCase() === student.name.toLowerCase()) ||
                          (student.dislikedResponses && student.dislikedResponses.some((r: any) => r.id === d.id))
                        );

                        return (
                          <tr 
                            key={student.id} 
                            onClick={() => handleOpenEditStudentModal(student)}
                            className="hover:bg-zinc-900/60 cursor-pointer transition-colors"
                            title="Click to view & edit student record"
                          >
                            <td className="p-3 font-semibold text-zinc-200">{student.name}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                student.cohort === 'first_year' ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                              }`}>
                                {student.cohort === 'first_year' ? '1st Year' : (student.yearOfStudy || '2nd+ Year')}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-zinc-300">
                              {student.cohort === 'first_year' ? student.applicationNumber : student.collegeEmail}
                            </td>
                            <td className="p-3 text-zinc-300">{student.department}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                {student.admissionStatus || 'Provisional Confirmed'}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 font-mono text-xs">
                                  <span className="font-bold text-white">
                                    {student.intermediateMarks ? `${student.intermediateMarks}%` : '—'}
                                  </span>
                                  {student.concessionApplied && (
                                    <span className="text-[10px] text-amber-300 font-sans font-semibold">
                                      ({student.concessionApplied})
                                    </span>
                                  )}
                                </div>
                                {student.annualTuitionDue && (
                                  <div className="text-[10px] text-zinc-400 font-mono">
                                    Due: <span className="text-zinc-200">{student.annualTuitionDue}</span>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* AI Response Feedback Column */}
                            <td className="p-3">
                              {studentDislikes.length > 0 ? (
                                <div className="space-y-1 max-w-[200px]">
                                  <button
                                    onClick={() => setSelectedDislikeModal(studentDislikes[0])}
                                    className="px-2 py-0.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
                                    title="Click to view student dislike reasons"
                                  >
                                    <MessageSquareWarning className="w-3 h-3 text-rose-400 shrink-0" />
                                    <span>{studentDislikes.length} Disliked Answer{studentDislikes.length > 1 ? 's' : ''}</span>
                                  </button>
                                  <p className="text-[10px] text-zinc-400 truncate" title={studentDislikes[0].reason}>
                                    Reason: <span className="text-zinc-200 italic font-medium">"{studentDislikes[0].reason}"</span>
                                  </p>
                                </div>
                              ) : (
                                <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium">
                                  <ThumbsUp className="w-3 h-3 text-emerald-500/70" />
                                  <span>Satisfied</span>
                                </span>
                              )}
                            </td>

                            <td className="p-3">
                              <div className="space-y-0.5 text-[11px]">
                                <div className="text-zinc-300 truncate max-w-[130px]">
                                  {student.hostelAllotted || 'Day Scholar'}
                                </div>
                                <span className={`text-[10px] flex items-center gap-1 ${student.documentsVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                                  <ShieldCheck className="w-3 h-3" />
                                  {student.documentsVerified ? 'Verified' : 'Pending Docs'}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => handleOpenEditStudentModal(student)}
                                  className="px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-blue-300 text-[11px] font-semibold transition-colors flex items-center gap-1"
                                  title="Edit Admission Record & Fee Waiver"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleQuickStudentAction(student.id, 'approve_concession', student.name)}
                                  className="px-2 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-800/60 border border-amber-800/40 text-amber-300 text-[10px] font-bold transition-colors"
                                  title="Quick 50% Concession Waiver"
                                >
                                  ⚡ 50% Waiver
                                </button>
                                <button
                                  onClick={() => handleQuickStudentAction(student.id, 'verify_documents', student.name)}
                                  className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                  title="Verify Certificates"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: AI DISLIKED RESPONSES & STUDENT REASONS */}
          {userViewMode === 'dislikes' && (
            <div className="space-y-4">
              {/* Summary KPI Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#121212] border border-rose-900/30 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-rose-950 text-rose-400 border border-rose-800">
                    <MessageSquareWarning className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white font-mono">{dislikeFeedbackList.length}</div>
                    <div className="text-xs text-zinc-400">Total Disliked AI Answers</div>
                  </div>
                </div>

                <div className="bg-[#121212] border border-[#242424] rounded-xl p-3.5 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white font-mono">
                      {new Set(dislikeFeedbackList.map(d => d.studentName || d.studentId)).size}
                    </div>
                    <div className="text-xs text-zinc-400">Unique Students Reporting</div>
                  </div>
                </div>

                <div className="bg-[#121212] border border-[#242424] rounded-xl p-3.5 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-300">Direct Resolution</div>
                    <div className="text-xs text-zinc-400">Convert reasons directly to verified FAQs</div>
                  </div>
                </div>
              </div>

              {/* Filters and Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111111] p-3 rounded-xl border border-[#222222]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={dislikeSearch}
                    onChange={(e) => setDislikeSearch(e.target.value)}
                    placeholder="Search by student name, query, or reason for dislike..."
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500/50"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider shrink-0">Filter:</span>
                  {['all', 'Inaccurate policy or answer', 'Outdated fee or concession info', 'Hostel or facility query', 'Missing procedure details'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setDislikeCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                        dislikeCategoryFilter === cat
                          ? 'bg-rose-600 text-white border-rose-500 font-semibold shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
                      }`}
                    >
                      {cat === 'all' ? 'All Reasons' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dislikes Card Feed */}
              {dislikeFeedbackList.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-[#262626] rounded-2xl bg-[#0f0f0f] space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No Disliked AI Responses Reported</h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Students are satisfied with all AI answers. When any student clicks dislike and submits their reason, it will immediately appear here for administrator review.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dislikeFeedbackList
                    .filter(item => {
                      const matchesSearch = !dislikeSearch || 
                        (item.userQuery && item.userQuery.toLowerCase().includes(dislikeSearch.toLowerCase())) ||
                        (item.reason && item.reason.toLowerCase().includes(dislikeSearch.toLowerCase())) ||
                        (item.expectedResponse && item.expectedResponse.toLowerCase().includes(dislikeSearch.toLowerCase())) ||
                        (item.studentName && item.studentName.toLowerCase().includes(dislikeSearch.toLowerCase())) ||
                        (item.studentId && item.studentId.toLowerCase().includes(dislikeSearch.toLowerCase()));
                      const matchesCat = dislikeCategoryFilter === 'all' || item.reason === dislikeCategoryFilter || item.category === dislikeCategoryFilter;
                      return matchesSearch && matchesCat;
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#121212] border border-[#242424] hover:border-rose-900/50 rounded-2xl p-4 transition-all shadow-md space-y-3.5"
                      >
                        {/* Student Info & Reason Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f1f1f] pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center font-bold text-xs shrink-0">
                              {item.studentName ? item.studentName.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-xs">{item.studentName || 'Registered Student'}</span>
                                {item.studentCohort && (
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                                    {item.studentCohort === 'first_year' ? '1st Year' : 'Senior Student'}
                                  </span>
                                )}
                                <span className="text-[11px] font-mono text-zinc-400">
                                  {item.studentId || 'ID: —'}
                                </span>
                              </div>
                              <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                                <span>{item.department || 'General Campus Directives'}</span>
                                <span>&bull;</span>
                                <span className="text-zinc-500 font-mono">{item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recent'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1.5 shadow-sm">
                              <ThumbsDown className="w-3 h-3 text-rose-400" />
                              <span>{item.reason || 'Disliked Answer'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Student's Reason & Stated Expectations */}
                        <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs space-y-1.5">
                          <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase tracking-wider text-[10px]">
                            <MessageSquareWarning className="w-3.5 h-3.5" />
                            <span>Student's Reason for Dislike & Stated Expectations:</span>
                          </div>
                          <p className="text-white text-xs font-medium pl-2 border-l-2 border-rose-500">
                            "{item.expectedResponse || item.reason || 'Student indicated this answer was inaccurate or incomplete.'}"
                          </p>
                        </div>

                        {/* Side by side preview: Student Question vs Disliked AI Answer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* Student's Prompt */}
                          <div className="p-3 rounded-xl bg-[#0b0b0b] border border-[#222222] space-y-1">
                            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">
                              Student's Prompt:
                            </span>
                            <p className="text-zinc-200 font-medium">{item.userQuery}</p>
                          </div>

                          {/* Disliked AI Response */}
                          <div className="p-3 rounded-xl bg-[#0b0b0b] border border-[#222222] space-y-1">
                            <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">
                              Disliked AI Answer:
                            </span>
                            <p className="text-zinc-400 line-clamp-3 leading-relaxed">
                              {item.aiResponse}
                            </p>
                          </div>
                        </div>

                        {/* Admin Action Buttons */}
                        <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => setSelectedDislikeModal(item)}
                            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Inspect Full Dialogue</span>
                          </button>

                          <button
                            onClick={() => handlePromoteDislikeToFaq(item)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5"
                            title="Add question and student's correct details directly to verified FAQs"
                          >
                            <Plus className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Promote to Approved FAQ</span>
                          </button>

                          <button
                            onClick={() => handleResolveDislike(item.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>Mark Resolved</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: OFFICIAL UNIVERSITY ANNOUNCEMENTS & NOTIFICATIONS */}
      {/* ========================================================================= */}
      {activeSection === 'announcements' && (
        <AdminAnnouncementsManager
          announcements={announcements}
          onRefresh={() => {
            fetchAnnouncements();
            if (onRefreshAll) onRefreshAll();
          }}
          onOpenAnnouncement={onOpenAnnouncement || (() => {})}
          currentAdmin={currentAdmin}
          showNotification={showNotification}
        />
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: ADMISSIONS & CAMPUS ENQUIRIES */}
      {/* ========================================================================= */}
      {activeSection === 'enquiries' && (
        <AdminEnquiriesManager
          enquiries={liveEnquiries}
          onUpdateStatus={onUpdateEnquiryStatus || (async () => false)}
          onDeleteEnquiry={onDeleteEnquiry || (async () => false)}
          onRefresh={() => {
            if (onRefreshAll) onRefreshAll();
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: GOOGLE DRIVE STUDENT ARCHIVE & CERTIFICATES EXPLORER */}
      {/* ========================================================================= */}
      {activeSection === 'documents' && (
        <DriveFileExplorer />
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT FEE STRUCTURE */}
      {/* ========================================================================= */}
      {showFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl w-full max-w-2xl p-6 space-y-4 text-white shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-amber-400" />
                <span>{editingFeeItem ? 'Edit Fee Structure Record' : 'Add New Fee Structure Record'}</span>
              </h3>
              <button onClick={() => setShowFeeModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFeeItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1 font-medium">Program Name:</label>
                  <input
                    type="text"
                    required
                    value={feeProgram}
                    onChange={(e) => setFeeProgram(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science and Engineering"
                    className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Degree Level:</label>
                  <select
                    value={feeDegree}
                    onChange={(e) => setFeeDegree(e.target.value as any)}
                    className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="UG">UG (Undergraduate)</option>
                    <option value="PG">PG (Postgraduate)</option>
                    <option value="Ph.D">Ph.D (Doctoral)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Annual Tuition Fee:</label>
                <input
                  type="text"
                  required
                  value={feeTuition}
                  onChange={(e) => setFeeTuition(e.target.value)}
                  placeholder="e.g. ₹1,40,000 / year"
                  className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Intermediate Concessions Editor */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-amber-300 font-bold">
                    Intermediate (+2) Marks Concession Slabs:
                  </label>
                  <button
                    type="button"
                    onClick={() => setConcessionsList(prev => [...prev, { marksRange: '', concession: '' }])}
                    className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Concession Slab
                  </button>
                </div>

                <div className="space-y-2">
                  {concessionsList.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={c.marksRange}
                        onChange={(e) => {
                          const updated = [...concessionsList];
                          updated[idx].marksRange = e.target.value;
                          setConcessionsList(updated);
                        }}
                        placeholder="Marks condition (e.g. Above 95% in MPC)"
                        className="flex-1 bg-[#121212] border border-[#222222] rounded-lg p-2 text-white text-xs"
                      />
                      <input
                        type="text"
                        value={c.concession}
                        onChange={(e) => {
                          const updated = [...concessionsList];
                          updated[idx].concession = e.target.value;
                          setConcessionsList(updated);
                        }}
                        placeholder="Concession (e.g. 50% Tuition Fee Waiver)"
                        className="flex-1 bg-[#121212] border border-[#222222] rounded-lg p-2 text-emerald-400 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setConcessionsList(prev => prev.filter((_, i) => i !== idx))}
                        className="text-zinc-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hostel, Caution, Installments */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Hostel Fee Range:</label>
                  <input
                    type="text"
                    value={feeHostel}
                    onChange={(e) => setFeeHostel(e.target.value)}
                    placeholder="e.g. ₹65,000 - ₹95,000 / year"
                    className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Caution Deposit:</label>
                  <input
                    type="text"
                    value={feeCaution}
                    onChange={(e) => setFeeCaution(e.target.value)}
                    placeholder="e.g. ₹5,000 (Refundable)"
                    className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Installment Schedule:</label>
                  <input
                    type="text"
                    value={feeInstallments}
                    onChange={(e) => setFeeInstallments(e.target.value)}
                    placeholder="e.g. 2 semester installments"
                    className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Special Notes / Highlights:</label>
                <input
                  type="text"
                  value={feeNotes}
                  onChange={(e) => setFeeNotes(e.target.value)}
                  placeholder="e.g. Includes access to Cloud labs and High Performance Computing center."
                  className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={() => setShowFeeModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20"
                >
                  {editingFeeItem ? 'Update Fee Structure' : 'Save Fee Structure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT ADMISSIONS GUIDELINES */}
      {/* ========================================================================= */}
      {showEditAdmissionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl w-full max-w-2xl p-6 space-y-4 text-white shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-400" />
                <span>Modify Admissions Criteria & Procedures</span>
              </h3>
              <button onClick={() => setShowEditAdmissionsModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdmissionsInfo} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Admission Academic Year:</label>
                  <input
                    type="text"
                    required
                    value={admYear}
                    onChange={(e) => setAdmYear(e.target.value)}
                    placeholder="e.g. Academic Year 2025 - 2026"
                    className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Contact Helpline Phone:</label>
                  <input
                    type="text"
                    required
                    value={admPhone}
                    onChange={(e) => setAdmPhone(e.target.value)}
                    placeholder="+91 4563 289 042"
                    className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Admissions Overview:</label>
                <textarea
                  rows={2}
                  value={admOverview}
                  onChange={(e) => setAdmOverview(e.target.value)}
                  className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">
                  Eligibility Criteria (one per line):
                </label>
                <textarea
                  rows={4}
                  value={admEligibilityText}
                  onChange={(e) => setAdmEligibilityText(e.target.value)}
                  className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">
                  Admission Procedure Steps (one per line):
                </label>
                <textarea
                  rows={4}
                  value={admProcedureText}
                  onChange={(e) => setAdmProcedureText(e.target.value)}
                  className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Official Contact Email:</label>
                  <input
                    type="email"
                    value={admEmail}
                    onChange={(e) => setAdmEmail(e.target.value)}
                    className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Admissions Office Location:</label>
                  <input
                    type="text"
                    value={admLocation}
                    onChange={(e) => setAdmLocation(e.target.value)}
                    className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={() => setShowEditAdmissionsModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20"
                >
                  Save Admissions Guidelines
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD / EDIT OFFICE OF PLACEMENTS RECORD */}
      {/* ========================================================================= */}
      {showPlacementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl w-full max-w-md p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <span>{editingPlacement ? 'Edit Placement Record' : 'Add Placed Company / Student'}</span>
              </h3>
              <button onClick={() => setShowPlacementModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlacement} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Placed Company Name:</label>
                <input
                  type="text"
                  required
                  value={plcCompanyName}
                  onChange={(e) => setPlcCompanyName(e.target.value)}
                  placeholder="e.g. Google, Amazon, Microsoft, TCS Digital"
                  className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">LPA Package Details:</label>
                <input
                  type="text"
                  required
                  value={plcLpaDetails}
                  onChange={(e) => setPlcLpaDetails(e.target.value)}
                  placeholder="e.g. 44.0 LPA, 32.5 LPA, 7.5 LPA"
                  className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-emerald-400 font-mono font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Student Name (optional):</label>
                <input
                  type="text"
                  value={plcStudentName}
                  onChange={(e) => setPlcStudentName(e.target.value)}
                  placeholder="e.g. V. Rohit"
                  className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Department:</label>
                  <input
                    type="text"
                    value={plcDepartment}
                    onChange={(e) => setPlcDepartment(e.target.value)}
                    placeholder="e.g. CSE, ECE, IT"
                    className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Placement Year:</label>
                  <input
                    type="text"
                    value={plcPlacementYear}
                    onChange={(e) => setPlcPlacementYear(e.target.value)}
                    placeholder="2024-2025"
                    className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              {/* Student Photo Upload & Configuration */}
              <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-semibold flex items-center gap-1.5 text-xs">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Placed Student Photo</span>
                  </label>
                  {plcPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => setPlcPhotoUrl('')}
                      className="text-[10px] text-rose-400 hover:text-rose-300 font-medium transition-colors"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                {/* Upload File or URL Input */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-emerald-500/60 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 hover:bg-zinc-800">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Upload Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoFileChange} 
                        className="hidden" 
                      />
                    </label>
                    <span className="text-[11px] text-zinc-500">or paste URL:</span>
                  </div>

                  <input
                    type="text"
                    value={plcPhotoUrl}
                    onChange={(e) => setPlcPhotoUrl(e.target.value)}
                    placeholder="https://... (Image URL or uploaded file)"
                    className="w-full bg-[#101010] border border-[#282828] rounded-xl p-2 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500/60 font-mono"
                  />

                  {photoUploadError && (
                    <p className="text-[11px] text-rose-400 font-medium">{photoUploadError}</p>
                  )}
                </div>

                {/* Quick Avatar Presets */}
                <div className="pt-1">
                  <span className="text-[10px] text-zinc-500 block mb-1.5">Or choose high-res avatar preset:</span>
                  <div className="flex items-center gap-2">
                    {[
                      { label: 'Student 1', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80' },
                      { label: 'Student 2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80' },
                      { label: 'Student 3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80' },
                      { label: 'Student 4', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80' },
                      { label: 'Student 5', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80' }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPlcPhotoUrl(preset.url)}
                        className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                          plcPhotoUrl === preset.url 
                            ? 'border-emerald-400 ring-2 ring-emerald-500/30 scale-110' 
                            : 'border-zinc-700 hover:border-zinc-500 opacity-70 hover:opacity-100'
                        }`}
                        title={`Select preset avatar ${idx + 1}`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Preview in Modal */}
                {plcPhotoUrl && (
                  <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-emerald-500/30 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-400/50 shrink-0 bg-black">
                      <img 
                        src={plcPhotoUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={() => setPhotoUploadError('Could not load image from provided URL.')}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">
                          {plcStudentName || 'Student Preview'}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-800/40">
                          {plcLpaDetails || 'CTC LPA'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">
                        Placed at <strong className="text-zinc-200">{plcCompanyName || 'Company Name'}</strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={() => setShowPlacementModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20"
                >
                  {editingPlacement ? 'Update Placement' : 'Save Placement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD FAQ MODAL */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl w-full max-w-xl p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <h3 className="text-lg font-bold">Add New University FAQ Entry</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateFaq} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Department Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Department)}
                  className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500/50"
                >
                  {(['Admissions', 'Academics', 'Financial Aid & Tuition', 'Housing & Dining', 'Campus Life & Facilities', 'IT Support & Library'] as Department[]).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Question Text:</label>
                <input
                  type="text"
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. What are the rules for graduation honors?"
                  className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Official Answer:</label>
                <textarea
                  required
                  rows={4}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Provide detailed, clear official policy text..."
                  className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">TF-IDF Index Keywords (comma separated):</label>
                <input
                  type="text"
                  value={newKeywords}
                  onChange={(e) => setNewKeywords(e.target.value)}
                  placeholder="graduation, honors, cum laude, gpa requirement"
                  className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/20"
                >
                  Index into FAQ Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: EDIT STUDENT ADMISSION RECORD (LIVE SYNCED) */}
      {/* ========================================================================= */}
      {showEditStudentModal && editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl w-full max-w-lg p-6 space-y-4 text-white shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  <span>Edit Admission Record</span>
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  {editingStudent.name} &bull; {editingStudent.cohort === 'first_year' ? editingStudent.applicationNumber : editingStudent.collegeEmail}
                </p>
              </div>
              <button onClick={() => setShowEditStudentModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentAdmission} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-[11px] text-blue-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Changes will update live across the public Admissions View and Student Portal immediately.</span>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium flex items-center justify-between">
                  <span>Student Official College Mail ID:</span>
                  <span className="text-[10px] text-sky-400 font-mono">Syncs Live to Student Module</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={stuCollegeEmail}
                    onChange={(e) => setStuCollegeEmail(e.target.value)}
                    placeholder="e.g. 99240040272@klu.ac.in or student@kare.ac.in"
                    className="w-full bg-[#121212] border border-[#222222] rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Editing this mail ID updates the student account and immediately broadcasts to the student module and admissions view.
                </p>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Admission Status:</label>
                <select
                  value={stuAdmissionStatus}
                  onChange={(e) => setStuAdmissionStatus(e.target.value)}
                  className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Provisional Confirmed">Provisional Confirmed</option>
                  <option value="50% Concession Approved">50% Concession Approved</option>
                  <option value="25% Concession Approved">25% Concession Approved</option>
                  <option value="Seat Confirmed">Seat Confirmed</option>
                  <option value="Hostel Allotted">Hostel Allotted</option>
                  <option value="Documents Verified">Documents Verified</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Waitlisted">Waitlisted</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">
                  +2 / Intermediate Marks Percentage (%):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={stuIntermediateMarks}
                  onChange={(e) => setStuIntermediateMarks(e.target.value)}
                  placeholder="e.g. 96.5"
                  className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  The tuition fee concession and net annual tuition due will automatically recalculate against the program's fee structure.
                </p>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Hostel Allotment:</label>
                <input
                  type="text"
                  value={stuHostel}
                  onChange={(e) => setStuHostel(e.target.value)}
                  placeholder="e.g. Bhabha Hostel - Room 304 or Day Scholar"
                  className="w-full bg-[#121212] border border-[#222222] rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="stuDocsCheck"
                  checked={stuDocsVerified}
                  onChange={(e) => setStuDocsVerified(e.target.checked)}
                  className="rounded bg-[#121212] border-zinc-700 text-blue-600 focus:ring-0"
                />
                <label htmlFor="stuDocsCheck" className="text-zinc-300 font-medium cursor-pointer">
                  Certificates & Required Documents Verified
                </label>
              </div>

              <div className="flex justify-end items-center gap-2 pt-3 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditStudentModal(false);
                    setActiveSection('documents');
                  }}
                  className="px-3 py-2 rounded-xl bg-blue-950/60 border border-blue-800/60 text-blue-300 font-medium hover:bg-blue-900/60 flex items-center gap-1.5 mr-auto text-xs"
                >
                  <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                  <span>Open Drive Documents</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditStudentModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={stuSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
                >
                  {stuSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save & Broadcast Live</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Detailed Inspection of Disliked AI Response */}
      {selectedDislikeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-950 text-rose-400 border border-rose-800">
                  <MessageSquareWarning className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Student AI Feedback Audit</h3>
                  <p className="text-xs text-zinc-400">
                    Reported by {selectedDislikeModal.studentName || 'Student'} ({selectedDislikeModal.studentId || 'N/A'})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDislikeModal(null)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Metadata Card */}
            <div className="p-3 rounded-xl bg-black/40 border border-[#222222] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">Student:</span>
                <span className="font-semibold text-zinc-200">{selectedDislikeModal.studentName || 'Anonymous'}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">Identifier:</span>
                <span className="font-mono text-zinc-300">{selectedDislikeModal.studentId || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">Department:</span>
                <span className="text-zinc-300">{selectedDislikeModal.department || 'Admissions'}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">Reported:</span>
                <span className="text-zinc-400 font-mono text-[11px]">
                  {selectedDislikeModal.timestamp ? new Date(selectedDislikeModal.timestamp).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            </div>

            {/* Reason for Dislike Callout */}
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-700">
                  Reason: {selectedDislikeModal.reason || 'Incorrect Information'}
                </span>
              </div>
              {selectedDislikeModal.expectedResponse && (
                <div className="text-xs text-rose-100">
                  <span className="font-bold text-rose-400 block text-[11px] uppercase tracking-wider mb-1">
                    Student Expected / Correct Details:
                  </span>
                  <p className="bg-black/40 p-2.5 rounded-lg border border-rose-900/40 italic">
                    "{selectedDislikeModal.expectedResponse}"
                  </p>
                </div>
              )}
            </div>

            {/* Prompt vs AI Output */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                  Student Prompt / Question:
                </span>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 font-medium leading-relaxed">
                  {selectedDislikeModal.userQuery}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
                  AI Responded Response (Disliked by Student):
                </span>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap">
                  {selectedDislikeModal.aiResponse}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#222222]">
              <button
                type="button"
                onClick={() => setSelectedDislikeModal(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-800 text-xs"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handlePromoteDislikeToFaq(selectedDislikeModal);
                    setSelectedDislikeModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Promote to Verified FAQ</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleResolveDislike(selectedDislikeModal.id);
                    setSelectedDislikeModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/20 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Resolved</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Full FAQ Inspector */}
      {selectedFaqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div 
            className="bg-[#0b0b0f] border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl text-zinc-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-zinc-800 flex items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  {selectedFaqModal.category}
                </span>
                <h3 className="text-base font-bold text-white mt-2">{selectedFaqModal.question}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFaqModal(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 max-h-[60vh] text-xs leading-relaxed text-zinc-300">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Official Response:</span>
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 whitespace-pre-line text-xs leading-relaxed">
                  {selectedFaqModal.answer}
                </div>
              </div>

              {selectedFaqModal.keywords && selectedFaqModal.keywords.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">TF-IDF Recognized Keywords:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFaqModal.keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onDeleteFaq(selectedFaqModal.id);
                  setSelectedFaqModal(null);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete FAQ</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFaqModal(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
