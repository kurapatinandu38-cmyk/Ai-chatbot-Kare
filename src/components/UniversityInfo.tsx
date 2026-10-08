import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  Clock, 
  UserCheck, 
  MapPin, 
  Calendar, 
  Users, 
  GraduationCap, 
  ShieldAlert
} from 'lucide-react';
import { UniversityDepartmentInfo } from '../types';
import { KalasalingamLogo } from './KalasalingamLogo';
import { openFacultyGmail } from '../utils/gmailHelper';

const DEFAULT_UNIVERSITY_INFO = {
  name: 'KARE (Kalasalingam Academy of Research and Education)',
  motto: 'Empowering Minds, Inspiring Innovation & Research',
  established: 1984,
  location: 'Anand Nagar, Krishnankoil, Tamil Nadu',
  departments: [
    {
      name: 'Admissions',
      email: 'admissions@kare.ac.in',
      phone: '+91 4563 289 042',
      building: 'Administrative Block, Ground Floor',
      hours: 'Mon-Sat 9:00 AM - 5:00 PM',
      head: 'Director of Admissions',
      description: 'Handles undergraduate, postgraduate, B.Tech, M.Tech, and research admissions.'
    },
    {
      name: 'Academics',
      email: 'dean.academic@kare.ac.in',
      phone: '+91 4563 289 045',
      building: 'Deanery of Academics, Main Block',
      hours: 'Mon-Sat 9:00 AM - 4:30 PM',
      head: 'Dean of Academic Affairs',
      description: 'Curriculum regulations, 25-credit semester caps, UE/PE/PC/FC/EE/EC course allocations, NPTEL credits, and Group 2/3 certifications.'
    },
    {
      name: 'Financial Aid & Tuition',
      email: 'finance@kare.ac.in',
      phone: '+91 4563 289 050',
      building: 'Finance Office, Admin Wing',
      hours: 'Mon-Fri 9:00 AM - 4:00 PM',
      head: 'Finance Officer',
      description: 'Fee payment receipts, merit scholarships, educational loans, and installment plans.'
    },
    {
      name: 'Housing & Dining',
      email: 'hostel@kare.ac.in',
      phone: '+91 4563 289 060',
      building: 'Chief Warden Office, Hostel Complex',
      hours: 'Mon-Sun 8:00 AM - 8:00 PM',
      head: 'Chief Warden',
      description: 'Student hostel allotments, dining mess registration, and residential facilities.'
    },
    {
      name: 'Campus Life & Facilities',
      email: 'studentaffairs@kare.ac.in',
      phone: '+91 4563 289 070',
      building: 'Student Activity Center',
      hours: 'Mon-Sat 8:00 AM - 9:00 PM',
      head: 'Dean of Student Affairs',
      description: 'Student clubs, Group 2 & Group 3 co-curricular & extra-curricular activities, hackathons, and sports.'
    },
    {
      name: 'IT Support & Library',
      email: 'helpdesk@kare.ac.in',
      phone: '+91 4563 289 080',
      building: 'Central Library & IT Data Center',
      hours: '24/7 Digital Portal / Library 8:00 AM - 10:00 PM',
      head: 'IT Director & Chief Librarian',
      description: 'Campus Wi-Fi login, student portal accounts, digital library access, and e-learning resources.'
    }
  ],
  stats: {
    totalStudents: 16500,
    undergradCount: 13200,
    postgradCount: 3300,
    facultyRatio: '15:1',
    acceptanceRate: 'NAAC A+ Accredited',
    campusSize: '400+ acres'
  }
};

export const UniversityInfo: React.FC = () => {
  const [info, setInfo] = useState<any>(DEFAULT_UNIVERSITY_INFO);

  useEffect(() => {
    fetch('/api/university/info')
      .then(res => {
        if (res.ok) return res.json();
        return null;
      })
      .then(data => {
        if (data) setInfo(data);
      })
      .catch(() => {
        // Quietly fallback to default preloaded info
      });
  }, []);

  if (!info) {
    return (
      <div className="p-12 text-center text-zinc-500 font-mono text-xs">
        Loading university directory...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 text-zinc-100">
      
      {/* Header Banner */}
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <KalasalingamLogo size="lg" variant="badge" />
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">{info.name}</h2>
              <p className="text-xs text-zinc-400 mt-1 italic font-serif">
                "{info.motto}" — Est. {info.established}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{info.location}</span>
          </div>
        </div>
      </div>

      {/* Official 3D Monument View Showcase */}
      <div className="w-full">
        <KalasalingamLogo variant="3d-showcase" />
      </div>

      {/* Quick Campus Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-[#0a0a0a] border border-[#222222] rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Total Enrollment</span>
            <span className="text-base font-bold text-white font-mono">{info.stats.totalStudents.toLocaleString()} Students</span>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#222222] rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Faculty Ratio</span>
            <span className="text-base font-bold text-white font-mono">{info.stats.facultyRatio}</span>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#222222] rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Acceptance Rate</span>
            <span className="text-base font-bold text-white font-mono">{info.stats.acceptanceRate}</span>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#222222] rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Campus Grounds</span>
            <span className="text-base font-bold text-white font-mono">{info.stats.campusSize}</span>
          </div>
        </div>

      </div>

      {/* Emergency Contacts Banner */}
      <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-rose-200">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <span><strong>24/7 Campus Emergency Hotline:</strong> (555) 019-4444 or Extension 4444 from any campus phone</span>
        </div>
        <span className="font-mono text-rose-300 bg-rose-950/60 px-2.5 py-1 rounded border border-rose-800">
          Police / Health Emergency: Call 911
        </span>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {info.departments.map((dept: UniversityDepartmentInfo, idx: number) => (
          <div
            key={idx}
            className="bg-[#0a0a0a] border border-[#222222] hover:border-zinc-700 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-colors shadow-lg"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
                {dept.name}
              </span>
              <h3 className="text-base font-bold text-white">{dept.building}</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {dept.description}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#222222] text-xs text-zinc-400 font-medium">
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>Head: <strong className="text-zinc-200 font-normal">{dept.head}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <button
                  type="button"
                  onClick={() => openFacultyGmail({ to: dept.email, department: dept.name, subject: `Inquiry to ${dept.name} - Kalasalingam University` })}
                  className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 cursor-pointer font-mono text-[11px]"
                  title="Click to compose in Gmail"
                >
                  <span>{dept.email}</span>
                  <span className="text-[9px] text-zinc-500 font-sans">(Gmail)</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{dept.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{dept.hours}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
