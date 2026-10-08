export type Department = 
  | 'All'
  | 'Admissions' 
  | 'Academics' 
  | 'Financial Aid & Tuition' 
  | 'Housing & Dining' 
  | 'Campus Life & Facilities' 
  | 'IT Support & Library';

export interface FAQItem {
  id: string;
  category: Department;
  question: string;
  answer: string;
  keywords: string[];
  updatedAt: string;
  viewsCount: number;
  helpfulCount: number;
}

export interface TFIDFVector {
  term: string;
  tf: number;
  idf: number;
  tfidf: number;
}

export interface NLPMatchDetails {
  queryTokens: string[];
  stopwordsRemoved: string[];
  docVectors: Array<{
    faqId: string;
    question: string;
    category: string;
    cosineSimilarity: number;
    matchingTerms: string[];
  }>;
  topMatchScore: number;
  topMatchFaq?: FAQItem;
  processingTimeMs: number;
  matchingSource: 'FAQ_DATABASE' | 'GEMINI_AI' | 'HYBRID_AI_ENRICHED';
}

export interface DislikeFeedbackItem {
  id: string;
  messageId: string;
  timestamp: string;
  userQuery?: string;
  aiResponse: string;
  expectedResponse: string;
  reason?: string;
  studentName?: string;
  studentId?: string;
  department?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'bot';
  text: string;
  timestamp: string;
  department?: Department;
  userQueryContext?: string;
  nlpDetails?: {
    matchType: 'FAQ_DATABASE' | 'GEMINI_AI' | 'HYBRID_AI_ENRICHED';
    cosineSimilarity: number;
    matchedFaqQuestion?: string;
    matchedFaqCategory?: string;
    matchingTerms?: string[];
    processingTimeMs?: number;
  };
  sources?: Array<{
    id: string;
    question: string;
    category: string;
  }>;
  feedback?: 'helpful' | 'unhelpful';
  expectedResponse?: string;
  feedbackReason?: string;
  feedbackSubmitted?: boolean;
}

export interface UniversityDepartmentInfo {
  name: Department;
  email: string;
  phone: string;
  building: string;
  hours: string;
  head: string;
  description: string;
}

export interface CampusStat {
  totalStudents: number;
  undergradCount: number;
  postgradCount: number;
  facultyRatio: string;
  acceptanceRate: string;
  campusSize: string;
}

export interface AnalyticsData {
  totalQueries: number;
  faqMatchCount: number;
  aiFallbackCount: number;
  avgSimilarityScore: number;
  helpfulCount: number;
  unhelpfulCount: number;
  queriesByCategory: Record<string, number>;
  topSearchedTerms: Array<{ term: string; count: number }>;
  recentQueries: Array<{
    id: string;
    query: string;
    timestamp: string;
    matchType: string;
    score: number;
  }>;
  dislikeFeedbackList?: DislikeFeedbackItem[];
}

export type StudentCohort = 'first_year' | 'senior_year';

export interface StudentUser {
  id: string;
  name: string;
  cohort: StudentCohort;
  identifier: string; // applicationNumber (e.g., 2025KARE04128) or collegeEmail (e.g., student@kare.ac.in)
  applicationNumber?: string;
  collegeEmail?: string;
  email?: string;
  joinedYear?: number;
  yearOfStudy: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Postgraduate';
  department: string;
  rollNumber?: string;
  phone?: string;
  registeredAt: string;
  // Linked Admissions Fields
  admissionStatus?: 'Provisional Confirmed' | 'Verification Pending' | 'Concession Approved' | 'Seat Confirmed' | 'Hostel Allotted' | 'Enrolled';
  intermediateMarks?: number;
  concessionApplied?: string;
  annualTuitionDue?: string;
  hostelAllotted?: string;
  documentsVerified?: boolean;
  admissionQuota?: string;
  dislikedResponses?: DislikeFeedbackItem[];
}

export interface PasswordResetEmail {
  id: string;
  recipientEmail: string;
  recipientName: string;
  userType: 'student' | 'admin' | 'applicant';
  identifier: string;
  resetToken: string;
  resetUrl: string;
  sentAt: string;
  expiresAt: string;
  status: 'sent' | 'delivered';
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
  sentTo?: string;
  emailDetails?: PasswordResetEmail;
}

export interface VerifyTokenResponse {
  valid: boolean;
  error?: string;
  identifier?: string;
  email?: string;
  name?: string;
  userType?: 'student' | 'admin';
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
  userType?: 'student' | 'admin';
  identifier?: string;
}

export type AnnouncementCategory = 
  | 'General Circular' 
  | 'Admissions & Concessions' 
  | 'Examinations & Results' 
  | 'Scholarships & Fee Deadlines' 
  | 'Campus Life & Hostels' 
  | 'Placements & Career' 
  | 'Urgent Administrative Notice';

