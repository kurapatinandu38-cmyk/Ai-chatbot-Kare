/**
 * Helper to construct and automatically open Google Mail (Gmail) compose
 * with prefilled faculty recipient, formal academic inquiry subject, and message structure.
 */

export interface GmailComposeOptions {
  to: string;
  subject?: string;
  body?: string;
  facultyName?: string;
  department?: string;
}

export const buildGmailComposeUrl = (options: GmailComposeOptions): string => {
  const { to, subject, body, facultyName, department } = options;

  const defaultSubject = subject || `Academic Inquiry - Kalasalingam Academy of Research and Education`;
  
  const defaultBody = body || [
    `Dear ${facultyName || 'Respected Professor'},`,
    '',
    `Greetings from Kalasalingam Academy of Research and Education.`,
    '',
    `I am writing to respectfully request academic guidance regarding ${department ? `the ${department} program` : 'course curriculum / mentorship'}.`,
    '',
    'Student Details:',
    '• Student / Applicant Name: ',
    '• Register / Application Number: ',
    '• Department & Year: ',
    '• Query / Topic of Discussion: ',
    '',
    'Thank you for your valuable time and mentorship.',
    '',
    'Warm regards,',
    '[Your Name]'
  ].join('\n');

  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: to,
    su: defaultSubject,
    body: defaultBody
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
};

/**
 * Automatically opens Gmail compose in a new tab.
 * Falls back to mailto if browser blocks popups.
 */
export const openFacultyGmail = (options: GmailComposeOptions): Window | null => {
  const gmailUrl = buildGmailComposeUrl(options);
  const win = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  
  // If popups were blocked, open mailto as graceful fallback
  if (!win || win.closed || typeof win.closed === 'undefined') {
    window.location.href = `mailto:${options.to}?subject=${encodeURIComponent(options.subject || 'Academic Inquiry')}`;
  }
  
  return win;
};
