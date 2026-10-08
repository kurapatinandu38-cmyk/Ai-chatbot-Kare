import { FeeStructureItem, AdmissionsInfo, PlacedStudentItem, StudentUser } from '../types';

export const INITIAL_FEE_STRUCTURES: FeeStructureItem[] = [
  {
    id: 'fee-aiml',
    program: 'B.Tech Artificial Intelligence & Machine Learning (AIML)',
    degree: 'UG',
    annualTuition: '₹1,45,000 / year',
    intermediateConcessions: [
      { marksRange: 'Above 95% in Intermediate / +2 MPC', concession: '50% Tuition Fee Waiver (Save ₹72,500)' },
      { marksRange: '90% - 94.9% in Intermediate / +2 MPC', concession: '25% Tuition Fee Waiver (Save ₹36,250)' },
      { marksRange: '80% - 89.9% in Intermediate / +2 MPC', concession: '15% Tuition Fee Waiver (Save ₹21,750)' },
      { marksRange: 'JEE Main 90+ %ile / KARE Rank 1-100', concession: '100% Tuition Fee Scholarship' }
    ],
    hostelFee: '₹65,000 - ₹95,000 / year (4-Sharing / 2-Sharing / AC options)',
    cautionDeposit: '₹5,000 (One-time, 100% Refundable at graduation)',
    installments: 'Payable in 2 equal semester installments (Odd & Even Semesters)',
    specialNotes: 'Dedicated Nvidia GPU computing cluster access, Deep Learning & Generative AI Lab, and LLM Engineering workbench.'
  },
  {
    id: 'fee-1',
    program: 'B.Tech Computer Science and Engineering',
    degree: 'UG',
    annualTuition: '₹1,40,000 / year',
    intermediateConcessions: [
      { marksRange: 'Above 95% in Intermediate / +2 MPC', concession: '50% Tuition Fee Waiver (Save ₹70,000)' },
      { marksRange: '90% - 94.9% in Intermediate / +2 MPC', concession: '25% Tuition Fee Waiver (Save ₹35,000)' },
      { marksRange: '80% - 89.9% in Intermediate / +2 MPC', concession: '15% Tuition Fee Waiver (Save ₹21,000)' },
      { marksRange: 'JEE Main 90+ %ile / KARE Rank 1-100', concession: '100% Tuition Fee Scholarship' }
    ],
    hostelFee: '₹65,000 - ₹95,000 / year (4-Sharing / 2-Sharing / AC options)',
    cautionDeposit: '₹5,000 (One-time, 100% Refundable at graduation)',
    installments: 'Payable in 2 equal semester installments (Odd & Even Semesters)',
    specialNotes: 'Laptop mandatory. Includes access to Cloud labs and High Performance Computing center.'
  },
  {
    id: 'fee-2',
    program: 'B.Tech Artificial Intelligence & Data Science',
    degree: 'UG',
    annualTuition: '₹1,35,000 / year',
    intermediateConcessions: [
      { marksRange: 'Above 95% in Intermediate / +2 MPC', concession: '50% Tuition Fee Waiver' },
      { marksRange: '90% - 94.9% in Intermediate / +2 MPC', concession: '25% Tuition Fee Waiver' },
      { marksRange: '80% - 89.9% in Intermediate / +2 MPC', concession: '15% Tuition Fee Waiver' }
    ],
    hostelFee: '₹65,000 - ₹95,000 / year',
    cautionDeposit: '₹5,000 (Refundable)',
    installments: '2 equal semester installments',
    specialNotes: 'Industry-aligned curriculum with IBM & AWS AI certification labs.'
  },
  {
    id: 'fee-it',
    program: 'B.Tech Information Technology',
    degree: 'UG',
    annualTuition: '₹1,30,000 / year',
    intermediateConcessions: [
      { marksRange: 'Above 95% in Intermediate / +2 MPC', concession: '50% Tuition Fee Waiver (Save ₹65,000)' },
      { marksRange: '90% - 94.9% in Intermediate / +2 MPC', concession: '25% Tuition Fee Waiver (Save ₹32,500)' },
      { marksRange: '80% - 89.9% in Intermediate / +2 MPC', concession: '15% Tuition Fee Waiver (Save ₹19,500)' }
    ],
    hostelFee: '₹65,000 - ₹95,000 / year',
    cautionDeposit: '₹5,000 (Refundable)',
    installments: '2 equal semester installments',
    specialNotes: 'Cloud computing suites, Full-stack development studios, and Cyber security sandbox.'
  },
  {
    id: 'fee-3',
    program: 'B.Tech Electronics and Communication Engineering',
    degree: 'UG',
    annualTuition: '₹1,20,000 / year',
    intermediateConcessions: [
      { marksRange: 'Above 90% in Intermediate / +2 MPC', concession: '40% Tuition Fee Waiver' },
      { marksRange: '80% - 89.9% in Intermediate / +2 MPC', concession: '20% Tuition Fee Waiver' }
    ],
    hostelFee: '₹65,000 - ₹95,000 / year',
    cautionDeposit: '₹5,000 (Refundable)',
    installments: '2 equal semester installments',
    specialNotes: 'VLSI design labs, Embedded Systems, and IoT sensor workbench access.'
  },
  {
    id: 'fee-eee',
    program: 'B.Tech Electrical and Electronics Engineering (EEE)',
    degree: 'UG',
    annualTuition: '₹1,15,000 / year',
    intermediateConcessions: [
      { marksRange: 'Above 90% in Intermediate / +2 MPC', concession: '40% Tuition Fee Waiver' },
      { marksRange: '80% - 89.9% in Intermediate / +2 MPC', concession: '20% Tuition Fee Waiver' }
    ],
    hostelFee: '₹65,000 - ₹95,000 / year',
    cautionDeposit: '₹5,000 (Refundable)',
    installments: '2 equal semester installments',
    specialNotes: 'Smart grid labs, Electric Vehicle powertrain testing, and Power electronics facility.'
  },
  {
    id: 'fee-4',
    program: 'B.Tech Mechanical Engineering & Civil Engineering',
    degree: 'UG',
    annualTuition: '₹90,000 / year',
    intermediateConcessions: [
      { marksRange: 'Above 85% in Intermediate / +2 MPC', concession: '50% Core Engineering Special Waiver' },
      { marksRange: '75% - 84.9% in Intermediate / +2 MPC', concession: '25% Core Engineering Waiver' }
    ],
    hostelFee: '₹65,000 - ₹95,000 / year',
    cautionDeposit: '₹5,000 (Refundable)',
    installments: '2 equal semester installments',
    specialNotes: 'Robotics, EV design lab, CAD/CAM modeling, and structural engineering software.'
  },
  {
    id: 'fee-5',
    program: 'B.Tech Biotechnology & Biomedical Engineering',
    degree: 'UG',
    annualTuition: '₹1,10,000 / year',
    intermediateConcessions: [
      { marksRange: 'Above 90% in BiPC / +2', concession: '30% Merit Waiver' },
      { marksRange: '80% - 89.9% in BiPC / +2', concession: '15% Merit Waiver' }
    ],
    hostelFee: '₹65,000 - ₹95,000 / year',
    cautionDeposit: '₹5,000 (Refundable)',
    installments: '2 equal semester installments',
    specialNotes: 'Genetic engineering labs, tissue culture suites, and clinical device testing.'
  },
  {
    id: 'fee-6',
    program: 'Master of Business Administration (MBA)',
    degree: 'PG',
    annualTuition: '₹1,50,000 / year',
    intermediateConcessions: [
      { marksRange: 'MAT / CAT > 80% or TANCET Top 500', concession: '30% Merit Scholarship' },
      { marksRange: 'Undergraduate CGPA > 8.5', concession: '20% Academic Scholarship' }
    ],
    hostelFee: '₹70,000 - ₹1,05,000 / year (Executive Hostel)',
    cautionDeposit: '₹5,000 (Refundable)',
    installments: '2 equal installments per year',
    specialNotes: 'Dual specialization in FinTech, Digital Marketing, Business Analytics, and HR.'
  },
  {
    id: 'fee-arch',
    program: 'Bachelor of Architecture (B.Arch)',
    degree: 'UG',
    annualTuition: '₹1,30,000 / year',
    intermediateConcessions: [
      { marksRange: 'NATA 120+ Score / 90%+ in 10+2 MPC', concession: '35% Merit Scholarship' },
      { marksRange: 'NATA 100 - 119 Score', concession: '20% Merit Scholarship' }
    ],
    hostelFee: '₹65,000 - ₹95,000 / year',
    cautionDeposit: '₹5,000 (Refundable)',
    installments: '2 equal installments per year',
    specialNotes: 'Design studios, 3D printing and model-making fabrication lab, drafting workstations.'
  }
];

