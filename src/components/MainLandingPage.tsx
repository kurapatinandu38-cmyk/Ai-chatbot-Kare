import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  User, 
  MessageSquareText, 
  GraduationCap, 
  BookOpen, 
  HelpCircle, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Mic, 
  MicOff,
  Bot,
  Mail,
  UserCheck
} from 'lucide-react';
import { VoiceBeam, useMicrophone } from 'voice-glow';
import cosmicHeroImg from '../assets/images/cosmic_window_hero_1790864034135.jpg';
import { StudentUser, AdminUser } from '../types';
import { KalasalingamLogo } from './KalasalingamLogo';
import { playTactileClick, playWhoosh, play3DCardInteract, playButtonPop } from '../utils/soundEffects';

interface MainLandingPageProps {
  onNavigateTab: (tab: 'home' | 'chat' | 'nlp' | 'faqs' | 'admin' | 'admissions' | 'academics' | 'faculty') => void;
  onOpenStudentLogin: () => void;
  onOpenStudentRegister: () => void;
  onOpenAdminLogin: () => void;
  onOpenUnifiedLogin?: (initialRole?: 'student' | 'faculty') => void;
  currentUser: StudentUser | null;
  currentAdmin: AdminUser | null;
}

export const MainLandingPage: React.FC<MainLandingPageProps> = ({
  onNavigateTab,
  onOpenStudentLogin,
  onOpenStudentRegister,
  onOpenAdminLogin,
  onOpenUnifiedLogin,
  currentUser,
  currentAdmin
}) => {
  const landingMic = useMicrophone();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'TA' | 'TE' | 'HI'>('EN');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Simplified, high-intent campus service options
  const campusOptions = [
    {
      id: 'chat',
      title: 'AI Campus Assistant',
      tag: '24/7 AI Chatbot',
      tagColor: 'border-cyan-500/30 text-cyan-300 bg-cyan-950/30',
      description: 'Ask any question regarding admissions, hostel room allotment, fee concessions, course registrations, and semester exams.',
      buttonText: 'Start Chatting',
      icon: Bot,
      iconColor: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      onClick: () => {
        if (currentUser) {
          onNavigateTab('chat');
        } else {
          onOpenStudentLogin();
        }
      }
    },
    {
      id: 'admissions',
      title: 'Admissions & Scholarships',
      tag: 'Up to 75% Fee Waiver',
      tagColor: 'border-emerald-500/30 text-emerald-300 bg-emerald-950/30',
      description: 'Calculate your annual tuition concession based on intermediate board marks, verify branch cutoffs, and submit applications.',
      buttonText: 'Check Eligibility',
      icon: GraduationCap,
      iconColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      onClick: () => onNavigateTab('admissions')
    },
    {
      id: 'academics',
      title: 'B.Tech Regulations 2025',
      tag: 'Curriculum & Credits',
      tagColor: 'border-indigo-500/30 text-indigo-300 bg-indigo-950/30',
      description: 'Explore the 165-credit B.Tech curriculum structure, relative grading scale (10.0 CGPA), and course rules.',
      buttonText: 'View Syllabus',
      icon: BookOpen,
      iconColor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
      onClick: () => onNavigateTab('academics')
    },
    {
      id: 'faculty',
      title: 'Faculty Members & Mail Directory',
      tag: 'Official @kare.ac.in Mail IDs',
      tagColor: 'border-blue-500/30 text-blue-300 bg-blue-950/30',
      description: 'Explore full profiles of university professors, department heads, and faculty advisors with verified institutional email addresses and office hours.',
      buttonText: 'View Faculty Directory',
      icon: UserCheck,
      iconColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      onClick: () => onNavigateTab('faculty')
    },
    {
      id: 'faqs',
      title: 'Campus Knowledge Base',
      tag: 'Verified FAQs',
      tagColor: 'border-amber-500/30 text-amber-300 bg-amber-950/30',
      description: 'Browse quick official answers on campus Wi-Fi, mess dining, library access, bus routes, sports facilities, and hostel rules.',
      buttonText: 'Browse FAQs',
      icon: HelpCircle,
      iconColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      onClick: () => onNavigateTab('faqs')
    }
  ];

  // Simple search filter
  const filteredOptions = searchQuery.trim() === ''
    ? campusOptions
    : campusOptions.filter(o => 
        o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans relative selection:bg-blue-600 selection:text-white flex flex-col">
      
      {/* ============================================================== */}
      {/* 1. TOP NAVIGATION BAR (Clean & Focused Navigation)             */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.06] transition-all">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          
          {/* Center / Left Navigation Links: Clean, easy to read */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <button 
              onClick={() => onNavigateTab('home')}
              className="text-white font-semibold transition-colors cursor-pointer hover:text-blue-400"
            >
              Home
            </button>
            <span className="text-zinc-600 text-xs">·</span>
            
            <button 
              onClick={() => onNavigateTab('chat')}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              AI Assistant
            </button>
            <span className="text-zinc-600 text-xs">·</span>
            
            <button 
              onClick={() => onNavigateTab('admissions')}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              Admissions & Fees
            </button>
            <span className="text-zinc-600 text-xs">·</span>
            
            <button 
              onClick={() => onNavigateTab('academics')}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              Academics
            </button>
            <span className="text-zinc-600 text-xs">·</span>

            <button 
              onClick={() => onNavigateTab('faculty')}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Faculty & Mail IDs</span>
            </button>
            <span className="text-zinc-600 text-xs">·</span>
            
            <button 
              onClick={() => onNavigateTab('faqs')}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              FAQs
            </button>
          </nav>

          {/* Right Controls: Only ONE clean Login button */}
          <div className="flex items-center gap-3">
            {!currentUser && !currentAdmin ? (
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenUnifiedLogin) onOpenUnifiedLogin('student');
                    else onOpenStudentLogin();
                  }}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white text-xs font-semibold shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                  id="top-login-btn"
                  title="Login - Access Student Portal or Faculty Console"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              </div>
            ) : currentUser ? (
              <button
                type="button"
                onClick={() => onNavigateTab('chat')}
                className="px-3 py-1.5 rounded-xl bg-blue-950/80 border border-blue-700/60 text-blue-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>{currentUser.name.split(' ')[0]} (Student)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigateTab('admin')}
                className="px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentAdmin?.name?.split(' ')[0] || 'Faculty'} (Console)</span>
              </button>
            )}
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer py-1 px-2 rounded-lg bg-white/5 border border-white/10"
              >
                <span>{language}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-[#12141c] border border-white/10 rounded-xl shadow-2xl p-1 z-50 text-xs">
                  {(['EN', 'TA', 'TE', 'HI'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        language === lang ? 'bg-white/10 text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {lang === 'EN' ? 'English' : lang === 'TA' ? 'Tamil' : lang === 'TE' ? 'Telugu' : 'Hindi'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Icon */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-zinc-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-zinc-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/[0.08] bg-[#0c0e14] px-6 py-5 space-y-3"
            >
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button 
                  onClick={() => { onNavigateTab('home'); setIsMobileMenuOpen(false); }}
                  className="p-3 bg-white/[0.04] rounded-xl text-left font-medium text-white"
                >
                  Home
                </button>
                <button 
                  onClick={() => { onNavigateTab('chat'); setIsMobileMenuOpen(false); }}
                  className="p-3 bg-white/[0.04] rounded-xl text-left font-medium text-white flex items-center justify-between"
                >
                  <span>AI Assistant</span>
                  <Bot className="w-4 h-4 text-cyan-400" />
                </button>
                <button 
                  onClick={() => { onNavigateTab('admissions'); setIsMobileMenuOpen(false); }}
                  className="p-3 bg-white/[0.04] rounded-xl text-left font-medium text-white flex items-center justify-between"
                >
                  <span>Admissions</span>
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                </button>
                <button 
                  onClick={() => { onNavigateTab('academics'); setIsMobileMenuOpen(false); }}
                  className="p-3 bg-white/[0.04] rounded-xl text-left font-medium text-white flex items-center justify-between"
                >
                  <span>Academics</span>
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                </button>
                <button 
                  onClick={() => { onNavigateTab('faculty'); setIsMobileMenuOpen(false); }}
                  className="p-3 bg-white/[0.04] rounded-xl text-left font-medium text-white flex items-center justify-between col-span-2"
                >
                  <span>Faculty Members & Mail IDs</span>
                  <UserCheck className="w-4 h-4 text-blue-400" />
                </button>
              </div>

              <div className="pt-2 border-t border-white/[0.08]">
                <button
                  onClick={() => { 
                    if (onOpenUnifiedLogin) onOpenUnifiedLogin('student');
                    else onOpenStudentLogin(); 
                    setIsMobileMenuOpen(false); 
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 rounded-xl text-xs font-semibold text-white text-center flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
                  id="mobile-unified-login-btn"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ============================================================== */}
      {/* 2. MAIN HERO SECTION (Kalasalingam Logo Above Quotation & World Image in Middle) */}
      {/* ============================================================== */}
      <section className="relative w-full min-h-[calc(100vh-5rem)] flex items-center overflow-hidden border-b border-white/[0.06] py-8 sm:py-12">
        
        <div className="max-w-[1520px] mx-auto w-full px-4 sm:px-8 relative z-10 flex flex-col items-center">
          
          {/* Top Headline & Manifesto Centerpiece */}
          <div className="max-w-4xl w-full mx-auto text-center mb-6 sm:mb-8 flex flex-col items-center">
            
            {/* 1. Official Kalasalingam 3D Logo Banner (Above Quotation / Coteshan) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => {
                play3DCardInteract();
                onNavigateTab('home');
              }}
              onMouseEnter={() => playWhoosh(0.03)}
              className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto mb-4 sm:mb-6 cursor-pointer group"
              title="Kalasalingam Academy of Research and Education"
            >
              <KalasalingamLogo variant="hero-banner" className="w-full" />
            </motion.div>

            {/* Official University Accreditation & Support Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-3 mb-4 w-fit bg-gradient-to-r from-blue-950/60 via-slate-900/60 to-[#070b14] border border-blue-500/30 rounded-2xl py-1.5 px-4 backdrop-blur-md shadow-lg shadow-blue-950/30"
            >
              <div className="flex -space-x-1.5 items-center">
                <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 border border-[#050505] shadow-sm inline-block" />
                <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border border-[#050505] shadow-sm inline-block" />
                <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-sky-400 to-cyan-500 border border-[#050505] shadow-sm inline-block" />
              </div>

              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                <span>15,000+ Students Supported</span>
                <span className="w-1 h-1 rounded-full bg-blue-400" />
                <span className="text-amber-300 font-mono text-[10px]">NAAC A++ • NIRF Ranked</span>
              </span>
            </motion.div>

            {/* 3D Headline with Unique Words (Quotation / Coteshan) */}
            <h1 className="text-3d-title text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.12] mb-3">
              <span>“Explore </span>
              <span className="text-3d-gradient">Campus Life,</span>
              <br />
              <span className="text-3d-accent font-serif-luxury italic font-light tracking-wide">
                The Effortless Way.”
              </span>
            </h1>

            {/* Unique Words Tagline & Manifesto Quote */}
            <div className="max-w-3xl mx-auto my-2 px-3 py-1 bg-gradient-to-r from-blue-950/30 via-slate-900/40 to-transparent rounded-xl border-l-2 sm:border-l-0 border-blue-500/60">
              <p className="text-xs sm:text-sm md:text-base text-zinc-200 font-normal leading-relaxed">
                <span className="text-sky-300 font-semibold font-serif italic">“Where Ambition Meets Boundless Innovation —</span> Unlock instant admissions scholarship eligibility, track 165-credit B.Tech academic milestones, and connect directly with verified faculty mentors across 400+ acres of world-class campus.”
              </p>
            </div>

            {/* Primary Action Buttons with Web Audio Feedback */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button 
                onClick={() => {
                  playButtonPop();
                  if (currentUser) {
                    onNavigateTab('chat');
                  } else {
                    onOpenStudentLogin();
                  }
                }}
                onMouseEnter={() => playTactileClick(0.03)}
                className="btn-3d-tactile group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-indigo-500 text-white px-7 py-3.5 rounded-xl border border-blue-400/30 font-bold text-xs tracking-wider uppercase transition-all shadow-xl shadow-blue-900/50 cursor-pointer active:scale-95"
              >
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-cyan-300 fill-cyan-300 animate-pulse" />
                </div>
                <span>START CAMPUS CHAT</span>
              </button>

              <button
                onClick={() => {
                  playTactileClick();
                  onNavigateTab('admissions');
                }}
                onMouseEnter={() => playTactileClick(0.03)}
                className="btn-3d-tactile inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 hover:text-white border border-amber-500/30 font-semibold text-xs transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <span>Check Scholarships (75%)</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>

            {/* 3D Dimensional Highlight Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-[10px] sm:text-xs">
              <button 
                onClick={() => {
                  playTactileClick(0.06);
                  onNavigateTab('home');
                }}
                onMouseEnter={() => playWhoosh(0.03)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/25 font-semibold transition-all cursor-pointer active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Official University Portal</span>
              </button>
              <button 
                onClick={() => {
                  playTactileClick(0.06);
                  onNavigateTab('admissions');
                }}
                onMouseEnter={() => playWhoosh(0.03)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 font-semibold transition-all cursor-pointer active:scale-95"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Up to 75% Merit Concessions</span>
              </button>
              <button 
                onClick={() => {
                  playTactileClick(0.06);
                  onNavigateTab('faculty');
                }}
                onMouseEnter={() => playWhoosh(0.03)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-rose-300 border border-red-500/25 font-semibold transition-all cursor-pointer active:scale-95"
              >
                <Mail className="w-3.5 h-3.5 text-rose-400" />
                <span>Direct Gmail Faculty Connect</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. ARCHITECTURAL OBSERVATORY WORLD IMAGE (In Respective Place, In Middle) */}
          {/* ============================================================== */}
          <div className="w-full max-w-5xl mx-auto my-4 sm:my-6 card-3d-wrapper">
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              onMouseEnter={() => playWhoosh(0.04)}
              onClick={() => play3DCardInteract()}
              className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] rounded-[36px] overflow-hidden border-[3px] border-[#2d251d] shadow-2xl shadow-black/90 group flex flex-col justify-end cursor-pointer"
            >
              <div className="absolute inset-0 rounded-[34px] border-[6px] border-[#443627]/60 pointer-events-none z-20" />
              
              <img 
                src={cosmicHeroImg} 
                alt="Observatory window overlooking space and planet world"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none z-10" />

              {/* Ambient Cosmic Aura */}
              <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-sky-500/20 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Top Accent for the Cosmic Window */}
              <div className="absolute top-5 left-6 right-6 z-20 flex items-center justify-between text-[11px] text-zinc-300">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Cosmic AI Observatory
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-black/60 px-2.5 py-1 rounded backdrop-blur-md">
                  Voice Interactive
                </span>
              </div>

              {/* Sound-Reactive Voice Card from Libraries.dev (voice-glow) */}
              <div className="relative z-20 p-4 sm:p-6">
                <VoiceBeam
                  stream={landingMic.stream}
                  level={() => (landingMic.state === 'live' ? 0.85 : 0.35)}
                  colorVariant="colorful"
                  colors={['#f43f5e', '#ec4899', '#a855f7', '#6366f1', '#06b6d4', '#10b981', '#f59e0b']}
                  theme="dark"
                  type="default"
                  strength={1}
                  glowSize={2.0}
                  brightness={1.8}
                  saturation={1.8}
                  reach={1.8}
                  bend={80}
                  idle={0.35}
                  bandStrength={2.5}
                  bandWidth={4}
                  active={true}
                  className="w-full"
                >
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/20 flex items-center justify-between relative z-[1]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-purple-500/40 flex items-center justify-center text-cyan-300">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          Voice Assistant (Voice Glow)
                        </span>
                        <span className="text-[10px] text-zinc-300 flex items-center gap-1.5">
                          {landingMic.state === 'live' ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                              <span className="text-pink-300 font-medium">Listening to voice input...</span>
                            </>
                          ) : (
                            'Speak questions directly to AI'
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Animated Bouncing Mini Waves when live */}
                      {landingMic.state === 'live' && (
                        <div className="hidden sm:flex items-center gap-1 h-4 px-2 py-0.5 rounded-md bg-zinc-900/90 border border-pink-500/30">
                          <span className="w-1 bg-rose-500 rounded-full animate-[bounce_0.5s_infinite_100ms] h-3" />
                          <span className="w-1 bg-fuchsia-500 rounded-full animate-[bounce_0.5s_infinite_200ms] h-4" />
                          <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.5s_infinite_150ms] h-3.5" />
                          <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.5s_infinite_300ms] h-2.5" />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playTactileClick(0.06);
                          if (landingMic.state === 'live') {
                            landingMic.stop();
                          } else {
                            landingMic.start();
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                          landingMic.state === 'live'
                            ? 'bg-gradient-to-r from-pink-600 via-fuchsia-600 to-rose-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.7)] border-pink-400/80 animate-pulse'
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                        }`}
                        title="Voice effect from Libraries.dev"
                      >
                        {landingMic.state === 'live' ? <MicOff className="w-3.5 h-3.5 text-white" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
                        <span>{landingMic.state === 'live' ? 'Stop' : 'Listen'}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playButtonPop();
                          if (currentUser) {
                            onNavigateTab('chat');
                          } else {
                            onOpenStudentLogin();
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                      >
                        <span>Chat</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </VoiceBeam>

                {/* Animated Voice Glow Spectrum Beam & Glowing Halo */}
                {landingMic.state === 'live' && (
                  <>
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 via-cyan-400 via-emerald-400 to-amber-400 blur-lg opacity-85 animate-pulse pointer-events-none z-10 shadow-[0_0_35px_rgba(217,70,239,0.85)]" />
                    <div className="absolute -bottom-1.5 left-4 right-4 h-2 bg-gradient-to-r from-pink-500 via-purple-500 via-cyan-400 via-emerald-400 to-amber-400 rounded-full blur-[2px] animate-pulse shadow-[0_0_25px_rgba(236,72,153,1)] z-30 pointer-events-none" />
                  </>
                )}
              </div>

            </motion.div>
          </div>

        </div>

        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      </section>

      {/* ============================================================== */}
      {/* 3. SIMPLIFIED "CAMPUS OPTIONS" (Easy to Understand)            */}
      {/* ============================================================== */}
      <section id="project-options-section" className="relative z-10 py-16 px-4 sm:px-8 max-w-[1520px] mx-auto w-full">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Campus Services & Portals
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl">
              Select any service below to get answers or access your student tools.
            </p>
          </div>
        </div>

        {/* 4 Clean, uncluttered 3D cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 card-3d-wrapper">
          {filteredOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <div
                key={opt.id}
                onMouseEnter={() => playWhoosh(0.03)}
                onClick={() => {
                  play3DCardInteract();
                  opt.onClick();
                }}
                className="card-3d-item group relative rounded-2xl bg-gradient-to-br from-[#0a0f1c]/90 via-[#070b14]/85 to-[#04060c] hover:border-blue-500/50 border border-white/[0.08] p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.3)] hover:scale-[1.02] cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${opt.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${opt.tagColor}`}>
                      {opt.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                    {opt.title}
                  </h3>

                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    {opt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playButtonPop();
                      opt.onClick();
                    }}
                    className="btn-3d-tactile w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-semibold border border-blue-500/30 hover:border-blue-400 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <span>{opt.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ============================================================== */}
      {/* 4. SEARCH MODAL                                                */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="relative w-full max-w-xl rounded-2xl bg-[#0c0e14] border border-white/15 p-6 shadow-2xl text-white"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="w-5 h-5 text-zinc-400" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses, scholarships, regulations..."
                    autoFocus
                    className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredOptions.map((opt) => (
                  <div 
                    key={opt.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      opt.onClick();
                    }}
                    className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="text-sm font-semibold text-white block">{opt.title}</span>
                      <span className="text-xs text-zinc-400">{opt.tag}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-400" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 5. FOOTER (Clean & Official University Branded)                */}
      {/* ============================================================== */}
      <footer className="border-t border-white/[0.06] bg-[#030303] text-zinc-400 py-8 px-4 sm:px-8 mt-auto">
        <div className="max-w-[1520px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <KalasalingamLogo size="sm" variant="badge" />
          </div>

          <div className="flex items-center gap-6 flex-wrap justify-center">
            <button onClick={() => onNavigateTab('chat')} className="hover:text-white transition-colors cursor-pointer">
              AI Chat
            </button>
            <button onClick={() => onNavigateTab('admissions')} className="hover:text-white transition-colors cursor-pointer">
              Admissions
            </button>
            <button onClick={() => onNavigateTab('academics')} className="hover:text-white transition-colors cursor-pointer">
              Academics
            </button>
            <button onClick={() => onNavigateTab('faculty')} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer">
              Faculty & Mail IDs
            </button>
            <button onClick={() => onNavigateTab('faqs')} className="hover:text-white transition-colors cursor-pointer">
              FAQs
            </button>
          </div>

          <div className="text-zinc-500 font-mono text-[11px]">
            © {new Date().getFullYear()} Kalasalingam Academy of Research and Education.
          </div>
        </div>
      </footer>

    </div>
  );
};
