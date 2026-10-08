import { apiFetch } from '../lib/api';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Sparkles, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  Cpu, 
  BookOpen, 
  Trash2, 
  HelpCircle,
  ChevronDown,
  Layers,
  ArrowRight,
  MessageSquareWarning,
  CheckCircle2,
  X,
  SendHorizonal,
  AlertCircle,
  CornerDownRight,
  History,
  Clock,
  RotateCcw,
  Search,
  ChevronRight,
  Copy,
  SlidersHorizontal,
  ShieldCheck,
  GraduationCap,
  IndianRupee,
  Building2,
  Bus,
  Compass,
  Volume2,
  Lock,
  KeyRound,
  FileDown
} from 'lucide-react';
import { VoiceBeam, useMicrophone } from 'voice-glow';
import { ThinkingOrb } from 'thinking-orbs';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, Department, NLPMatchDetails, StudentUser, StudentCohort } from '../types';
import { NLPDetailModal } from './NLPDetailModal';
import { ExportPdfModal } from './ExportPdfModal';
import { KalasalingamLogo } from './KalasalingamLogo';

interface ChatInterfaceProps {
  onInspectNLP: (nlpData: NLPMatchDetails) => void;
  currentUser: StudentUser | null;
  onOpenAuthModal: (mode?: 'login' | 'register', cohort?: StudentCohort) => void;
  initialPrompt?: string | null;
  onClearInitialPrompt?: () => void;
}

const DEPARTMENTS: Department[] = [
  'All',
  'Admissions',
  'Academics',
  'Financial Aid & Tuition',
  'Housing & Dining',
  'Campus Life & Facilities',
  'IT Support & Library'
];

interface CategoryQuickQuestion {
  text: string;
  tag: string;
  dept: Department;
}

const DEPARTMENT_CONFIG: Record<Department, { 
  label: string; 
  icon: any; 
  accentColor: string; 
  activeStyle: string;
  tagline: string;
}> = {
  'All': { 
    label: 'All Topics', 
    icon: Compass, 
    accentColor: 'text-blue-400', 
    activeStyle: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border-blue-500',
    tagline: 'General University Inquiries'
  },
  'Admissions': { 
    label: 'Admissions', 
    icon: GraduationCap, 
    accentColor: 'text-amber-400', 
    activeStyle: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/30 border-amber-500',
    tagline: 'Intermediate MPC Cutoffs, Concessions & Verification'
  },
  'Academics': { 
    label: 'Academics', 
    icon: BookOpen, 
    accentColor: 'text-indigo-400', 
    activeStyle: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 border-indigo-500',
    tagline: 'Credit Limits (25 ceiling), Hackathon EE Credits & Certifications'
  },
  'Financial Aid & Tuition': { 
    label: 'Financial Aid & Tuition', 
    icon: IndianRupee, 
    accentColor: 'text-emerald-400', 
    activeStyle: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 border-emerald-500',
    tagline: 'Fee Slabs, 50% Intermediate Waiver & Bank Loans'
  },
  'Housing & Dining': { 
    label: 'Housing & Dining', 
    icon: Building2, 
    accentColor: 'text-purple-400', 
    activeStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 border-purple-500',
    tagline: 'Hostel Room Allotment, AC/Non-AC Slabs & Gate Timings'
  },
  'Campus Life & Facilities': { 
    label: 'Campus Life', 
    icon: Bus, 
    accentColor: 'text-cyan-400', 
    activeStyle: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 border-cyan-500',
    tagline: 'Bus Routes, Timings, Sports Complex & Health Center'
  },
  'IT Support & Library': { 
    label: 'IT & Library', 
    icon: Cpu, 
    accentColor: 'text-rose-400', 
    activeStyle: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/30 border-rose-500',
    tagline: 'Campus Wi-Fi Login, Digital Journals & MATLAB Labs'
  }
};

