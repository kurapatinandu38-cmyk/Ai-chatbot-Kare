import { FAQItem } from '../types';

export const INITIAL_FAQS: FAQItem[] = [
  // Admissions
  {
    id: 'faq-1',
    category: 'Admissions',
    question: 'How do I apply for undergraduate admission at the university?',
    answer: 'Undergraduate applications can be submitted online via the University Application Portal or through the Common Application. You must submit high school transcripts, SAT/ACT scores (optional for 2026-2027), 2 letters of recommendation, and a personal statement. The application fee is $75.',
    keywords: ['apply', 'undergraduate', 'admission', 'portal', 'common app', 'transcripts', 'sat', 'act', 'fee'],
    updatedAt: '2026-08-01',
    viewsCount: 1420,
    helpfulCount: 380
  },
  {
    id: 'faq-2',
    category: 'Admissions',
    question: 'What are the application deadlines for Fall and Spring semesters?',
    answer: 'Fall Semester Early Decision deadline is November 1, Regular Decision deadline is January 15. Spring Semester application deadline is October 1. Graduate admission deadlines vary by program; please check your specific department portal.',
    keywords: ['deadline', 'fall', 'spring', 'early decision', 'regular decision', 'due date'],
    updatedAt: '2026-08-01',
    viewsCount: 1100,
    helpfulCount: 295
  },
  {
    id: 'faq-3',
    category: 'Admissions',
    question: 'What are the minimum GPA and test requirements for admission?',
    answer: 'The average admitted undergraduate student has a GPA of 3.65 on a 4.0 scale. Standardized test scores (SAT/ACT) are currently test-optional. Graduate admissions typically require a minimum undergraduate GPA of 3.0 and GRE/GMAT scores for specific majors.',
    keywords: ['gpa', 'requirements', 'sat', 'act', 'minimum', 'scores', 'test optional'],
    updatedAt: '2026-07-28',
    viewsCount: 890,
    helpfulCount: 210
  },

  // Academics
  {
    id: 'faq-group2-group3-certs',
    category: 'Academics',
    question: 'How many certificates do students need to complete under Group 2 and Group 3 activities?',
    answer: 'Certificate requirements for Group 2 (Extra-curricular) and Group 3 (Co-curricular) activities:\n\n• For 2024 and earlier batches (2024 batch & before):\n  - Group 3 (Co-curricular activities): 5 certificates required.\n  - Group 2 (Extra-curricular activities): 7 certificates required.\n  - Club Rule: Certificates may be earned from different clubs.\n\n• For 2025 batches (and subsequent batches):\n  - Students must complete a total of 10 certificates combined from Group 2 and Group 3 activities.\n  - Club Rule: All 10 certificates must be completed from the same club.\n\n• Credit Cap Exemption: Group 2 and Group 3 certifications do not count towards the 25-credit semester limit and can freely exceed the 25 credits cap.',
    keywords: ['group 2', 'group 3', 'group2', 'group3', 'certificates', 'co-curricular', 'extra-curricular', 'extracurricular', 'cocurricular', '2024 batch', '2025 batch', 'clubs', 'same club', 'same clubs', 'different clubs', 'activities', '7 certificates', '10 certificates', '5 certificates', 'exceed 25 credits'],
    updatedAt: '2026-08-24',
    viewsCount: 1840,
    helpfulCount: 520
  },
  {
    id: 'faq-credit-limit-ee-nptel',
    category: 'Academics',
    question: 'What is the semester credit limit, which course categories are included, and how are NPTEL and EE credits handled?',
    answer: 'Semester Credit Limit & Course Category Guidelines:\n\n• 25 Credit Limit per Semester: For 2024 batch and earlier batches, the total credits cannot exceed 25 credits in a single semester.\n\n• Included Course Categories (Cannot exceed 25 credits combined):\n  1. University Elective Courses (UE)\n  2. Program Elective Courses (PE)\n  3. Program Core (PC)\n  4. Foundation Core (FC)\n  5. Experiential Elective (EE)\n  6. Experiential Core (EC)\n\n• NPTEL Courses: Credits earned through NPTEL courses can ONLY be claimed under University Elective Courses (UE).\n\n• Credit Cap Exemption: Group 2 (Extra-curricular) and Group 3 (Co-curricular) certifications are exempt from and can exceed the 25 credits limit.\n\n• Experiential Elective (EE) Requirement (Same for ALL batches): Students of all batches must complete a total of 8 EE credits (from hackathons, technical workshops, etc.) before their 6th semester.',
    keywords: ['25 credits', 'credit limit', 'semester credits', 'limit', 'ue', 'pe', 'pc', 'fc', 'ee', 'ec', 'university elective', 'program elective', 'program core', 'foundation core', 'experiential elective', 'experiential core', 'nptel', 'nptel courses', '2024 batch', '2025 batch', 'all batches', 'hackathons', 'workshops', '6th semester', 'sixth semester', '8 ee credits', 'maximum credits', 'exceed'],
    updatedAt: '2026-08-24',
    viewsCount: 1960,
    helpfulCount: 560
  },
  {
    id: 'faq-ee-credits-hackathons',
    category: 'Academics',
    question: 'How many Experiential Elective (EE) credits are required and what is the deadline?',
    answer: 'Experiential Elective (EE) Credit Guidelines:\n\n• Required Credits (Same for ALL batches): Students across all batches must complete a total of 8 EE credits earned through eligible activities such as hackathons and technical workshops.\n• Completion Deadline: All 8 EE credits must be completed before entering the 6th semester.\n• Semester Inclusion: EE credits count towards the 25 credit per semester limit alongside UE, PE, PC, FC, and EC.\n• NPTEL Note: NPTEL credits are claimed under UE (University Electives), not EE.',
    keywords: ['ee credits', 'experiential elective', 'hackathons', 'workshops', '6th semester', 'sixth semester', '8 credits', 'deadline', 'all batches', '2024 batch', '2025 batch', 'activities', 'engineering exploration', '25 credits'],
    updatedAt: '2026-08-24',
    viewsCount: 1720,
    helpfulCount: 490
  },
  {
    id: 'faq-4',
    category: 'Academics',
    question: 'How do I add, drop, or withdraw from a course?',
    answer: 'Courses can be added or dropped via Student Center online during the official Add/Drop period (first 2 weeks of the semester) without penalty. After week 2, dropping a course requires an academic advisor signature and results in a "W" grade on transcript. Withdrawal deadline is Week 10.',
    keywords: ['add', 'drop', 'withdraw', 'course', 'class', 'student center', 'grade', 'transcript'],
    updatedAt: '2026-08-02',
    viewsCount: 2150,
    helpfulCount: 540
  },
  {
    id: 'faq-5',
    category: 'Academics',
    question: 'How can I declare or change my academic major or minor?',
    answer: 'To declare or change your major, fill out the Major Declaration Form on the Registrar portal, obtain approval from the Department Chair of your new major, and submit it to the Academic Advising Center before the mid-semester deadline.',
    keywords: ['declare', 'change', 'major', 'minor', 'advising', 'registrar', 'department'],
    updatedAt: '2026-07-15',
    viewsCount: 950,
    helpfulCount: 260
  },
  {
    id: 'faq-6',
    category: 'Academics',
    question: 'What is the policy for Dean’s List academic honor recognition?',
    answer: 'Students taking at least 12 graded credit units who achieve a term GPA of 3.75 or higher without any incompletes or failing grades are automatically awarded Dean’s List honors for that semester.',
    keywords: ['dean list', 'gpa', 'honors', 'recognition', 'academic status'],
    updatedAt: '2026-06-20',
    viewsCount: 620,
    helpfulCount: 180
  },

  // Financial Aid & Tuition
  {
    id: 'faq-7',
    category: 'Financial Aid & Tuition',
    question: 'How do I apply for financial aid, scholarships, or fee support?',
    answer: 'For financial aid, government scholarships, and institutional fee assistance, please visit the KARE Finance & Scholarship Cell in the Administrative Wing. Eligible students can also apply for state/central government post-matric scholarships through the national scholarship portal with institute verification.',
    keywords: ['financial aid', 'scholarship', 'government scholarship', 'aid', 'grant', 'finance', 'national scholarship portal'],
    updatedAt: '2026-08-24',
    viewsCount: 2890,
    helpfulCount: 710
  },
  {
    id: 'faq-8',
    category: 'Financial Aid & Tuition',
    question: 'What is the fee structure and how much is the tuition fee?',
    answer: 'For all inquiries regarding tuition fees, course fees, and semester fee structures, please contact the KARE Administration / Admissions Office directly.\n\nFee amounts are NOT fixed generically—the administration determines and specifies your exact fee based on the fee concession awarded according to your Intermediate (10+2 / 12th standard) marks and qualifying scores.\n\nTo know your exact fee after intermediate marks concession, contact the Admin Office:\n• Admissions & Administration Office: Administrative Block, Ground Floor, KARE Campus\n• Phone: +91 4563 289 042 / +91 4563 289 050\n• Email: admissions@kare.ac.in / finance@kare.ac.in\n• Timings: Monday to Saturday, 9:00 AM – 5:00 PM',
    keywords: ['tuition', 'cost', 'fee', 'fees', 'fee structure', 'semester fee', 'annual fee', 'concession', 'intermediate marks', 'intermediate', '12th marks', 'admin', 'contact admin', 'how much fee'],
    updatedAt: '2026-08-24',
    viewsCount: 3100,
    helpfulCount: 820
  },
  {
    id: 'faq-9',
    category: 'Financial Aid & Tuition',
    question: 'What fee concessions are available based on Intermediate marks?',
    answer: 'KARE provides fee concessions based on your Intermediate (10+2 / 12th standard) academic performance and marks.\n\nTo determine your exact fee concession tier and final payable fees:\n1. Contact or visit the KARE Administration / Admissions Office with your Intermediate mark memo / scorecard.\n2. The administration team will verify your intermediate score and inform you of the exact concession amount applied to your program fee.\n\nContact Administration:\n• Phone: +91 4563 289 042 / +91 4563 289 050\n• Email: admissions@kare.ac.in\n• Location: Administrative Block, KARE Campus',
    keywords: ['fee concession', 'scholarship', 'intermediate marks', 'concession', 'intermediate', 'discount', 'merit', '12th marks', 'marks concession', 'admin'],
    updatedAt: '2026-08-24',
    viewsCount: 1650,
    helpfulCount: 430
  },

  // Housing & Dining
  {
    id: 'faq-10',
    category: 'Housing & Dining',
    question: 'Are freshmen required to live on campus dormitories?',
    answer: 'Yes, all first-year undergraduate students are required to reside in university housing unless they live within 25 miles with a parent/guardian, are married, or are over 21 years old. Submit housing intent by May 15.',
    keywords: ['housing', 'dorm', 'freshman', 'residence', 'on campus', 'requirement', 'exemption'],
    updatedAt: '2026-07-01',
    viewsCount: 1280,
    helpfulCount: 310
  },
  {
    id: 'faq-11',
    category: 'Housing & Dining',
    question: 'How do campus meal plans work and how can I change my plan?',
    answer: 'Campus meal plans include Unlimited Access, 14-Meals/Week, or 10-Meals/Week plus Dining Dollars. Meal plans can be changed in the Housing Portal until the second Friday of the semester.',
    keywords: ['dining', 'meal plan', 'cafeteria', 'food', 'dining dollars', 'change plan'],
    updatedAt: '2026-08-03',
    viewsCount: 1040,
    helpfulCount: 270
  },

  // Campus Life & Facilities
  {
    id: 'faq-12',
    category: 'Campus Life & Facilities',
    question: 'What are the Operating Hours for the Campus Health Center and Recreation Gym?',
    answer: 'The Student Health Center is open Monday-Friday 8:00 AM - 5:00 PM (Emergency Call 911 / Campus Safety at ext. 4444). The Recreation Center Gym is open Monday-Saturday 6:00 AM - 11:00 PM and Sunday 8:00 AM - 8:00 PM.',
    keywords: ['gym', 'health center', 'hours', 'recreation', 'fitness', 'medical', 'safety', 'emergency'],
    updatedAt: '2026-08-04',
    viewsCount: 1780,
    helpfulCount: 490
  },
  {
    id: 'faq-13',
    category: 'Campus Life & Facilities',
    question: 'How do I obtain a student ID card and parking permit?',
    answer: 'Student ID cards (CampusOne Pass) are issued at the University Services Office (University Hall, Rm 102). Parking permits can be purchased online via Parking Services; physical permits or digital license plate registration are required for all campus lots.',
    keywords: ['id card', 'parking', 'permit', 'pass', 'university hall', 'vehicle', 'car'],
    updatedAt: '2026-07-19',
    viewsCount: 1390,
    helpfulCount: 380
  },

  // IT Support & Library
  {
    id: 'faq-14',
    category: 'IT Support & Library',
    question: 'How do I connect to the secure Campus Wi-Fi network (Eduroam)?',
    answer: 'Connect to "Eduroam" Wi-Fi using your full university email (student@university.edu) and password. If you experience issues, download the Eduroam Configuration Tool or visit IT Helpdesk in Library Rm 105.',
    keywords: ['wifi', 'eduroam', 'internet', 'network', 'password', 'it helpdesk', 'connect'],
    updatedAt: '2026-08-08',
    viewsCount: 2450,
    helpfulCount: 680
  },
  {
    id: 'faq-15',
    category: 'IT Support & Library',
    question: 'What are the main Library opening hours and room booking rules?',
    answer: 'Main Library is open 24/7 during midterm and final exam weeks! Standard hours are Mon-Thu 7:00 AM - midnight, Fri 7:00 AM - 9:00 PM, Sat-Sun 10:00 AM - 10:00 PM. Group study rooms can be reserved online up to 7 days in advance.',
    keywords: ['library', 'hours', 'study room', 'reserve', 'books', '24/7', 'exams'],
    updatedAt: '2026-08-06',
    viewsCount: 1980,
    helpfulCount: 520
  },

  // KARE B.Tech Regulations 2025 (Official Document FAQs)
  {
    id: 'faq-reg2025-overview',
    category: 'Academics',
    question: 'What are the KARE B.Tech. Regulations - 2025 and when do they take effect?',
    answer: 'The KARE Academic (B. Tech.) Regulation - 2025 was approved by the Academic Council during its 44th meeting (item 44.7) and draft approved by Staff Council on 29 July 2025. It applies to all Engineering Degree Undergraduate (B. Tech) programmes offered by Kalasalingam Academy of Research and Education, except B.Tech Agricultural Engineering, and came into effect from the academic year 2025-26.',
    keywords: ['regulations 2025', 'b.tech regulations', 'kare regulations', 'academic regulations', '2025 regulations', 'academic council', 'effective year', 'commencement', 'btech regulations 2025'],
    updatedAt: '2026-09-01',
    viewsCount: 2840,
    helpfulCount: 890
  },
  {
    id: 'faq-reg2025-duration',
    category: 'Academics',
    question: 'What is the minimum and maximum duration to complete B.Tech at KARE?',
    answer: 'According to KARE B.Tech Regulations 2025 (Section 4.3):\n\n• Minimum Duration:\n  - Regular Students: 4 years consisting of 8 semesters.\n  - Lateral Entry Students: 3 years consisting of 6 semesters.\n\n• Maximum Duration:\n  - Governed by N + 2 years, where N is the minimum prescribed duration.\n  - Regular: 4 + 2 = 6 years.\n  - Lateral: 3 + 2 = 5 years.\n  - Under exceptional circumstances, a further 1-year extension may be granted with the approval of the Vice-Chancellor (during this extended year, the student is treated as a private candidate and is not eligible for First Class).',
    keywords: ['duration', 'minimum duration', 'maximum duration', 'how many years', 'n+2 years', 'extension', 'semesters', 'regular', 'lateral', 'completion time'],
    updatedAt: '2026-09-01',
    viewsCount: 2150,
    helpfulCount: 710
  },
  {
    id: 'faq-reg2025-credits-definition',
    category: 'Academics',
    question: 'How are course credits calculated for Lecture (L), Tutorial (T), Practical (P), and X-Activity (X)?',
    answer: 'Under KARE B.Tech Regulations 2025 (Section 4.4):\nCredits define the instructional contact periods required per week (50-minute periods):\n\n• Lecture (L): 1 credit for each 1 lecture hour per week (1 credit lecture course = 15 contact hours).\n• Tutorial (T): 1 credit for 1 tutorial hour per week.\n• Practical (P): 1 credit for 2 practical/lab hours per week.\n• X-Activity (X): 1 credit for 3 activity hours per week (includes Programming tutorial, Virtual tutorial, Group work, Field work, Studio work, MOOC learning, Virtual Lab, etc.).\n\nCourses typically range from 1 to 6 credits, and the Capstone Design Project is allotted 10 credits.',
    keywords: ['course credit', 'credit calculation', 'lecture l', 'tutorial t', 'practical p', 'x-activity', 'x activity', 'l t p x', 'contact hours', '15 hours', 'credit definition'],
    updatedAt: '2026-09-01',
    viewsCount: 1980,
    helpfulCount: 640
  },
  {
    id: 'faq-reg2025-course-types',
    category: 'Academics',
    question: 'What are the four types of courses (TC, PC, IC, SC) under B.Tech Regulations 2025?',
    answer: 'Under Section 4.5 of KARE B.Tech Regulations 2025, courses are categorized based on their instruction components:\n\n1. Theory Course (TC): Lecture (L) and/or Tutorial (T) and/or X-Activity (X), but NO Practical (P). Example: Biology for Engineers (3-0-0-0, 3 credits).\n2. Practical Course (PC): Practical (P) and/or X-Activity (X), but NO Lecture (L). Example: Engineering Graphics (0-0-2-3, 2 credits).\n3. Integrated Course (IC):\n   - Integrated Course - Theory (IC-T): Majority credits contributed by Lecture (L). Example: Engineering Physics (2-0-0-3, 3 credits).\n   - Integrated Course - Practical (IC-P): Majority credits contributed by Practical (P), Tutorial (T), or X-Activity (X). Example: IoT Sensors and Devices (1-0-0-3, 2 credits).\n4. Skill Course (SC): Includes Practical (P), Tutorial (T)/Lecture (L), and/or X-Activity (X).',
    keywords: ['types of courses', 'theory course', 'tc', 'practical course', 'pc', 'integrated course', 'ic', 'ic-t', 'ic-p', 'skill course', 'sc', 'course classification'],
    updatedAt: '2026-09-01',
    viewsCount: 1720,
    helpfulCount: 530
  },
  {
    id: 'faq-reg2025-course-levels',
    category: 'Academics',
    question: 'What are the course levels (Level 0 to Level 4) and numbering schemes?',
    answer: 'Under Section 4.6 and Section 6.1 of KARE B.Tech Regulations 2025:\n\n• Level 0 (000–099): Bridge courses, mandatory learning courses, and complimentary skill courses.\n• Level 1 (100–199): Foundation courses and introductory courses without prerequisites chosen during the first two years, Multidisciplinary courses, and Skill Enhancement Courses (SEC).\n• Level 2 (200–299): Courses of medium complexity, Program core courses, Program electives, SEC (Intermediate).\n• Level 3 (300–399): Advanced complexity leading to specialization in chosen area, advanced Program core, Program electives, SEC (Higher Level).\n• Level 4 (400–499): Specialized courses requiring deep collaboration or independent study, Honours courses, SEM (Internship), Capstone Project (PCM), MDM (EXSEL).\n\n*Special Rule: If a Level 2, 3, or 4 course requires no prerequisites or only foundation courses as prerequisites, it can be categorized under Multidisciplinary and SEC in Level 1 (100–199).',
    keywords: ['course levels', 'level 0', 'level 1', 'level 2', 'level 3', 'level 4', '100-199', '200-299', '300-399', '400-499', 'course numbering', 'course codes'],
    updatedAt: '2026-09-01',
    viewsCount: 1650,
    helpfulCount: 490
  },
  {
    id: 'faq-reg2025-attendance-condonation',
    category: 'Academics',
    question: 'What are the attendance requirements and rules for condonation of attendance shortage?',
    answer: 'Under Section 4.7 of KARE B.Tech Regulations 2025:\n\n• Minimum Attendance Required: Students must maintain a minimum of 75% attendance in each course till the week before Continuous Assessment (CA) starts and by the last working day for Semester End Examinations (SEE).\n\n• Condonation of Attendance Shortage (Section 4.7.1):\n  - Eligibility: Students securing between 65% and 74.99% attendance who availed prior medical leave.\n  - Application Deadline: Must apply for condonation at least 2 days prior to the last working day.\n  - Approval: Forwarded through the Head of Department (HoD) with genuine medical reports from an authorized physician to the Vice-Chancellor for final grant of condonation.\n  - Students with attendance below 65% are NOT eligible for condonation and receive Grade W (Failure for want of attendance).',
    keywords: ['attendance', '75% attendance', 'condonation', 'shortage of attendance', '65%', 'medical leave', 'medical certificate', 'grade w', 'attendance requirement', 'absent'],
    updatedAt: '2026-09-01',
    viewsCount: 3100,
    helpfulCount: 940
  },
  {
    id: 'faq-reg2025-hybrid-grading',
    category: 'Academics',
    question: 'How does the 10-Point Hybrid Grading Approach (HGA) work at KARE?',
    answer: 'Under Section 4.8 & 4.9 of KARE B.Tech Regulations 2025:\nKARE employs a 10-point scale using a Hybrid Grading Approach (HGA), where grades are computed using BOTH Relative Grading and Absolute Grading, and the BETTER outcome of the two is awarded as the final grade for the student!\n\n1. Absolute Grading Scale (Table 4):\n  • S (10 points): Marks >= 90 (Pass)\n  • A (9 points): 80 <= Marks < 90 (Pass)\n  • B (8 points): 70 <= Marks < 80 (Pass)\n  • C (7 points): 60 <= Marks < 70 (Pass)\n  • D (6 points): 50 <= Marks < 60 (Pass)\n  • E (5 points): 40 <= Marks < 50 (Pass)\n  • U (0 points): Marks < 40 (Fail / Re-appear)\n  • W (0 points): Failure for want of attendance\n  • I (0 points): Incomplete\n\n2. Relative Grading System (Table 3):\n  • Uses Z-score normal distribution across courses based on predefined percentiles (S: P>=95, A: 80<=P<95, B: 55<=P<80, C: 25<=P<55, D: 15<=P<25, E: 10<=P<15, U: P<10).\n\n• Benefit to Students: If relative grading yields a higher grade than absolute grading, or vice versa, the student automatically receives whichever grade is higher!',
    keywords: ['hybrid grading', 'grading system', 'grading scale', '10 point scale', 'relative grading', 'absolute grading', 'hga', 'grade points', 's grade', 'a grade', 'b grade', 'c grade', 'd grade', 'e grade', 'u grade', 'fail mark', 'passing marks', '40 marks'],
    updatedAt: '2026-09-01',
    viewsCount: 3450,
    helpfulCount: 1120
  },
  {
    id: 'faq-reg2025-degree-credits-regular',
    category: 'Academics',
    question: 'What are the minimum credit requirements for a regular 4-year B.Tech degree?',
    answer: 'Under Section 9.1.1 (Table 16) of KARE B.Tech Regulations 2025, regular students must earn a minimum of 160 credits + 3 Mandatory Courses, distributed as follows:\n\n1. Foundation Courses (FC):\n   - Mandatory (FCM): 35 credits\n   - Elective (FCE): 05 credits\n2. Program Courses (PC):\n   - Mandatory (PCM): 70 credits (includes 10-credit Capstone Project)\n   - Elective (PCE): 18 credits\n3. Skill Enhancement Courses (SE):\n   - Mandatory (SEM - Internship): 2 to 4 credits (2 weeks industrial practice = 1 credit)\n   - Elective (SEE): 12 to 14 credits (1/3 hands-on practical)\n4. Multidisciplinary Courses (MD):\n   - Mandatory (MDM - EXSEL): 6 credits (Design-Build 3 + Design-Build-Operate 3)\n   - Elective (MDE): 10 credits (minimum 6 credits in Math & Basic Science)\n\nTotal: 160 credits + 3 Mandatory non-credit courses.',
    keywords: ['160 credits', 'degree requirements', 'credit requirement', 'regular btech', 'fcm', 'fce', 'pcm', 'pce', 'sem', 'see', 'mdm', 'mde', 'total credits', 'capstone credits', 'exsel'],
    updatedAt: '2026-09-01',
    viewsCount: 2980,
    helpfulCount: 880
  },
  {
    id: 'faq-reg2025-degree-credits-lateral',
    category: 'Academics',
    question: 'What are the credit requirements for Lateral Entry B.Tech students?',
    answer: 'Under Section 9.1.2 (Table 17) of KARE B.Tech Regulations 2025, lateral entry students joining in the 2nd year must earn a minimum of 120 credits, distributed as follows:\n\n1. Foundation Courses (FC): 05 credits\n2. Program Courses (PC):\n   - Mandatory (PCM): 65 credits (includes 10-credit Capstone Project)\n   - Elective (PCE): 18 credits\n3. Skill Enhancement Courses (SE):\n   - Mandatory (SEM - Internship): 2 to 4 credits\n   - Elective (SEE): 12 to 14 credits\n4. Multidisciplinary Courses (MD):\n   - Mandatory (MDM - EXSEL): 6 credits\n   - Elective (MDE): 10 credits\n\nTotal: 120 credits + completion of complimentary skill requirements.',
    keywords: ['lateral entry', '120 credits', 'lateral credits', 'diploma lateral', 'lateral requirements', 'second year entry'],
    updatedAt: '2026-09-01',
    viewsCount: 1820,
    helpfulCount: 560
  },
  {
    id: 'faq-reg2025-assessment-scheme',
    category: 'Academics',
    question: 'What is the evaluation weightage between Continuous Assessment (CA) and Semester End Exams (SEE)?',
    answer: 'Under Section 7.1 and 7.2 (Table 6) of KARE B.Tech Regulations 2025, evaluation weightages vary by course type:\n\n1. Theory Courses (TC): 50% CA + 50% SEE (180 mins)\n   - CA: Two Sessional Exams (35%) + Open-ended assignments/tasks (15%)\n2. Practical Courses (PC): 70% CA + 30% SEE (180 mins)\n   - CA: Mid-sem practical (20%) + Open-ended group tasks (30%) + Regular lab performance (20%)\n3. Integrated Course - Theory (IC-T): 50% CA + 50% SEE\n   - CA: Two Sessional Exams (35%) + Mid-sem practical (10%) + Regular lab (5%)\n   - SEE: Theory exam (35%) + Practical exam (15%)\n4. Integrated Course - Practical (IC-P): 70% CA + 30% SEE\n   - CA: Mid-sem practical (20%) + Sessional exam (10%) + Open-ended group tasks (20%) + Regular lab (20%)\n   - SEE: Problem/Project evaluation (20%) + Viva-voce (10%)\n5. Skill Course (SC): 60% CA + 40% SEE\n   - CA: Two Quizzes (20%) + Min Three experimental short exams (40%)\n   - SEE: Case study (40%) OR Mini project (40%) OR Written 15% & Practical 25%',
    keywords: ['continuous assessment', 'ca', 'semester end exam', 'see', 'weightage', 'internal marks', 'external marks', 'sessional exams', 'mid sem practical', 'scheme of examination', 'evaluation'],
    updatedAt: '2026-09-01',
    viewsCount: 2640,
    helpfulCount: 820
  },
  {
    id: 'faq-reg2025-capstone-exsel',
    category: 'Academics',
    question: 'How are Capstone Project (10 credits) and EXSEL evaluated under Regulations 2025?',
    answer: 'Under Section 7.1.1 and 7.2.1 of KARE B.Tech Regulations 2025:\n\n• Capstone Project (10 Credits):\n  - Continuous Assessment (70%): Two committee reviews using rubrics (50%) + Guide/faculty assessment (20%). Evaluated by a 2-member department committee (one nominated by Dean).\n  - Semester End Examination (30%): Evaluated by a 3-member committee.\n\n• EXSEL (EXperiential and SErvice Learning - 6 Credits):\n  - Phase I: Design-Build (3 credits): Introduction to SDG-centered verticals (Plastic Waste Management, Solar PV, Smart Irrigation). 70% Internal Assessment + 30% End-semester.\n  - Phase II: Design-Build-Operate (3 credits): Translates designs into functional and scalable implementations. Evaluated identically to Capstone Project (70% CA + 30% SEE).',
    keywords: ['capstone project', '10 credits capstone', 'exsel', 'experiential and service learning', 'design build', 'design build operate', 'sdg', 'project reviews', 'internal assessment'],
    updatedAt: '2026-09-01',
    viewsCount: 2100,
    helpfulCount: 670
  },
  {
    id: 'faq-reg2025-complimentary-skills',
    category: 'Academics',
    question: 'What are the Complimentary Skill Courses requirements (Group I, II, and III)?',
    answer: 'Under Section 5.1.v and 7.3 (Table 5) of KARE B.Tech Regulations 2025:\nComplimentary skills are Non-Credit Audit Courses evaluated on a Pass/Fail basis. To graduate, every student must complete:\n\n1. Group I (MANDATORY FOR ALL):\n   - Soft Skills: Min 30 hours, 75% attendance (OR valid score in TOEFL / IELTS / Foreign Language MOOC).\n   - Aptitude Test: Min 30 hours, 75% attendance (OR valid score in GRE / GMAT / CAT / NAC-Tech).\n\n2. Group II (At least 1 required):\n   - NSS (75% in 240 hours over 2 years + annual camp)\n   - NCC (75% in 3 consecutive years, \'C\' Certificate)\n   - Sports (40 hours Non-CGPA sports OR national/inter-university tournament win)\n   - Extra-Curricular Activities (enrol in recognized club + 5 participation certificates OR winning position/office bearer)\n\n3. Group III (At least 1 required):\n   - Co-Curricular Activities (Professional society membership for 2 years + 2 events OR 10 workshop/seminar certificates)\n   - Value Added Courses (Min 40 hours, >= 60% marks, 75% attendance)\n   - International Certification (Technical, e.g. GATE, TANCET, or approved cert)',
    keywords: ['complimentary skills', 'non-credit courses', 'audit courses', 'group 1', 'group 2', 'group 3', 'soft skills', 'aptitude', 'nss', 'ncc', 'sports', 'value added courses', 'international certification', 'gate'],
    updatedAt: '2026-09-01',
    viewsCount: 2420,
    helpfulCount: 760
  },
  {
    id: 'faq-reg2025-honours-program',
    category: 'Academics',
    question: 'What are the eligibility criteria and four options for B.Tech with Honours?',
    answer: 'Under Section 9.5 of KARE B.Tech Regulations 2025:\n\n• Eligibility: Minimum CGPA of 8.25 with NO history of arrears.\n\n• Four Honours Pathways:\n  1. Case 1: Honours in Domain: Complete an additional 20 credits in Level 4+ domain-specific advanced courses (must secure minimum \'B\' grade in each; grades not added to main CGPA).\n  2. Case 2: Honours in Research: 5–6 month research project starting from 5th semester under faculty guidance, resulting in a first-author publication in a SCIE indexed peer-reviewed journal (= 20 credits equivalent).\n  3. Case 3: Honours in Innovation: 5–6 month entrepreneurial product development under IEDC resulting in filing a patent and launching a campus startup.\n  4. Case 4: Honours in Industry Practice: Semester-long stipend-based industry internship approved by Corporate Office.',
    keywords: ['honours', 'btech with honours', '8.25 cgpa', 'no arrears', 'honours in research', 'honours in innovation', 'honours in industry practice', 'scie indexed', 'patent', 'startup', '20 additional credits'],
    updatedAt: '2026-09-01',
    viewsCount: 2790,
    helpfulCount: 910
  },
  {
    id: 'faq-reg2025-minors-program',
    category: 'Academics',
    question: 'How can a student earn a B.Tech with Minor under Regulations 2025?',
    answer: 'Under Section 9.5.5 and Table 18 of KARE B.Tech Regulations 2025:\n\n• Requirements:\n  - Students must complete an additional 20 credits from a specific set of courses in a chosen multidisciplinary area outside their primary department, approved by Board of Studies (BoS).\n  - Students must secure a minimum of a \'Pass\' grade in all minor courses.\n  - Grades earned in minor courses are NOT included in the main CGPA calculation.\n  - A separate CGPA for the Minors Program is calculated and printed on the transcript.\n  - B.Tech with Minor is conferred with 160 credits (main CGPA 6.5+) + 20 credits from multidisciplinary domain with Minor CGPA >= 7.5.',
    keywords: ['minors', 'btech with minor', 'minor program', 'multidisciplinary', 'minor cgpa', '20 credits minor', 'transcript'],
    updatedAt: '2026-09-01',
    viewsCount: 1950,
    helpfulCount: 620
  },
  {
    id: 'faq-reg2025-multiple-entry-exit',
    category: 'Academics',
    question: 'What are the NEP-2020 Multiple Entry and Exit options (UG Certificate, Diploma, B.Sc. Eng, B.Tech)?',
    answer: 'Under Section 9.6 (Table 18) of KARE B.Tech Regulations 2025, in line with NEP-2020:\n\n• Exit 1 (End of Year 1 - NCrF Level 4.5): Awarded Undergraduate Certificate in Engineering upon earning minimum 40 credits + 4 credits in skill-based vocational course during summer term.\n• Exit 2 (End of Year 2 - NCrF Level 5): Awarded Undergraduate Diploma / Diploma in Engineering upon completing 80 credits + 4 credits in skill-based vocational summer term (with at least 40% from programme courses).\n• Exit 3 (End of Year 3 - NCrF Level 5.5): Awarded B.Sc. (Eng) upon completing 120 credits (with approx 80% from programme courses).\n• Completion (End of Year 4 - NCrF Level 6): Awarded B.Tech Degree upon earning 160 credits + mandatory courses.\n\n• Re-entry Option: A student who exits with a Certificate, Diploma, or Degree may re-enter within 3 years with full transfer of earned credits. Maximum total duration including re-entry is 7 years from initial enrolment.',
    keywords: ['multiple exit', 'multiple entry', 'nep 2020', 'ug certificate', 'ug diploma', 'b.sc eng', 'bsc engineering', 're-entry', 'reentry', '40 credits', '80 credits', '120 credits', 'ncrf level'],
    updatedAt: '2026-09-01',
    viewsCount: 2850,
    helpfulCount: 930
  },
  {
    id: 'faq-reg2025-degree-classification',
    category: 'Academics',
    question: 'What are the criteria for First Class with Distinction, First Class, and Pass?',
    answer: 'Under Section 9.4 of KARE B.Tech Regulations 2025:\n\n1. First Class with Distinction:\n   - Minimum CGPA of 8.25.\n   - Must pass ALL courses in the FIRST ATTEMPT.\n   - Must complete within the minimum duration (4 years for regular, 3 years for lateral).\n\n2. First Class:\n   - Minimum CGPA of 6.5.\n   - Completed within the maximum duration of the program (N + 2 years).\n\n3. Pass:\n   - Candidate who fulfills degree requirements but does not qualify for First Class or Distinction.',
    keywords: ['degree classification', 'first class with distinction', 'first class', 'pass', '8.25 cgpa', '6.5 cgpa', 'first attempt', 'gold medal', 'distinction criteria'],
    updatedAt: '2026-09-01',
    viewsCount: 2540,
    helpfulCount: 810
  },
  {
    id: 'faq-reg2025-mooc-credits',
    category: 'Academics',
    question: 'Can I earn degree credits through NPTEL / Swayam MOOC courses and what is the limit?',
    answer: 'Under Section 5.2.3 and Section 8.2 of KARE B.Tech Regulations 2025:\n\n• Credit Limit: Students can earn up to 20% of the total credits required for the programme through approved MOOC platforms such as NPTEL, Swayam, etc.\n• Course Categories: MOOC courses are considered under Program Elective Courses (PEC) and Multidisciplinary Elective Courses (MDE).\n• Approval: The course must be from the list approved by the Board of Studies (BoS) or proposed by the student before the start of the semester.\n• Equivalence: Credit and grade point equivalence is ratified by a committee consisting of the Dean, HoD, and nominated faculty.',
    keywords: ['mooc', 'nptel', 'swayam', '20% credits', 'online courses', 'credit transfer', 'program elective', 'multidisciplinary elective'],
    updatedAt: '2026-09-01',
    viewsCount: 2280,
    helpfulCount: 750
  },
  {
    id: 'faq-reg2025-makeup-supplementary',
    category: 'Academics',
    question: 'What are the rules for Makeup examinations and Supplementary examinations?',
    answer: 'Under Section 7.5 & 7.6 of KARE B.Tech Regulations 2025:\n\n• Makeup Examination (Section 7.5):\n  - For students who missed Continuous Assessment (CA) or Semester End Examination (SEE) for genuine reasons upon Faculty Advisor recommendation.\n  - CA makeup approval: Dean of the concerned school.\n  - SEE makeup approval: Vice-Chancellor.\n  - If both CA and SEE were missed: Vice-Chancellor decides and only SEE performance will be considered with 100% weightage.\n\n• Supplementary Examination (Section 7.6):\n  - Students who failed a course (awarded Grade U, AB, or I) may appear in supplementary exams scheduled in subsequent semesters.\n  - Continuous assessment (CA) marks in the course remain preserved.',
    keywords: ['makeup exam', 'supplementary exam', 'missed exam', 'arrear exam', 'absent exam', 'grade u', 'grade ab', 'grade i', '100% weightage'],
    updatedAt: '2026-09-01',
    viewsCount: 2190,
    helpfulCount: 710
  }
];