export const INITIAL_ADMISSIONS_INFO: AdmissionsInfo = {
  admissionYear: 'Academic Year 2025 - 2026',
  overview: 'Kalasalingam Academy of Research and Education (Deemed to be University) offers merit-based undergraduate, postgraduate, and doctoral admissions through KARE entrance as well as qualifying intermediate (+2) examination scores.',
  eligibilityCriteria: [
    'B.Tech: A pass in 10+2 / Intermediate examination with minimum 50% aggregate in Mathematics, Physics, and Chemistry (MPC).',
    'Biotechnology / Biomedical: Minimum 50% aggregate in Physics, Chemistry, and Biology / Mathematics (BiPC or MPC).',
    'Postgraduate (M.Tech/MBA/MCA): Recognized Bachelor\'s degree with at least 50% marks (45% for reserved category candidates).',
    'Lateral Entry (2nd Year B.Tech): Diploma in Engineering / Technology with at least 50% marks.'
  ],
  admissionProcedure: [
    'Step 1: Fill the Online Application Form with basic student details.',
    'Step 2: Upload 10th & 12th Intermediate Marksheets, Transfer Certificate (TC), and Community Certificate.',
    'Step 3: Verification of Intermediate marks for scholarship / fee concession entitlement.',
    'Step 4: Provisional Admission Letter issuance and initial seat confirmation deposit.',
    'Step 5: Physical reporting at Administrative Block, certificate verification, and 1st year hostel room allotment.'
  ],
  importantDates: [
    { event: 'KARE Phase 1 Entrance Exam', date: 'April 25, 2025' },
    { event: 'Phase 1 Merit Allotment & Counselling', date: 'May 10, 2025' },
    { event: '12th / Intermediate Marksheet Submission & Concession Approval', date: 'June 15, 2025' },
    { event: 'First Year Freshers Orientation & Induction', date: 'August 01, 2025' },
    { event: 'Commencement of Regular 1st Semester Classes', date: 'August 10, 2025' }
  ],
  requiredDocuments: [
    'Class 10 (SSLC) original marksheet & 2 attested copies',
    'Class 12 / Intermediate (+2) mark statement',
    'Transfer Certificate (TC) and Conduct Certificate',
    'Migration Certificate (for other state / CBSE / ICSE boards)',
    'Community / Caste Certificate (if claiming quota benefits)',
    'Income Certificate for Fee Concession / Scholarship verification',
    'Aadhar Card copy and 5 recent passport-size photos',
    'KARE Hall Ticket / Score Card (if appeared)'
  ],
  contactEmail: 'admissions@kare.ac.in',
  contactPhone: '+91 4563 289 042 / +91 73737 01234',
  admissionsOfficeLocation: 'Office of Admissions, Ground Floor, Administrative Block, KARE Campus, Krishnankoil - 626126'
};

export const INITIAL_PLACEMENTS: PlacedStudentItem[] = [];

export const INITIAL_STUDENTS: StudentUser[] = [];
