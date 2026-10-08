/**
 * Utility to calculate student year of study, joined batch year, and cohort
 * based on Kalasalingam University (KARE) registration numbers.
 *
 * Rules:
 * - Register numbers typically follow 99YY... where YY is the admission year:
 *   - 9924xxxx -> 24 is 2024 -> 3rd Year (in 2026 academic year)
 *   - 9925xxxx -> 25 is 2025 -> 2nd Year (in 2026 academic year)
 *   - 9926xxxx -> 26 is 2026 -> 1st Year (in 2026 academic year)
 *   - 9923xxxx -> 23 is 2023 -> 4th Year (in 2026 academic year)
 *   - 9922xxxx -> 22 is 2022 -> 4th Year (in 2026 academic year)
 */

export interface StudentYearCalculation {
  yearOfStudy: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Postgraduate';
  joinedYear: number;
  cohort: 'first_year' | 'senior_year';
  displayBadge: string;
}

export const CURRENT_ACADEMIC_YEAR = 2026;

export function calculateStudentYearInfo(
  identifierOrRoll?: string | null,
  fallbackJoinedYear?: number
): StudentYearCalculation {
  const raw = String(identifierOrRoll || '').trim();
  const digitsOnly = raw.replace(/\D/g, '');

  let detectedYear: number | null = null;

  // 1. Detect 99YY prefix pattern (e.g. 99240040272 -> 24 -> 2024; 9925004099 -> 25 -> 2025)
  const match99 = raw.match(/(?:^|\D)99(\d{2})/);
  if (match99) {
    const yy = parseInt(match99[1], 10);
    detectedYear = 2000 + yy;
  } else if (digitsOnly.startsWith('99') && digitsOnly.length >= 4) {
    const yy = parseInt(digitsOnly.substring(2, 4), 10);
    detectedYear = 2000 + yy;
  }

  // 2. Detect 4-digit year like 2024KARE..., 2025KARE..., 2026KARE...
  if (!detectedYear) {
    const match4Digit = raw.match(/(?:^|\D)(202[0-9])(?:\D|$)/);
    if (match4Digit) {
      detectedYear = parseInt(match4Digit[1], 10);
    }
  }

  // 3. Fallback to provided joinedYear or default
  if (!detectedYear && fallbackJoinedYear && fallbackJoinedYear >= 2000 && fallbackJoinedYear <= 2030) {
    detectedYear = fallbackJoinedYear;
  }

  if (!detectedYear) {
    detectedYear = 2024;
  }

  // Calculate year based on current academic year (2026):
  // 2026 - 2026 = 0 -> 1st Year
  // 2026 - 2025 = 1 -> 2nd Year
  // 2026 - 2024 = 2 -> 3rd Year
  // 2026 - 2023 = 3 -> 4th Year
  // 2026 - 2022 = 4 -> 4th Year
  const diff = CURRENT_ACADEMIC_YEAR - detectedYear;

  let yearOfStudy: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Postgraduate' = '2nd Year';
  let cohort: 'first_year' | 'senior_year' = 'senior_year';
  let displayBadge = '2nd Year';

  if (diff <= 0) {
    yearOfStudy = '1st Year';
    cohort = 'first_year';
    displayBadge = '1st Year Fresher';
  } else if (diff === 1) {
    yearOfStudy = '2nd Year';
    cohort = 'senior_year';
    displayBadge = '2nd Year';
  } else if (diff === 2) {
    yearOfStudy = '3rd Year';
    cohort = 'senior_year';
    displayBadge = '3rd Year';
  } else {
    yearOfStudy = '4th Year';
    cohort = 'senior_year';
    displayBadge = '4th Year';
  }

  return {
    yearOfStudy,
    joinedYear: detectedYear,
    cohort,
    displayBadge
  };
}

export function getDisplayYearOfStudy(student?: {
  rollNumber?: string;
  identifier?: string;
  applicationNumber?: string;
  yearOfStudy?: string;
  joinedYear?: number;
  cohort?: string;
} | null): string {
  if (!student) return 'Student';
  const targetId = student.rollNumber || student.identifier || student.applicationNumber || '';
  const calculated = calculateStudentYearInfo(targetId, student.joinedYear);
  return calculated.yearOfStudy;
}
