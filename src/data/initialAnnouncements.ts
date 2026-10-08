import { AnnouncementItem } from '../types';

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-101',
    circularNumber: 'KARE/ADM/2026/CIR-142',
    title: 'Intermediate (+2) Marks Concession Application Deadline & Document Verification Schedule',
    category: 'Admissions & Concessions',
    priority: 'urgent',
    targetCohort: 'all',
    targetDepartment: 'All Undergraduate Programs',
    content: `All newly admitted and prospective 1st Year B.Tech, B.Sc, and BBA students are hereby informed that the final date to submit Intermediate / +2 Board Examination marks for automatic tuition fee concessions (up to 50% waiver for >95% marks) is September 15, 2026.

Key Action Items:
1. Upload your authenticated +2 / Intermediate Marks Memo on the Admissions Portal or present original certificates at the Admissions Office (Administrative Block, Ground Floor).
2. Concession waivers will be reflected directly on your annual tuition fee challan within 24 hours of verification.
3. Students requiring assistance may reach out to the Admissions Office at admissions@kare.ac.in or +91 4563 289 042.`,
    publishedAt: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
    authorName: 'Dr. V. Rajasekaran',
    authorRole: 'Dean of Admissions & Student Financial Aid',
    isPinned: true,
    actionUrl: '#admissions',
    actionLabel: 'Check Admissions & Concession Slabs',
    attachments: [
      { name: 'KARE_Concession_Guidelines_2026.pdf', size: '1.2 MB' },
      { name: 'Verification_Checklist.pdf', size: '480 KB' }
    ]
  },
  {
    id: 'ann-102',
    circularNumber: 'KARE/COE/2026/NOT-089',
    title: 'Odd Semester Mid-Term Examination Timetable & Digital Hall Ticket Distribution',
    category: 'Examinations & Results',
    priority: 'high',
    targetCohort: 'senior_year',
    targetDepartment: 'School of Computing & School of Electrical Sciences',
    content: `The Office of the Controller of Examinations (COE) has published the official schedule for the upcoming Continuous Internal Assessment (CIA-1 / Mid-Term Examinations).

Important Instructions for Students:
1. Hall tickets will be issued digitally through the student portal starting September 10, 2026.
2. A minimum of 75% attendance is mandatory to appear for the examinations. Condonation requests must be endorsed by the Head of Department before September 8.
3. Mobile phones, smartwatches, and programmable calculators are strictly prohibited in examination halls.`,
    publishedAt: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hours ago
    authorName: 'Prof. K. Sundararajan',
    authorRole: 'Controller of Examinations (COE)',
    isPinned: true,
    actionUrl: '#faqs',
    actionLabel: 'View Examination FAQs',
    attachments: [
      { name: 'MidTerm_CIA1_Timetable_Sep2026.pdf', size: '2.4 MB' }
    ]
  },
  {
    id: 'ann-103',
    circularNumber: 'KARE/OPT/2026/PL-055',
    title: 'Tier-1 Campus Recruitment Drive: Amazon, Cisco Systems & TCS Digital Registrations Open',
    category: 'Placements & Career',
    priority: 'high',
    targetCohort: 'senior_year',
    targetDepartment: 'CSE, ECE, IT, Mechanical & Data Science',
    content: `The Office of Placements & Training is pleased to announce the on-campus recruitment drive for 2026 graduating batches. Top tier companies including Amazon AWS (₹38.5 LPA), Cisco Systems (₹32.0 LPA), and TCS Digital (₹11.5 LPA) are conducting preliminary assessments.

Eligibility:
- CGPA 7.50 and above with no active standing backlogs.
- All eligible students must complete their profile verification on the Placement Portal by September 12, 2026, 5:00 PM.
- Mock technical coding and GD sessions commence this weekend at the Turing Computation Lab.`,
    publishedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    authorName: 'Dr. M. Senthil Kumar',
    authorRole: 'Director, Office of Placement & Industry Relations',
    isPinned: false,
    actionUrl: '#admissions',
    actionLabel: 'View Placement Track Records',
    attachments: [
      { name: 'Amazon_Cisco_Drive_Brochure.pdf', size: '3.1 MB' }
    ]
  },
  {
    id: 'ann-104',
    circularNumber: 'KARE/DSW/2026/HST-023',
    title: 'Hostel Room Allotment & Biometric Access Registration for 1st Year Freshers',
    category: 'Campus Life & Hostels',
    priority: 'normal',
    targetCohort: 'first_year',
    targetDepartment: 'All New Entrants',
    content: `All newly joined first-year students who have opted for residential accommodation are requested to complete room check-in and biometric thumbprint registration at their respective hostel warden offices:

- Men\'s Hostels: Bhabha Block & Raman Block (Chief Warden Desk)
- Women\'s Hostels: Kalpana Chawla Hall of Residence & Gargi Block

Please ensure you carry 2 passport-size photographs, fee receipt copy, and parent/guardian contact acknowledgment form. Special medical dietary requests can be registered with the Mess Committee during check-in.`,
    publishedAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    authorName: 'Dr. Ananya Murugan',
    authorRole: 'Chief Warden & Dean of Student Welfare',
    isPinned: false,
    attachments: [
      { name: 'Hostel_Rules_and_Mess_Menu.pdf', size: '1.8 MB' }
    ]
  },
  {
    id: 'ann-105',
    circularNumber: 'KARE/LIB/2026/GEN-011',
    title: 'University Central Library 24/7 Reading Hall & IEEE Xplore Digital Access Update',
    category: 'General Circular',
    priority: 'normal',
    targetCohort: 'all',
    targetDepartment: 'All Students & Research Scholars',
    content: `The Central Central Air-Conditioned Library announces round-the-clock 24/7 access to the North Wing reading hall starting this week. Remote access to IEEE Xplore, ScienceDirect, and SpringerLink has been renewed for all enrolled students via university institutional email logins.

For assistance with off-campus VPN proxy or research citations, please visit the Digital Reference Desk on the 2nd floor or email library@kare.ac.in.`,
    publishedAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    authorName: 'Dr. P. Ganesan',
    authorRole: 'University Chief Librarian',
    isPinned: false
  }
];