const DEPARTMENT_QUESTIONS_MAP: Record<Department, CategoryQuickQuestion[]> = {
  'Admissions': [
    { text: 'What is the Intermediate MPC cutoff for 50% fee concession in B.Tech?', tag: '50% Concession', dept: 'Admissions' },
    { text: 'Where do 1st year students submit certificates for admission verification?', tag: 'Verification', dept: 'Admissions' },
    { text: 'How do I apply for KARE entrance exam and fee waiver scholarship?', tag: 'KARE Exam', dept: 'Admissions' },
    { text: 'What are the hostel room allotment and mess options for freshers?', tag: 'Freshers Hostel', dept: 'Admissions' },
    { text: 'Can I pay the annual tuition fee in semester installments?', tag: 'Installments', dept: 'Admissions' },
    { text: 'What documents are required during physical seat allotment?', tag: 'Required Docs', dept: 'Admissions' }
  ],
  'Academics': [
    { text: 'What are the credit requirements and duration for B.Tech under Regulations 2025?', tag: 'Regulations 2025', dept: 'Academics' },
    { text: 'How does the Hybrid Grading Approach work under KARE Regulations 2025?', tag: 'Hybrid Grading', dept: 'Academics' },
    { text: 'What are the eligibility criteria and four options for B.Tech with Honours?', tag: 'Honours Degree', dept: 'Academics' },
    { text: 'What are the NEP-2020 multiple exit and re-entry options?', tag: 'NEP Exit/Entry', dept: 'Academics' },
    { text: 'What is the attendance requirement and condonation rules (75% / 65%)?', tag: 'Attendance & Condonation', dept: 'Academics' },
    { text: 'Which courses (UE, PE, PC, FC, EE, EC) count in the 25 credit limit?', tag: '25-Credit Ceiling', dept: 'Academics' },
    { text: 'How many EE credits from hackathons are required before 6th sem?', tag: 'EE Hackathons', dept: 'Academics' },
    { text: 'How many certificates do we need under Group 2 and Group 3?', tag: 'Group 2 & 3', dept: 'Academics' },
    { text: 'Can Group 2 & 3 certificates exceed the 25 credit limit?', tag: 'Exemption Rule', dept: 'Academics' },
    { text: 'Under which category can NPTEL credits be claimed?', tag: 'NPTEL Mapping', dept: 'Academics' }
  ],
  'Financial Aid & Tuition': [
    { text: 'What is the fee structure and how is concession given on Intermediate marks?', tag: 'Merit Slabs', dept: 'Financial Aid & Tuition' },
    { text: 'Is the ₹5,000 caution deposit 100% refundable at graduation?', tag: 'Caution Deposit', dept: 'Financial Aid & Tuition' },
    { text: 'What scholarships exist for JEE Main 90+ percentile students?', tag: 'JEE Merit', dept: 'Financial Aid & Tuition' },
    { text: 'How do I obtain official fee receipts for education loan disbursement?', tag: 'Bank Education Loan', dept: 'Financial Aid & Tuition' },
    { text: 'Are there sports or single-girl-child fee waiver categories?', tag: 'Special Quotas', dept: 'Financial Aid & Tuition' }
  ],
  'Housing & Dining': [
    { text: 'What are the hostel room allotment timings and mess options for students?', tag: 'Hostel Allotment', dept: 'Housing & Dining' },
    { text: 'What is the fee difference between 2-sharing AC and 4-sharing Non-AC?', tag: 'Room Slabs', dept: 'Housing & Dining' },
    { text: 'What are the hostel gate timings and biometric attendance rules?', tag: 'Gate Rules', dept: 'Housing & Dining' },
    { text: 'Are laundry, housekeeping, and Wi-Fi services included in hostel accommodation?', tag: 'Amenities', dept: 'Housing & Dining' }
  ],
  'Campus Life & Facilities': [
    { text: 'What are the campus bus routes, timings, and boarding points?', tag: 'Bus Routes', dept: 'Campus Life & Facilities' },
    { text: 'What are the operating hours for the gym, sports complex, and swimming pool?', tag: 'Sports Complex', dept: 'Campus Life & Facilities' },
    { text: 'What medical, health centre, and ambulance emergency services exist on campus?', tag: 'Campus Clinic', dept: 'Campus Life & Facilities' },
    { text: 'Which technical, cultural, and robotics student clubs are active on campus?', tag: 'Student Clubs', dept: 'Campus Life & Facilities' }
  ],
  'IT Support & Library': [
    { text: 'How do students obtain Wi-Fi login and library portal access credentials?', tag: 'Wi-Fi & Library', dept: 'IT Support & Library' },
    { text: 'How can I access IEEE, ScienceDirect, and digital research journals remotely?', tag: 'Digital Journals', dept: 'IT Support & Library' },
    { text: 'What is the procedure for resetting student portal passwords?', tag: 'Portal Reset', dept: 'IT Support & Library' },
    { text: 'Where are computer labs with MATLAB and ANSYS simulation software located?', tag: 'Software Labs', dept: 'IT Support & Library' }
  ],
  'All': [
    { text: 'What is the fee structure and how is concession given on Intermediate marks?', tag: 'Admissions & Fees', dept: 'Financial Aid & Tuition' },
    { text: 'Which courses (UE, PE, PC, FC, EE, EC) count in the 25 credit limit?', tag: 'Academics', dept: 'Academics' },
    { text: 'How many certificates do we need under Group 2 and Group 3?', tag: 'Certifications', dept: 'Academics' },
    { text: 'Where do 1st year students submit certificates for admission verification?', tag: 'Admissions', dept: 'Admissions' },
    { text: 'What are the hostel room allotment and mess options for freshers?', tag: 'Hostels', dept: 'Housing & Dining' },
    { text: 'What are the campus bus routes, timings, and boarding points?', tag: 'Campus Life', dept: 'Campus Life & Facilities' }
  ]
};

const FIRST_YEAR_SUGGESTIONS = [
  { text: 'What is the fee structure and how is concession given on Intermediate marks?', dept: 'Financial Aid & Tuition' as Department },
  { text: 'Where do 1st year students submit certificates for admission verification?', dept: 'Admissions' as Department },
  { text: 'What are the hostel room allotment and mess options for freshers?', dept: 'Housing & Dining' as Department },
  { text: 'When does the freshers orientation and mentor assignment take place?', dept: 'Academics' as Department },
  { text: 'What are the campus bus routes, timings, and boarding points?', dept: 'Campus Life & Facilities' as Department },
  { text: 'How do first year students get Wi-Fi login and library portal access?', dept: 'IT Support & Library' as Department }
];

const SENIOR_YEAR_SUGGESTIONS = [
  { text: 'How many certificates do we need under Group 2 and Group 3?', dept: 'Academics' as Department },
  { text: 'Which courses (UE, PE, PC, FC, EE, EC) count in the 25 credit limit?', dept: 'Academics' as Department },
  { text: 'How many EE credits from hackathons are required before 6th sem?', dept: 'Academics' as Department },
  { text: 'Can Group 2 & 3 certificates exceed the 25 credit limit? Under which category can NPTEL credits be claimed?', dept: 'Academics' as Department },
  { text: 'What is the fee structure and how is concession given on Intermediate marks?', dept: 'Financial Aid & Tuition' as Department },
  { text: 'How do I add or drop a course?', dept: 'Academics' as Department }
];

