import React, { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Search, 
  Clock, 
  Layers, 
  GraduationCap, 
  MessageSquareText, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { StudentUser } from '../types';
import { KalasalingamLogo } from './KalasalingamLogo';

interface AcademicsViewProps {
  currentUser?: StudentUser | null;
  onAskAcademicQuestion?: (query: string) => void;
  onNavigateToChat?: () => void;
}

export const AcademicsView: React.FC<AcademicsViewProps> = ({
  currentUser,
  onAskAcademicQuestion,
  onNavigateToChat
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'credits' | 'certifications' | 'departments' | 'grading' | 'regulations2025'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const academicDirectives = [
    {
      id: 'dir-reg-2025-overview',
      category: 'regulations2025',
      title: 'B.Tech Regulations 2025 & Degree Structure',
      badge: 'Academic Council Approved',
      badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
      description: 'Official KARE B.Tech Academic Regulations 2025 (effective AY 2025-26) across engineering branches.',
      details: [
        'Regular B.Tech (4 Years / 8 Semesters): Minimum 160 credits + 3 Mandatory non-credit courses (Foundation: 35 FCM + 5 FCE; Program: 70 PCM with 10 Capstone + 18 PCE; Skill Enhancement: 2-4 SEM + 12-14 SEE; Multidisciplinary: 6 MDM with EXSEL + 10 MDE).',
        'Lateral Entry (3 Years / 6 Semesters): Minimum 120 credits (Foundation: 5; Program: 65 PCM with 10 Capstone + 18 PCE; Skill: 2-4 SEM + 12-14 SEE; Multidisciplinary: 6 MDM + 10 MDE).',
        'Maximum Duration: N + 2 years (6 years for Regular, 5 years for Lateral). Exceptional 1-year extension possible with Vice-Chancellor approval.',
        'Semester Credit Limits: Minimum 18 credits, maximum 25 credits per semester. Re-registration capped at 8 credits per semester.'
      ],
      query: 'What are the credit requirements and duration for B.Tech under Regulations 2025?'
    },
    {
      id: 'dir-reg-2025-grading',
      category: 'regulations2025',
      title: '10-Point Hybrid Grading Approach (HGA)',
      badge: 'Dual Grading Engine',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
      description: 'Grades are computed using BOTH Relative Grading and Absolute Grading, awarding the HIGHER outcome to the student.',
      details: [
        'Absolute Grading Scale: S (>= 90, 10 pts), A (80-89, 9 pts), B (70-79, 8 pts), C (60-69, 7 pts), D (50-59, 6 pts), E (40-49, 5 pts), U (< 40, Fail/Re-appear).',
        'Relative Grading Scale: Evaluated using Z-score normal distribution against cohort percentiles (S: P >= 95, A: 80 <= P < 95, B: 55 <= P < 80, C: 25 <= P < 55, D: 15 <= P < 25, E: 10 <= P < 15, U: P < 10).',
        'Student Benefit: The Hybrid Grading Approach (HGA) automatically assigns whichever grade outcome is higher between relative and absolute.',
        'Degree Classification: First Class with Distinction requires minimum CGPA 8.25 (cleared all courses in first attempt within minimum duration). First Class requires minimum CGPA 6.5 within N+2 years.'
      ],
      query: 'How does the Hybrid Grading Approach work under KARE B.Tech Regulations 2025?'
    },
    {
      id: 'dir-reg-2025-honours-minors',
      category: 'regulations2025',
      title: 'Honours (4 Pathways) & Minors Programs',
      badge: 'Specialized Pathways',
      badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
      description: 'Advanced credentialing tracks for high-performing engineering students.',
      details: [
        'Honours Eligibility: Minimum CGPA 8.25 with NO history of arrears.',
        'Case 1 (Domain Honours): Complete additional 20 credits in Level 4+ advanced courses (minimum B grade).',
        'Case 2 (Honours in Research): 5–6 month research project from 5th semester resulting in a first-author paper in a SCIE indexed peer-reviewed journal (= 20 credits equivalent).',
        'Case 3 (Honours in Innovation): 5–6 month product development under IEDC, filing a patent and establishing a campus startup.',
        'Case 4 (Honours in Industry Practice): Semester-long stipend-based corporate internship approved by Corporate Office.',
        'Minors Program: Complete 20 additional credits in a multidisciplinary domain outside your major; separate Minor CGPA printed on transcript.'
      ],
      query: 'What are the eligibility criteria and four options for B.Tech with Honours?'
    },
    {
      id: 'dir-reg-2025-nep-exit',
      category: 'regulations2025',
      title: 'NEP-2020 Multiple Entry & Exit Framework',
      badge: 'National Education Policy',
      badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
      description: 'Flexible progressive qualifications and seamless re-entry options.',
      details: [
        'Exit 1 (Year 1, NCrF 4.5): UG Certificate in Engineering (40 credits + 4 credits vocational skill summer course).',
        'Exit 2 (Year 2, NCrF 5.0): UG Diploma in Engineering (80 credits + 4 credits vocational skill summer course, with >= 40% program courses).',
        'Exit 3 (Year 3, NCrF 5.5): B.Sc. (Eng) Degree (120 credits with >= 80% program courses).',
        'Exit 4 (Year 4, NCrF 6.0): Full B.Tech Degree (160 credits + mandatory courses).',
        'Re-entry Privilege: Exited candidates can re-enter within 3 years with full credit transfer. Maximum total duration from initial enrolment is 7 years.'
      ],
      query: 'What are the NEP-2020 multiple exit and re-entry options under Regulations 2025?'
    },
    {
      id: 'dir-reg-2025-attendance',
      category: 'regulations2025',
      title: 'Attendance (75%) & Condonation Rules (65%)',
      badge: 'Attendance Policy',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
      description: 'Strict attendance accounting for continuous assessments and end-semester examinations.',
      details: [
        'Mandatory Attendance: Minimum 75% attendance in each course to write continuous assessments and semester end examinations.',
        'Condonation Range: Students securing between 65% and 74.99% attendance who availed prior medical leave can apply for condonation.',
        'Application Procedure: Apply at least 2 days prior to last working day with medical certificates from authorized physician; approved by Vice-Chancellor via HoD.',
        'Below 65%: Grade W (Failure for want of attendance); student must re-register the course.'
      ],
      query: 'What are the attendance requirements and condonation rules under B.Tech Regulations 2025?'
    },
    {
      id: 'dir-reg-2025-assessment',
      category: 'regulations2025',
      title: 'Evaluation Schemes & Course Types (CA vs SEE)',
      badge: 'Exam Weightages',
      badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
      description: 'Course-specific evaluation splits across Theory, Practical, Integrated, and Skill Courses.',
      details: [
        'Theory Course (TC): 50% CA (2 Sessional Exams 35% + 2 Assignments/Projects 15%) + 50% SEE (180 mins).',
        'Practical Course (PC): 70% CA (Mid-sem practical 20% + Group tasks 30% + Lab 20%) + 30% SEE (180 mins).',
        'Integrated Theory (IC-T): 50% CA (Sessional 35% + Mid-sem practical 10% + Lab 5%) + 50% SEE (Theory 35% + Practical 15%).',
        'Integrated Practical (IC-P): 70% CA (Mid-sem practical 20% + Sessional 10% + Group tasks 20% + Lab 20%) + 30% SEE (Project 20% + Viva 10%).',
        'Skill Course (SC): 60% CA (2 Quizzes 20% + 3 Experimental exams 40%) + 40% SEE.',
        'Capstone Project (10 credits): 70% CA (2 committee reviews 50% + Guide 20%) + 30% SEE (3-member committee).'
      ],
      query: 'What is the continuous assessment and semester end exam evaluation scheme for each course type?'
    },
    {
      id: 'dir-1',
      category: 'credits',
      title: '25-Credit Semester Ceiling Policy',
      badge: 'Mandatory Rule',
      badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
      description: 'For 2024 and earlier batches, the total registered credits in a single semester cannot exceed 25 credits.',
      details: [
        'Included Categories (Cannot exceed 25 credits combined): University Elective (UE), Program Elective (PE), Program Core (PC), Foundation Core (FC), Experiential Elective (EE), and Experiential Core (EC).',
        'NPTEL Courses: Credits earned via approved NPTEL / SWAYAM MOOCs can ONLY be claimed under University Elective Courses (UE). Under Regulations 2025, up to 20% total credits can be earned via MOOCs.',
        'Exemption: Group 2 and Group 3 certifications are strictly exempt from the 25-credit cap and can exceed the semester ceiling.'
      ],
      query: 'What is the semester credit limit and which courses count toward the 25 credit cap?'
    },
    {
      id: 'dir-2',
      category: 'certifications',
      title: 'Group 2 & Group 3 Certification Requirements',
      badge: 'Batch Specific',
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60',
      description: 'Activity-based certification standards differentiating 2024 & earlier vs 2025 & subsequent batches.',
      details: [
        '2024 & Earlier Batches: 5 certificates required for Group 3 (Co-curricular) and 7 certificates required for Group 2 (Extra-curricular). Certificates may be earned from different student clubs.',
        '2025 & Subsequent Batches: Must complete a total of 10 certificates combined across Group 2 and Group 3. All 10 certificates must be completed from the SAME club.',
        'Credit Exemption: Group 2 & 3 certificates do not count towards the 25-credit semester ceiling.'
      ],
      query: 'How many certificates do students need to complete under Group 2 and Group 3 activities?'
    },
    {
      id: 'dir-3',
      category: 'credits',
      title: 'Experiential Elective (EE) Hackathon Credits',
      badge: 'Universal Directive',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
      description: 'Hands-on experiential learning through competitive hackathons and technical project conferences.',
      details: [
        'Students of ALL batches must complete a minimum of 8 EE credits before their 6th semester.',
        'Credits are earned through registered National & International Hackathons, Ideathons, IEEE/ACM paper presentations, and Department-approved prototyping bootcamps.',
        'EE submissions are verified by Department Faculty Advisory and Dean Academic Office.'
      ],
      query: 'How many Experiential Elective EE credits are required and what is the deadline?'
    },
    {
      id: 'dir-5',
      category: 'departments',
      title: 'Academic Schools & Degree Programs',
      badge: 'Schools',
      badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
      description: 'Accredited engineering and computing curriculum under NAAC A++ and NBA guidelines.',
      details: [
        'School of Computing: B.Tech CSE with specializations in AI & ML, Cyber Security, Data Analytics, IoT, and Cloud Systems.',
        'School of Electrical Sciences: B.Tech ECE, EEE with VLSI, Embedded Systems, and Robotics laboratories.',
        'School of Mechanical & Bio-Sciences: B.Tech Mechanical, Biotechnology, Food Technology & Biomedical Engineering.',
        'School of Civil & Environmental: B.Tech Civil Engineering with Smart Infrastructure and BIM.'
      ],
      query: 'What undergraduate engineering programs are offered at KARE?'
    }
  ];

  const filteredDirectives = academicDirectives.filter(item => {
    const matchesSection = activeSection === 'all' || item.category === activeSection;
    const matchesSearch = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSection && matchesSearch;
  });

  const handleAsk = (query: string) => {
    if (onAskAcademicQuestion) {
      onAskAcademicQuestion(query);
    } else if (onNavigateToChat) {
      onNavigateToChat();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-5 space-y-6">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b0c14] via-[#10121d] to-[#0c0d16] border border-blue-500/20 p-5 sm:p-7 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <KalasalingamLogo size="sm" variant="badge" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 font-mono hidden sm:inline-block">
                Academic Regulations 2025
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Academic Directives & Curriculum Portal
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
              Consolidated course credit ceilings, Group 2 & 3 club certification rules, Experiential Electives (EE), and evaluation policies for Kalasalingam Academy of Research and Education.
            </p>
          </div>

          <button
            onClick={() => handleAsk('What are the key academic credit rules and regulations at KARE?')}
            className="self-start md:self-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all shrink-0 cursor-pointer"
          >
            <MessageSquareText className="w-4 h-4" />
            <span>Consult Academic Bot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0a0a0a] border border-zinc-800/90 rounded-2xl p-2.5 sm:px-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin scrollbar-thumb-zinc-800">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeSection === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            All Regulations ({academicDirectives.length})
          </button>
          <button
            onClick={() => setActiveSection('regulations2025')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeSection === 'regulations2025'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/40 border border-cyan-900/50'
            }`}
          >
            ★ Regulations 2025 (PDF)
          </button>
          <button
            onClick={() => setActiveSection('credits')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeSection === 'credits'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            Credit Limits & EE
          </button>
          <button
            onClick={() => setActiveSection('certifications')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeSection === 'certifications'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            Group 2 & 3 Certifications
          </button>
          <button
            onClick={() => setActiveSection('grading')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeSection === 'grading'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            Grading & Exams
          </button>
          <button
            onClick={() => setActiveSection('departments')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeSection === 'departments'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            Schools & Programs
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules, credits, limits..."
            className="w-full bg-[#121212] border border-zinc-800 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500/60"
          />
        </div>
      </div>

      {/* Directives Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDirectives.map((item) => (
          <div 
            key={item.id}
            className="bg-[#0b0b0f] border border-zinc-800 hover:border-blue-500/40 rounded-2xl p-4 sm:p-5 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">
                  {item.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <ul className="space-y-1.5 pt-1">
                {item.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Dean Academic Approved
              </span>

              <button
                onClick={() => handleAsk(item.query)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/40 transition-all cursor-pointer"
              >
                <span>Ask AI Details</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDirectives.length === 0 && (
        <div className="p-8 text-center bg-[#0b0b0f] border border-zinc-800 rounded-2xl space-y-2">
          <p className="text-sm text-zinc-400">No academic directives match "{searchQuery}".</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-blue-400 hover:underline font-semibold"
          >
            Clear search query
          </button>
        </div>
      )}

      {/* Quick Summary Reference Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 space-y-2">
        <div className="flex items-center gap-2 text-zinc-200 font-semibold">
          <AlertCircle className="w-4 h-4 text-blue-400" />
          <span>Quick Academic Reference Checklist</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
          <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
            <strong className="text-zinc-200 block mb-0.5">25 Credits Ceiling</strong>
            Applies to UE + PE + PC + FC + EE + EC per semester for 2024 & earlier batches.
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
            <strong className="text-zinc-200 block mb-0.5">NPTEL Equivalency</strong>
            NPTEL credits can exclusively be transferred under University Elective (UE) courses.
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
            <strong className="text-zinc-200 block mb-0.5">8 EE Credits Deadline</strong>
            All students must accrue 8 Experiential Elective credits from hackathons before Semester 6.
          </div>
        </div>
      </div>

    </div>
  );
};