export type AnnouncementPriority = 'urgent' | 'high' | 'normal';
export type AnnouncementTargetCohort = 'all' | 'first_year' | 'senior_year';

export interface AnnouncementItem {
  id: string;
  circularNumber: string; // e.g., "KARE/CIR/2026/084"
  title: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  targetCohort: AnnouncementTargetCohort;
  targetDepartment?: string;
  content: string;
  publishedAt: string; // ISO date string
  authorName: string;
  authorRole: string; // e.g. "Dean of Academic Affairs"
  isPinned?: boolean;
  actionUrl?: string; // Optional internal or external destination
  actionLabel?: string;
  attachments?: Array<{
    name: string;
    size?: string;
  }>;
}

export interface LiveSyncPayload {
  type: 
    | 'SYNC' 
    | 'ADMISSIONS_UPDATED' 
    | 'STUDENT_UPDATED' 
    | 'FEE_UPDATED' 
    | 'PLACEMENTS_UPDATED'
    | 'ANNOUNCEMENT_PUBLISHED'
    | 'ANNOUNCEMENT_UPDATED'
    | 'ANNOUNCEMENT_DELETED'
    | 'ENQUIRY_SUBMITTED'
    | 'ENQUIRY_UPDATED'
    | 'ENQUIRY_DELETED';
  timestamp: string;
  data?: {
    admissionsInfo?: AdmissionsInfo;
    feeStructures?: FeeStructureItem[];
    placements?: PlacedStudentItem[];
    students?: StudentUser[];
    announcements?: AnnouncementItem[];
    latestAnnouncement?: AnnouncementItem;
    enquiries?: EnquiryItem[];
    latestEnquiry?: EnquiryItem;
    dislikeFeedbackList?: DislikeFeedbackItem[];
  };
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
  student?: StudentUser;
}

export interface IntermediateConcession {
  marksRange: string;
  concession: string;
}

export interface FeeStructureItem {
  id: string;
  program: string;
  degree: string; // UG, PG, Ph.D
  annualTuition: string;
  intermediateConcessions: IntermediateConcession[];
  hostelFee?: string;
  cautionDeposit?: string;
  installments?: string;
  specialNotes?: string;
}

export interface AdmissionsInfo {
  admissionYear: string;
  overview: string;
  eligibilityCriteria: string[];
  admissionProcedure: string[];
  importantDates: Array<{ event: string; date: string }>;
  requiredDocuments: string[];
  contactEmail: string;
  contactPhone: string;
  admissionsOfficeLocation: string;
}

export interface PlacedStudentItem {
  id: string;
  companyName: string;
  lpaDetails: string;
  studentName?: string;
  department?: string;
  placementYear?: string;
  photoUrl?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  department?: string;
  token: string;
  loggedInAt: string;
}

export interface AdminAuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  hint?: string;
  admin?: AdminUser;
}

export type EnquiryStatus = 'Pending' | 'In Review' | 'Contacted' | 'Resolved';

export interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  programInterested: string;
  degreeType: 'UG' | 'PG' | 'Ph.D' | 'Diploma';
  intermediateMarks?: number;
  city?: string;
  state?: string;
  categoryQuota?: string;
  message: string;
  status: EnquiryStatus;
  submittedAt: string;
  createdAt?: string;
  marksPercentage?: number;
  notes?: string;
  assignedCounselor?: string;
  source?: string;
  // Student identification fields
  studentIdentifier?: string;
  rollNumber?: string;
  applicationNumber?: string;
  department?: string;
  yearOfStudy?: string;
  cohort?: StudentCohort;
  isStudentAccount?: boolean;
}

export interface EnquirySubmissionPayload {
  name: string;
  email: string;
  phone: string;
  programInterested: string;
  degreeType?: 'UG' | 'PG' | 'Ph.D' | 'Diploma';
  intermediateMarks?: number;
  city?: string;
  state?: string;
  categoryQuota?: string;
  message: string;
  // Optional student identification fields
  studentIdentifier?: string;
  rollNumber?: string;
  applicationNumber?: string;
  department?: string;
  yearOfStudy?: string;
  cohort?: StudentCohort;
  isStudentAccount?: boolean;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string; // official mailid
  cabin: string;
  phoneExtension?: string;
  specialization?: string[];
  qualification?: string;
  officeHours?: string;
  roleTag?: 'Leadership' | 'Dean' | 'Head of Department' | 'Faculty Advisor' | 'Professor' | 'Admissions / Placement';
  avatarInitials?: string;
}

export type MainNavTab = 'home' | 'chat' | 'nlp' | 'faqs' | 'admin' | 'admissions' | 'academics' | 'faculty';