interface RecentQuestionItem {
  id: string;
  query: string;
  timestamp: string;
  department?: Department;
}

const DEFAULT_RECENT_QUESTIONS: RecentQuestionItem[] = [
  {
    id: 'rq-1',
    query: 'How many certificates do we need under Group 2 and Group 3?',
    timestamp: 'Today',
    department: 'Academics'
  },
  {
    id: 'rq-2',
    query: 'What is the fee structure and how is concession given on Intermediate marks?',
    timestamp: 'Today',
    department: 'Financial Aid & Tuition'
  },
  {
    id: 'rq-3',
    query: 'Which courses (UE, PE, PC, FC, EE, EC) count in the 25 credit limit?',
    timestamp: 'Today',
    department: 'Academics'
  },
  {
    id: 'rq-4',
    query: 'How many EE credits from hackathons are required before 6th sem?',
    timestamp: 'Today',
    department: 'Academics'
  }
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onInspectNLP,
  currentUser,
  onOpenAuthModal,
  initialPrompt,
  onClearInitialPrompt
}) => {
  const [selectedDept, setSelectedDept] = useState<Department>('All');

  // Dynamic quick questions list adapting to the selected department
  const currentCategoryQuestions: CategoryQuickQuestion[] = selectedDept === 'All'
    ? (currentUser?.cohort === 'first_year'
        ? FIRST_YEAR_SUGGESTIONS.map(s => ({ ...s, tag: '1st Year Freshers' }))
        : SENIOR_YEAR_SUGGESTIONS.map(s => ({ ...s, tag: 'Senior Academics' })))
    : (DEPARTMENT_QUESTIONS_MAP[selectedDept] || DEPARTMENT_QUESTIONS_MAP['All']);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: "👋 Welcome to KARE AI Campus Assistant!\n\nI can help you with course registration, credit limits (UE, PE, PC, FC, EE, EC), Group 2 & Group 3 certification rules, NPTEL credits, admissions, tuition, housing, and campus facilities. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      nlpDetails: {
        matchType: 'FAQ_DATABASE',
        cosineSimilarity: 1.0,
        matchedFaqQuestion: 'Welcome System Greeting',
        processingTimeMs: 1.2
      }
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [activeModalNLP, setActiveModalNLP] = useState<NLPMatchDetails | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Voice effect from Libraries.dev (voice-glow)
  const mic = useMicrophone();
  const simulatedMeter = useRef<number>(0);
  const [isSimulatedActive, setIsSimulatedActive] = useState(false);

  // Per-frame level ticker for smooth voice glow response even if mic stream is initializing or in simulated fallback
  useEffect(() => {
    let animId: number;
    const updateMeter = () => {
      if (isListening || isSimulatedActive || mic.state === 'live') {
        const time = Date.now() / 180;
        simulatedMeter.current = 0.25 + 0.45 * Math.abs(Math.sin(time) * Math.cos(time * 1.4));
      } else {
        simulatedMeter.current = 0;
      }
      animId = requestAnimationFrame(updateMeter);
    };
    animId = requestAnimationFrame(updateMeter);
    return () => cancelAnimationFrame(animId);
  }, [isListening, isSimulatedActive, mic.state]);
  
  // Recent Questions state
  const [showRecentSidebar, setShowRecentSidebar] = useState<boolean>(false);
  const [recentFilter, setRecentFilter] = useState('');
  const [recentQuestions, setRecentQuestions] = useState<RecentQuestionItem[]>(() => {
    try {
      const saved = localStorage.getItem('kare_recent_questions');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_RECENT_QUESTIONS;
  });

  // Dislike Expected Response form state
  const [activeDislikeMsgId, setActiveDislikeMsgId] = useState<string | null>(null);
  const [expectedText, setExpectedText] = useState('');
  const [selectedReason, setSelectedReason] = useState('Inaccurate policy or answer');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Chat area sizing, width modes & density states
  const [chatWidthMode, setChatWidthMode] = useState<'wide' | 'full' | 'standard'>(() => {
    try {
      const saved = localStorage.getItem('kare_chat_width_mode');
      if (saved === 'wide' || saved === 'full' || saved === 'standard') return saved;
    } catch {
      // fallback
    }
    return 'wide';
  });

  const [isCompactMode, setIsCompactMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kare_chat_compact_mode') === 'true';
    } catch {
      // fallback
    }
    return false;
  });

  const [showPromptsBar, setShowPromptsBar] = useState<boolean>(true);

  // Persist chat width mode
  useEffect(() => {
    try {
      localStorage.setItem('kare_chat_width_mode', chatWidthMode);
    } catch {
      // ignore
    }
  }, [chatWidthMode]);

  // Persist compact mode
  useEffect(() => {
    try {
      localStorage.setItem('kare_chat_compact_mode', String(isCompactMode));
    } catch {
      // ignore
    }
  }, [isCompactMode]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Persist recent questions
  useEffect(() => {
    try {
      localStorage.setItem('kare_recent_questions', JSON.stringify(recentQuestions));
    } catch {
      // ignore
    }
  }, [recentQuestions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Voice speech recognition initialization
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptChunk;
          } else {
            interim += transcriptChunk;
          }
        }

        if (final) {
          setInput(prev => {
            const separator = prev && !prev.endsWith(' ') ? ' ' : '';
            return prev + separator + final;
          });
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceError('Microphone access was denied. Please allow microphone permissions in your browser.');
        } else if (event.error === 'no-speech') {
          // Keep listening or allow user to try again
        } else if (event.error === 'network') {
          setVoiceError('Network error encountered during speech recognition.');
        } else {
          setVoiceError(`Voice input error (${event.error}). Please try again.`);
        }
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition could not be initialized:', e);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleVoiceListen = async () => {
    if (!currentUser) {
      onOpenAuthModal('login');
      return;
    }

    setVoiceError(null);

    if (mic.state === 'live' || isListening) {
      if (mic.state === 'live') {
        mic.stop();
      }
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      setIsSimulatedActive(false);
      setInterimTranscript('');
      return;
    }

    // Call mic.start() from user gesture
    try {
      await mic.start();
    } catch (err: any) {
      console.warn('Microphone access fallback notice:', err);
      setIsSimulatedActive(true);
    }

    if (!speechSupported || !recognitionRef.current) {
      setIsListening(true);
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current.start();
          setIsListening(true);
        }, 150);
      } catch {
        setIsListening(true);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    if (!currentUser) {
      onOpenAuthModal('login');
      return;
    }

    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    if (mic.state === 'live') {
      mic.stop();
    }
    setIsListening(false);
    setIsSimulatedActive(false);

    // Track query in Recent Questions (top of list, unique, cap at 30)
    setRecentQuestions(prev => {
      const filtered = prev.filter(item => item.query.trim().toLowerCase() !== query.toLowerCase());
      const newItem: RecentQuestionItem = {
        id: `rq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        department: selectedDept
      };
      return [newItem, ...filtered].slice(0, 30);
    });

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'student',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      department: selectedDept
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    setIsLoading(true);

    try {
      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          department: selectedDept,
          student: currentUser
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate response.');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userQueryContext: query,
        nlpDetails: {
          matchType: data.matchType,
          cosineSimilarity: data.cosineSimilarity,
          matchedFaqQuestion: data.matchedFaqQuestion,
          matchedFaqCategory: data.matchedFaqCategory,
          matchingTerms: data.matchingTerms,
          processingTimeMs: data.processingTimeMs
        },
        sources: data.sources
      };

      // Store complete nlpBreakdown on message object dynamically
      (botMsg as any).rawNlpBreakdown = data.nlpBreakdown;

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Sorry, I encountered an issue connecting to the campus knowledge server. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userQueryContext: query
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt.trim());
      onClearInitialPrompt?.();
    }
  }, [initialPrompt]);

  const handleFeedback = async (msgId: string, helpful: boolean) => {
    if (!helpful) {
      // If dislike, open the expected response input panel for this message
      setActiveDislikeMsgId(prev => (prev === msgId ? null : msgId));
      setExpectedText('');
      setSelectedReason('Inaccurate policy or answer');
    } else {
      // If helpful, mark directly
      if (activeDislikeMsgId === msgId) {
        setActiveDislikeMsgId(null);
      }
      setMessages(prev => prev.map(m => {
        if (m.id === msgId) {
          return { ...m, feedback: 'helpful' };
        }
        return m;
      }));

      try {
        await apiFetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ helpful: true, messageId: msgId })
        });
      } catch (err) {
        console.error('Feedback error:', err);
      }
    }
  };

  const handleSubmitDislikeExpected = async (msg: ChatMessage) => {
    setIsSubmittingFeedback(true);
    const finalReason = selectedReason || 'Inaccurate policy or answer';
    const finalExpected = expectedText.trim() || `Disliked by student due to: ${finalReason}`;

    // Update message state locally
    setMessages(prev => prev.map(m => {
      if (m.id === msg.id) {
        return {
          ...m,
          feedback: 'unhelpful',
          expectedResponse: finalExpected,
          feedbackReason: finalReason,
          feedbackSubmitted: true
        };
      }
      return m;
    }));

    try {
      await apiFetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          helpful: false,
          messageId: msg.id,
          userQuery: msg.userQueryContext || 'Student Query',
          aiResponse: msg.text,
          expectedResponse: finalExpected,
          reason: finalReason,
          studentName: currentUser?.name || 'Student User',
          studentId: currentUser?.applicationNumber || currentUser?.collegeEmail || currentUser?.id || 'Student',
          department: currentUser?.department || selectedDept || 'Admissions'
        })
      });
    } catch (err) {
      console.error('Error submitting expected response feedback:', err);
    } finally {
      setIsSubmittingFeedback(false);
      setActiveDislikeMsgId(null);
    }
  };

  const handleCancelDislike = (msgId: string) => {
    setActiveDislikeMsgId(null);
    setExpectedText('');
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-msg',
        sender: 'bot',
        text: 'Chat history cleared. How else can I help you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleReask = (queryText: string, dept?: Department) => {
    if (dept && dept !== 'All') {
      setSelectedDept(dept);
    }
    handleSendMessage(queryText);
  };

  const handleInsertToInput = (queryText: string) => {
    setInput(queryText);
  };

  const handleDeleteRecent = (id: string) => {
    setRecentQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleClearAllRecent = () => {
    setRecentQuestions([]);
  };

  const filteredRecentQuestions = recentQuestions.filter(item => {
    if (!recentFilter.trim()) return true;
    const term = recentFilter.toLowerCase();
    return (
      item.query.toLowerCase().includes(term) || 
      (item.department && item.department.toLowerCase().includes(term))
    );
  });

  return (
    <div className={`flex flex-col h-[calc(100vh-4.25rem)] mx-auto px-2 sm:px-4 py-2 sm:py-2.5 gap-2 transition-all duration-200 ${
      chatWidthMode === 'full'
        ? 'w-full px-2 sm:px-6 max-w-none'
        : chatWidthMode === 'standard'
        ? 'max-w-6xl w-full'
        : 'max-w-[1600px] w-full'
    }`}>
      
      {/* Main Content Area: Chat Feed + Recent Questions Sidebar */}
      <div className="flex-1 flex gap-2.5 sm:gap-3 min-h-0 relative">
        
        {/* Messages Scroll Area */}
        <div className={`flex-1 overflow-y-auto bg-[#0a0a0a] border border-[#222222] rounded-2xl relative min-w-0 transition-all ${
          isCompactMode ? 'p-3 sm:p-4 space-y-3' : 'p-3.5 sm:p-5 space-y-4 sm:space-y-5'
        }`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-transparent to-blue-500/50 opacity-20 pointer-events-none"></div>

          {/* Top Actions Bar: Download Chat History & Clear Chat */}
          <div className="sticky top-0 z-20 flex items-center justify-between pointer-events-none pb-1 gap-2">
            <div className="pointer-events-auto">
              <button
                id="btn-download-chat-history"
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="group px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-950/90 via-[#0e172a] to-blue-950/90 hover:from-sky-900/90 hover:to-blue-900/90 text-sky-200 hover:text-white border border-sky-600/50 hover:border-sky-400 shadow-lg shadow-black/50 backdrop-blur-md flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                title="Download chat history as formatted PDF or text file"
              >
                <FileDown className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-200 transition-colors" />
                <span>Download History</span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  PDF / TXT
                </span>
              </button>
            </div>

            <div className="pointer-events-auto">
              <button
                id="btn-clear-chat-top"
                type="button"
                onClick={handleClearChat}
                className="group px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#141418] to-[#1c1317] hover:from-rose-950/80 hover:to-red-950/60 text-zinc-300 hover:text-rose-200 border border-zinc-700/80 hover:border-rose-500/70 shadow-lg shadow-black/50 backdrop-blur-md flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                title="Clear current conversation history"
              >
                <Trash2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-rose-400 group-hover:rotate-12 transition-all duration-200" />
                <span>Clear Chat</span>
              </button>
            </div>
          </div>

          {/* Guest / Unregistered Guidance Banner */}
          {!currentUser && (
            <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-zinc-200">
                    Student Login with Register Number
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Log in with your Register Number or institutional email to access your personalized student records and fee concessions.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('login')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Student Login</span>
                </button>
              </div>
            </div>
          )}
        
          {/* Staggered Chat Messages Flow */}
          <AnimatePresence initial={true}>
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'student';
              // Stagger delay calculation for smooth conversation flow:
              // Recent messages enter promptly (0.04s), while initial batch has a graceful cascading waterfall
              const isRecent = messages.length > 2 && index >= messages.length - 2;
              const staggerDelay = isRecent ? 0.04 : Math.min(index * 0.07, 0.28);

              return (
                <motion.div
                  key={msg.id}
                  initial={{
                    opacity: 0,
                    y: 18,
                    scale: 0.98,
                    x: isUser ? 10 : -10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    x: 0
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                    y: -8,
                    transition: { duration: 0.18 }
                  }}
                  transition={{
                    duration: 0.38,
                    delay: staggerDelay,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className={`flex gap-3 sm:gap-4 w-full ${
                    chatWidthMode === 'full'
                      ? 'max-w-5xl xl:max-w-6xl'
                      : chatWidthMode === 'standard'
                      ? 'max-w-2xl sm:max-w-3xl'
                      : 'max-w-4xl xl:max-w-5xl'
                  } ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {/* Avatar */}
                  <motion.div 
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.26, delay: staggerDelay + 0.04, ease: 'easeOut' }}
                    className={`rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1 transition-all ${
                      isCompactMode ? 'w-7 h-7' : 'w-8 h-8'
                    } ${
                      isUser 
                        ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/20' 
                        : 'p-0.5 bg-gradient-to-tr from-zinc-950 to-[#0e1629] border border-blue-500/30 shadow-lg shadow-blue-950/40 ring-1 ring-blue-500/20'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <KalasalingamLogo size="sm" variant="crest" />}
                  </motion.div>

                  {/* Message Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: staggerDelay + 0.03, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-1.5 max-w-[92%] sm:max-w-[88%] min-w-0"
                  >
                
                {/* Meta details badge if bot */}
                {!isUser && msg.nlpDetails && (
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {msg.nlpDetails.matchType === 'FAQ_DATABASE' ? (
                      <span className="px-2 py-0.5 bg-[#0e1422] text-[9px] uppercase tracking-wider text-emerald-400 border border-emerald-500/30 rounded-md font-bold inline-flex items-center gap-1 shadow-sm">
                        <Check className="w-3 h-3 text-emerald-400" /> Verified FAQ Source ({(msg.nlpDetails.cosineSimilarity * 100).toFixed(0)}% Match)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#141224] text-[9px] uppercase tracking-wider text-violet-300 border border-violet-500/30 rounded-md font-bold inline-flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3 text-violet-400" /> Gemini AI Synthesized Response
                      </span>
                    )}

                    {(msg as any).rawNlpBreakdown && (
                      <button
                        onClick={() => setActiveModalNLP((msg as any).rawNlpBreakdown)}
                        className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-sky-400 hover:text-sky-300 tracking-wider transition-colors"
                      >
                        <Cpu className="w-3 h-3" /> Inspect Vector Math
                      </button>
                    )}
                  </div>
                )}

                {/* Text Body */}
                <div className={`rounded-2xl leading-relaxed whitespace-pre-wrap shadow-xl transition-all ${
                  isCompactMode
                    ? 'p-3 text-[13px] sm:text-sm'
                    : 'p-3.5 sm:p-4 text-sm sm:text-[15px]'
                } ${
                  isUser
                    ? 'bg-gradient-to-br from-blue-950/45 via-indigo-950/35 to-[#0c101c] border border-blue-500/35 text-zinc-100 rounded-tr-none shadow-indigo-950/20'
                    : 'bg-gradient-to-br from-[#11151f]/95 via-[#0d1017]/95 to-[#090b10]/95 border border-zinc-800/90 text-zinc-200 rounded-tl-none shadow-black/40'
                }`}>
                  {msg.text}
                </div>

                {/* Sources & Action bar if bot */}
                {!isUser && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-zinc-500">
                    
                    {/* Source citation */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                        <span>Source: <strong className="text-zinc-300 font-normal">{msg.sources[0].question}</strong></span>
                      </div>
                    )}

                    {/* Timestamp & Feedback */}
                    <div className="flex items-center gap-3 ml-auto text-[11px]">
                      <span>{msg.timestamp}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleFeedback(msg.id, true)}
                          className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                            msg.feedback === 'helpful' 
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' 
                              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                          }`}
                          title="Helpful response"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, false)}
                          className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                            msg.feedback === 'unhelpful' || activeDislikeMsgId === msg.id
                              ? 'bg-rose-950/80 text-rose-400 border border-rose-800' 
                              : 'text-zinc-500 hover:text-rose-400 hover:bg-zinc-800'
                          }`}
                          title="Dislike & State Expected Response"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-medium hidden sm:inline">
                            {activeDislikeMsgId === msg.id ? 'Reviewing' : (msg.feedback === 'unhelpful' ? 'Disliked' : '')}
                          </span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* DISLIKE EXPECTED RESPONSE FORM (Appears when student clicks dislike / Thumbs Down) */}
                {!isUser && activeDislikeMsgId === msg.id && (
                  <div className="mt-2 p-4 rounded-2xl bg-gradient-to-b from-[#141010] to-[#0d0d0d] border border-rose-900/60 shadow-2xl text-xs space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-rose-900/40 pb-2">
                      <div className="flex items-center gap-2 text-rose-300 font-semibold">
                        <MessageSquareWarning className="w-4 h-4 text-rose-400" />
                        <span>State What You Were Expecting</span>
                      </div>
                      <button
                        onClick={() => handleCancelDislike(msg.id)}
                        className="text-zinc-500 hover:text-zinc-300 p-1"
                        title="Close feedback form"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* AI Response Quote Reference */}
                    <div className="bg-black/50 border border-white/5 rounded-xl p-2.5 text-[11px] text-zinc-400">
                      <span className="text-zinc-500 uppercase tracking-wider text-[9px] font-bold block mb-1">
                        Disliked AI Response:
                      </span>
                      <p className="line-clamp-2 italic text-zinc-300">"{msg.text}"</p>
                    </div>

                    {/* Quick Reason Chips */}
                    <div>
                      <span className="text-zinc-400 text-[11px] block mb-1.5 font-medium">Select issue category:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Inaccurate policy or answer',
                          'Fee / Intermediate marks concession rule',
                          'Group 2 & 3 certificate requirements',
                          'Semester 25-credit or EE limit',
                          'NPTEL course categorization',
                          'Too vague or missing steps'
                        ].map(reason => (
                          <button
                            key={reason}
                            type="button"
                            onClick={() => setSelectedReason(reason)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                              selectedReason === reason
                                ? 'bg-rose-900/80 text-rose-200 border border-rose-600 font-medium'
                                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
                            }`}
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Expected Response Textarea */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-zinc-300 text-[11px] font-medium block">
                          What response were you expecting? (Optional note for Admin)
                        </label>
                        <span className="text-[10px] text-zinc-500">Reason selected above will be recorded</span>
                      </div>
                      <textarea
                        value={expectedText}
                        onChange={(e) => setExpectedText(e.target.value)}
                        placeholder="Explain briefly why this response was inaccurate or what correct information you expected (e.g. correct fee discount, course code, hostel policy)..."
                        rows={3}
                        className="w-full bg-[#161616] border border-rose-950/60 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/50"
                      />
                    </div>

                    {/* Submit & Cancel buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] text-zinc-400">
                        Reason: <strong className="text-rose-300">{selectedReason}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCancelDislike(msg.id)}
                          className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={isSubmittingFeedback}
                          onClick={() => handleSubmitDislikeExpected(msg)}
                          className="px-4 py-1.5 rounded-lg font-semibold text-xs bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-lg shadow-rose-900/20 transition-all cursor-pointer"
                        >
                          <SendHorizonal className="w-3.5 h-3.5" />
                          {isSubmittingFeedback ? 'Submitting...' : 'Send Dislike Feedback to Admin'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* RECORDED EXPECTATION BANNER (If feedback was already submitted) */}
                {!isUser && msg.feedbackSubmitted && msg.expectedResponse && activeDislikeMsgId !== msg.id && (
                  <div className="mt-2 p-3 rounded-xl bg-rose-950/30 border border-rose-900/40 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-rose-400 font-semibold text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>Dislike Feedback Logged</span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveDislikeMsgId(msg.id);
                          setExpectedText(msg.expectedResponse || '');
                          if (msg.feedbackReason) setSelectedReason(msg.feedbackReason);
                        }}
                        className="text-[10px] text-zinc-400 hover:text-white underline"
                      >
                        Edit Expectation
                      </button>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg border border-white/5 space-y-1">
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                        <span>Reason: <strong className="text-zinc-300 font-normal">{msg.feedbackReason || 'General Feedback'}</strong></span>
                      </div>
                      <p className="text-zinc-300 text-[11px] italic">
                        <CornerDownRight className="w-3 h-3 inline mr-1 text-rose-400" />
                        <strong>Expected:</strong> "{msg.expectedResponse}"
                      </p>
                    </div>
                  </div>
                )}

                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* AI Loading State with ThinkingOrb from Libraries.dev */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="chat-ai-thinking-state"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3.5 text-zinc-200 text-xs py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#101524] to-[#121124] border border-indigo-500/40 w-fit shadow-xl shadow-indigo-950/30"
            >
              <ThinkingOrb state="searching" size={64} theme="dark" speed={1.2} />
              <div className="flex flex-col">
                <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  Thinking & Searching Campus Knowledge Base...
                </span>
                <span className="font-mono text-[10px] text-zinc-400">
                  Evaluating TF-IDF weights, cosine similarity & AI reasoning...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
        </div>

        {/* Recent Questions Sidebar */}
        {showRecentSidebar && (
          <aside className="w-72 sm:w-80 lg:w-84 flex flex-col bg-[#0c0c0c] border border-[#222222] rounded-2xl p-3 sm:p-3.5 shrink-0 shadow-2xl animate-fadeIn z-20 overflow-hidden">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-950/80 border border-blue-800/60 text-blue-400">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Questions</h3>
                  <p className="text-[10px] text-zinc-500">Quickly re-ask or reuse queries</p>
                </div>
              </div>
              <button
                onClick={() => setShowRecentSidebar(false)}
                className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-900 transition-colors"
                title="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Filter inside sidebar */}
            {recentQuestions.length > 0 && (
              <div className="pt-3 pb-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={recentFilter}
                    onChange={(e) => setRecentFilter(e.target.value)}
                    placeholder="Filter your recent questions..."
                    className="w-full bg-[#141414] border border-[#222222] rounded-xl pl-8 pr-7 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50"
                  />
                  {recentFilter && (
                    <button
                      onClick={() => setRecentFilter('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Actions / Count Bar */}
            {recentQuestions.length > 0 && (
              <div className="flex items-center justify-between py-1.5 text-[11px] text-zinc-500">
                <span>
                  {filteredRecentQuestions.length} of {recentQuestions.length} questions
                </span>
                <button
                  onClick={handleClearAllRecent}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline text-[10px] font-medium"
                >
                  <Trash2 className="w-3 h-3" /> Clear History
                </button>
              </div>
            )}

            {/* Scrollable Questions List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 mt-1">
              {filteredRecentQuestions.length > 0 ? (
                filteredRecentQuestions.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#141414] border border-[#222222] hover:border-zinc-700 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between gap-1 text-[10px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.department && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-950/60 text-blue-400 border border-blue-800/40">
                            {item.department}
                          </span>
                        )}
                        <span className="text-zinc-500 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5 text-zinc-500" /> {item.timestamp}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteRecent(item.id)}
                        className="text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                        title="Remove from history"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-xs text-zinc-200 font-medium leading-snug line-clamp-3">
                      "{item.query}"
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-white/5">
                      <button
                        onClick={() => handleInsertToInput(item.query)}
                        className="px-2 py-1 rounded-lg text-[10px] font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 flex items-center gap-1 transition-colors"
                        title="Copy question into the input box to edit"
                      >
                        <Copy className="w-3 h-3 text-zinc-400" />
                        <span>Insert</span>
                      </button>
                      <button
                        onClick={() => handleReask(item.query, item.department)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 transition-colors shadow-sm shadow-blue-600/20"
                        title="Re-ask this question immediately"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Re-Ask</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center space-y-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-300">
                      {recentFilter ? 'No matching questions found' : 'No recent queries recorded'}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      {recentFilter ? 'Try searching with another keyword' : 'Your asked questions will automatically appear here for quick 1-click re-asking.'}
                    </p>
                  </div>

                  {!recentFilter && (
                    <div className="pt-2 text-left space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                        Quick Starters:
                      </span>
                      {currentCategoryQuestions.slice(0, 3).map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleReask(s.text, (s.dept as Department) || 'All')}
                          className="w-full text-left p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 text-[11px] text-zinc-300 transition-colors flex items-center justify-between group"
                        >
                          <span className="truncate">{s.text}</span>
                          <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-blue-400 shrink-0 ml-1" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* RECOMMENDED CAMPUS PROMPTS (Clean, non-repetitive) */}
      <div className="bg-[#0c0c0c] border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-1.5 px-2.5 flex flex-col gap-1 shrink-0 transition-all">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="p-0.5 rounded bg-blue-950/60 border border-blue-800/40 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-blue-400" />
            </span>
            <span className="text-[11px] font-semibold text-zinc-300">
              Recommended Inquiries
            </span>
            <span className="text-[10px] text-zinc-500 font-medium hidden sm:inline">
              &bull; 1-click answers
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-medium text-zinc-500 px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800/80">
              {currentCategoryQuestions.length} prompts
            </span>
            <button
              type="button"
              onClick={() => setShowPromptsBar(prev => !prev)}
              className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded hover:bg-zinc-900 transition-colors"
              title={showPromptsBar ? 'Minimize quick questions for more chat area' : 'Expand quick questions'}
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showPromptsBar ? '' : '-rotate-90'}`} />
            </button>
          </div>
        </div>

        {showPromptsBar && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin scrollbar-thumb-zinc-800">
            {currentCategoryQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (q.dept && q.dept !== 'All') {
                    setSelectedDept(q.dept);
                  }
                  handleSendMessage(q.text);
                }}
                className="group px-2.5 py-1.5 rounded-lg text-[11px] bg-gradient-to-r from-[#11141d] to-[#141224] hover:from-blue-950/60 hover:to-indigo-950/60 text-zinc-300 hover:text-white border border-zinc-800/80 hover:border-indigo-500/50 whitespace-nowrap transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
              >
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gradient-to-r from-blue-950/90 to-indigo-950/90 text-cyan-300 border border-indigo-500/30">
                  {q.tag}
                </span>
                <span className="font-normal text-[11px] text-zinc-300 group-hover:text-white">{q.text}</span>
                <ArrowRight className="w-2.5 h-2.5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Voice Error Banner */}
      {voiceError && (
        <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-xs text-rose-300 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <MicOff className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{voiceError}</span>
          </div>
          <button
            onClick={() => setVoiceError(null)}
            className="text-rose-400 hover:text-rose-200 px-2 py-0.5 rounded text-[11px] font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active Voice Listening Live Banner */}
      {isListening && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-blue-950/40 border border-blue-500/30 flex flex-col gap-2 shrink-0 animate-fadeIn shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span className="text-xs font-semibold text-blue-300">Listening to your voice...</span>
              {/* Sound Wave Animation */}
              <div className="flex items-center gap-0.5 ml-2">
                <span className="w-0.5 h-3 bg-blue-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]"></span>
                <span className="w-0.5 h-5 bg-indigo-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.1s]"></span>
                <span className="w-0.5 h-4 bg-sky-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.2s]"></span>
                <span className="w-0.5 h-6 bg-blue-400 rounded-full animate-[pulse_0.3s_ease-in-out_infinite_0.15s]"></span>
                <span className="w-0.5 h-3 bg-indigo-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.05s]"></span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  toggleVoiceListen();
                  if (input.trim()) {
                    handleSendMessage();
                  }
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Done & Send
              </button>
              <button
                onClick={toggleVoiceListen}
                className="px-2 py-1 rounded-lg text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                Stop
              </button>
            </div>
          </div>
          {interimTranscript && (
            <p className="text-xs text-zinc-400 italic bg-black/40 p-2 rounded-lg border border-white/5">
              "{interimTranscript}"
            </p>
          )}
        </div>
      )}

      {/* Clean AI Text Box — Static, Rock-Solid without Distracting Animations */}
      <div className="w-full relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && !isLoading) {
              handleSendMessage();
            }
          }}
          className={`bg-[#0d1017] border border-zinc-800 focus-within:border-blue-500/80 rounded-2xl flex items-center gap-2 shadow-lg shrink-0 ${
            isCompactMode ? 'p-1.5 sm:p-2' : 'p-2 sm:p-2.5'
          }`}
        >
          {/* Mic Speech Button (Clean & Static) */}
          <button
            type="button"
            onClick={toggleVoiceListen}
            className={`p-2 sm:p-2.5 rounded-xl shrink-0 cursor-pointer transition-colors ${
              mic.state === 'live' || isListening 
                ? 'bg-rose-600 text-white' 
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title={mic.state === 'live' || isListening ? 'Stop listening' : 'Voice Assistant'}
          >
            {mic.state === 'live' || isListening ? (
              <MicOff className="w-4 h-4 text-white" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Quick History Toggle Button */}
          <button
            type="button"
            onClick={() => setShowRecentSidebar(prev => !prev)}
            className={`p-2 sm:p-2.5 rounded-xl transition-colors shrink-0 cursor-pointer ${
              showRecentSidebar
                ? 'bg-blue-600/25 text-sky-400 border border-blue-500/70'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
            }`}
            title="Toggle Recent Questions sidebar"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Input Text Field — Static & Clean, Zero Animations */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onClick={() => {
              if (!currentUser) {
                onOpenAuthModal('login');
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!currentUser) {
                  onOpenAuthModal('login');
                  return;
                }
                if (input.trim() && !isLoading) {
                  handleSendMessage();
                }
              }
            }}
            placeholder={
              !currentUser
                ? '🔒 Student Sign In Required — Click to login with your Register Number...'
                : isListening || mic.state === 'live'
                ? (interimTranscript ? `Heard: "${interimTranscript}"...` : 'Listening... Speak your question now...')
                : 'Ask any question (courses, credits, tuition, exams, hostel, scholarships)... (Press Enter)'
            }
            className={`flex-1 bg-[#11141e] border border-zinc-800 rounded-xl px-3.5 sm:px-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 ${
              isCompactMode ? 'py-2 text-xs sm:text-sm' : 'py-2.5 sm:py-3 text-sm'
            }`}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!input.trim() && !!currentUser) || isLoading}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-900 disabled:text-zinc-600 text-white font-semibold text-xs flex items-center gap-2 shrink-0 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            <span>{!currentUser ? 'Sign In' : 'Send'}</span>
            {!currentUser ? <Lock className="w-3.5 h-3.5 text-amber-300" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </form>

        {/* Live Mic Status Banner below text box when mic is active (Non-distracting) */}
        {(mic.state === 'live' || isListening) && (
          <div className="mt-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{interimTranscript ? `"${interimTranscript}"` : 'Microphone active — Listening to your question...'}</span>
            </div>
            <button
              type="button"
              onClick={toggleVoiceListen}
              className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold"
            >
              Stop Mic
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-[9px] text-zinc-600 uppercase tracking-[0.2em] shrink-0 py-0.5">
        End-to-End Encryption • AI Concierge v2.4 • Cosine Similarity Vector Index
      </p>

      {/* NLP Detail Modal */}
      <NLPDetailModal
        nlpData={activeModalNLP}
        onClose={() => setActiveModalNLP(null)}
      />

      {/* Export / Download Chat History Modal */}
      <ExportPdfModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        messages={messages}
        currentUser={currentUser}
        selectedDepartment={selectedDept}
      />

    </div>
  );
};
