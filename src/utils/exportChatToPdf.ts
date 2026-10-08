import { jsPDF } from 'jspdf';
import { ChatMessage, StudentUser, Department } from '../types';
import { getDisplayYearOfStudy } from './studentYearHelper';

interface ExportPdfOptions {
  messages: ChatMessage[];
  currentUser: StudentUser | null;
  selectedDepartment?: Department;
  customTitle?: string;
}

/**
 * Strips or converts common markdown syntax for clean PDF rendering
 */
function cleanMarkdownForPdf(text: string): string {
  if (!text) return '';
  
  return text
    // Replace markdown bold/italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Clean bullet points
    .replace(/^[ \t]*[*\-+][ \t]+/gm, '• ')
    // Clean numbered lists (keep numbers)
    .replace(/^[ \t]*(\d+)\.[ \t]+/gm, '$1. ')
    // Clean headers
    .replace(/^#+\s*(.*?)$/gm, '$1')
    // Remove extra empty line clutter
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Generates and downloads a branded PDF document of the conversation log.
 */
export function exportChatToPdf({
  messages,
  currentUser,
  selectedDepartment = 'All',
  customTitle
}: ExportPdfOptions): { success: boolean; filename?: string; error?: string } {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
    const margin = 14;
    const contentWidth = pageWidth - margin * 2; // 182 mm
    const bottomMargin = 22;

    let y = margin;

    // Helper: Add new page with consistent positioning
    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - bottomMargin) {
        doc.addPage();
        y = margin + 8; // Reset Y for new page
        return true;
      }
      return false;
    };

    // ==========================================
    // 1. BRANDED HEADER (FIRST PAGE)
    // ==========================================
    // Header Background Accent
    doc.setFillColor(15, 32, 67); // Deep University Blue #0f2043
    doc.rect(margin, y, contentWidth, 26, 'F');

    // University Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('KALASALINGAM ACADEMY OF RESEARCH AND EDUCATION', margin + 6, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(200, 220, 255);
    doc.text('(Deemed to be University under Section 3 of UGC Act 1956) • Anand Nagar, Krishnankoil - 626126', margin + 6, y + 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 215, 0); // Gold accent
    doc.text('KARE AI CAMPUS ASSISTANT — OFFICIAL CONVERSATION LOG', margin + 6, y + 20);

    y += 30;

    // ==========================================
    // 2. METADATA & STUDENT INFO CARD
    // ==========================================
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    doc.setFillColor(248, 250, 253);
    doc.setDrawColor(218, 225, 235);
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

    // Left Column Info
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('STUDENT / USER PROFILE:', margin + 4, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    if (currentUser) {
      const yearDisp = getDisplayYearOfStudy(currentUser);
      doc.text(`${currentUser.name} (${currentUser.rollNumber || currentUser.applicationNumber || currentUser.id}) • ${yearDisp}`, margin + 4, y + 10.5);
      doc.text(`Email: ${currentUser.collegeEmail || currentUser.email}  |  Dept: ${currentUser.department || 'Engineering'}`, margin + 4, y + 15.5);
    } else {
      doc.text('Guest / Prospective Candidate (General Inquiry Session)', margin + 4, y + 10.5);
      doc.text('Status: Public Session (Unauthenticated)', margin + 4, y + 15.5);
    }

    // Right Column Info
    const rightColX = margin + 110;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('SESSION DETAILS:', rightColX, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(`Generated: ${formattedDate}, ${formattedTime}`, rightColX, y + 10.5);
    doc.text(`Category Filter: ${selectedDepartment}  |  Total Messages: ${messages.length}`, rightColX, y + 15.5);

    y += 27;

    // Conversation Section Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 32, 67);
    doc.text('RECORDED CONVERSATION TRANSCRIPT', margin, y);
    
    // Subtle Divider Line
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, y + 2, margin + contentWidth, y + 2);
    y += 7;

    // Filter out internal system greeting if multiple messages exist, or keep all
    const displayMessages = messages.length > 0 ? messages : [];

    // ==========================================
    // 3. RENDER CONVERSATION MESSAGES
    // ==========================================
    displayMessages.forEach((msg, index) => {
      const isStudent = msg.sender === 'student';
      const cleanContent = cleanMarkdownForPdf(msg.text);

      // Split text to fit width
      const textPadding = 4;
      const textWidth = contentWidth - textPadding * 2 - 4; // Account for colored left accent bar
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      const textLines = doc.splitTextToSize(cleanContent, textWidth);
      
      const lineHeight = 4.2;
      const textBlockHeight = textLines.length * lineHeight;
      const headerHeight = 7;
      const metaHeight = (!isStudent && msg.nlpDetails) ? 5.5 : 0;
      const cardHeight = headerHeight + textBlockHeight + metaHeight + 4;

      // Check page break
      checkPageBreak(cardHeight + 4);

      // Card Background & Styling
      if (isStudent) {
        // User Query Card - Light Indigo/Blue Tint
        doc.setFillColor(241, 245, 249); // slate-100
        doc.setDrawColor(203, 213, 225); // slate-300
        doc.roundedRect(margin, y, contentWidth, cardHeight, 1.5, 1.5, 'FD');

        // Left Accent Bar (Blue)
        doc.setFillColor(37, 99, 235); // Blue-600
        doc.rect(margin, y, 2.5, cardHeight, 'F');

        // Sender & Timestamp Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 58, 138); // Blue-900
        doc.text(`[Query #${index + 1}] Student / Inquirer`, margin + 5, y + 4.8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(msg.timestamp || 'Recorded', margin + contentWidth - 25, y + 4.8, { align: 'right' });
      } else {
        // AI Response Card - Clean Light White/Teal Tint
        doc.setFillColor(250, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, y, contentWidth, cardHeight, 1.5, 1.5, 'FD');

        // Left Accent Bar (Emerald / Teal)
        doc.setFillColor(13, 148, 136); // Teal-600
        doc.rect(margin, y, 2.5, cardHeight, 'F');

        // Sender & Timestamp Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 118, 110); // Teal-800
        doc.text(`[Response #${index + 1}] KARE AI Campus Assistant`, margin + 5, y + 4.8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(msg.timestamp || 'Recorded', margin + contentWidth - 25, y + 4.8, { align: 'right' });
      }

      // Message Body Text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59); // Slate-800
      let textY = y + headerHeight + 2.5;

      for (let i = 0; i < textLines.length; i++) {
        doc.text(textLines[i], margin + 5, textY);
        textY += lineHeight;
      }

      // Metadata Tag for AI Responses (Source Grounding / Cosine Similarity)
      if (!isStudent && msg.nlpDetails) {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 116, 139);
        const matchLabel = msg.nlpDetails.matchType === 'FAQ_DATABASE'
          ? `Verified Knowledge Base • Matched: "${msg.nlpDetails.matchedFaqQuestion || 'Direct Policy FAQ'}"`
          : msg.nlpDetails.matchType === 'GEMINI_AI'
          ? 'Grounded with Gemini AI • Academic Regulations & Campus Policies Knowledge Base'
          : 'Hybrid AI Verified Advisory';
        doc.text(matchLabel, margin + 5, y + cardHeight - 2);
      }

      y += cardHeight + 3.5;
    });

    // ==========================================
    // 4. FOOTERS & PAGE NUMBERS (ALL PAGES)
    // ==========================================
    const totalPages = doc.getNumberOfPages();

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      doc.setPage(pageNum);

      // Running top small header on page 2+
      if (pageNum > 1) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Kalasalingam Academy of Research and Education (KARE) • AI Query Log', margin, 9);
        doc.text(`${formattedDate}`, margin + contentWidth, 9, { align: 'right' });
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, 11, margin + contentWidth, 11);
      }

      // Bottom Divider Line
      const footerY = pageHeight - 14;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, footerY, margin + contentWidth, footerY);

      // University Disclaimer & Helplines
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        'Disclaimer: Generated for student academic & admission reference by KARE AI CHAT ENQUIRY. Official rules remain governed by Academic Council.',
        margin,
        footerY + 4
      );
      doc.text(
        'Helpline: 1800-425-7884 | Email: admissions@kare.ac.in / academic@kare.ac.in | Web: www.kalasalingam.ac.in',
        margin,
        footerY + 8
      );

      // Page Numbering
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Page ${pageNum} of ${totalPages}`, margin + contentWidth, footerY + 6, { align: 'right' });
    }

    // ==========================================
    // 5. SAVE & DOWNLOAD FILE
    // ==========================================
    const cleanDateStr = now.toISOString().split('T')[0];
    const defaultFilename = currentUser?.applicationNumber 
      ? `KARE_Query_Log_${currentUser.applicationNumber}_${cleanDateStr}.pdf`
      : `KARE_Conversation_Log_${cleanDateStr}.pdf`;

    const finalFilename = customTitle ? `${customTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf` : defaultFilename;

    doc.save(finalFilename);

    return {
      success: true,
      filename: finalFilename
    };
  } catch (err: any) {
    console.error('Failed to generate PDF:', err);
    return {
      success: false,
      error: err?.message || 'Unknown error generating PDF'
    };
  }
}

/**
 * Generates and downloads a clean, beautifully formatted plain text (.txt) transcript of the conversation log.
 */
export function exportChatToText({
  messages,
  currentUser,
  selectedDepartment = 'All',
  customTitle
}: {
  messages: ChatMessage[];
  currentUser: StudentUser | null;
  selectedDepartment?: Department;
  customTitle?: string;
}): { success: boolean; filename: string; error?: string } {
  try {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    let content = '';
    content += '================================================================================\n';
    content += '              KALASALINGAM ACADEMY OF RESEARCH AND EDUCATION (KARE)              \n';
    content += '           Deemed to be University under Section 3 of UGC Act 1956              \n';
    content += '                      Anand Nagar, Krishnankoil - 626126                       \n';
    content += '       KARE AI CAMPUS ENQUIRY ASSISTANT — OFFICIAL CONVERSATION TRANSCRIPT      \n';
    content += '================================================================================\n\n';

    content += '--------------------------------------------------------------------------------\n';
    content += '  SESSION DETAILS & USER PROFILE\n';
    content += '--------------------------------------------------------------------------------\n';
    content += `  Generated On     : ${formattedDate} at ${formattedTime}\n`;
    if (currentUser) {
      content += `  Student Name     : ${currentUser.name}\n`;
      content += `  Registration/App : ${currentUser.applicationNumber || currentUser.rollNumber || currentUser.identifier || currentUser.id}\n`;
      content += `  Email Address    : ${currentUser.collegeEmail || currentUser.email || 'N/A'}\n`;
      content += `  Department       : ${currentUser.department || 'N/A'}\n`;
      content += `  Cohort / Year    : ${getDisplayYearOfStudy(currentUser)}\n`;
      content += `  Admission Status : ${currentUser.admissionStatus || 'Provisional Confirmed'}\n`;
    } else {
      content += `  Student/User     : Guest / Prospective Candidate (Public Session)\n`;
      content += `  Access Mode      : Unauthenticated Public Query Session\n`;
    }
    content += `  Category Scope   : ${selectedDepartment}\n`;
    content += `  Total Messages   : ${messages.length}\n`;
    content += '--------------------------------------------------------------------------------\n\n';

    content += '================================================================================\n';
    content += '  RECORDED CONVERSATION TRANSCRIPT\n';
    content += '================================================================================\n\n';

    let qCounter = 1;
    let aCounter = 1;

    for (const msg of messages) {
      const isUser = msg.sender === 'student';
      const cleanText = cleanMarkdownForPdf(msg.text);
      const timeStr = msg.timestamp || 'Recorded';

      if (isUser) {
        content += `[QUERY #${qCounter}] ────────────────────────────────────────────────────────────\n`;
        content += `Sender   : Student / User\n`;
        content += `Time     : ${timeStr}\n\n`;
        content += `${cleanText}\n\n`;
        qCounter++;
      } else {
        content += `[RESPONSE #${aCounter}] ─────────────────────────────────────────────────────────\n`;
        content += `Sender   : KARE AI Campus Assistant\n`;
        content += `Time     : ${timeStr}\n`;
        if (msg.nlpDetails) {
          const matchSource = msg.nlpDetails.matchType === 'FAQ_DATABASE'
            ? `Verified University Knowledge Base (Cosine Similarity: ${msg.nlpDetails.cosineSimilarity})`
            : msg.nlpDetails.matchType === 'GEMINI_AI'
            ? 'Grounded with Gemini AI • Campus Academic Regulations'
            : 'Hybrid AI Resolution';
          content += `Source   : ${matchSource}\n`;
          if (msg.nlpDetails.matchedFaqQuestion) {
            content += `Matched  : "${msg.nlpDetails.matchedFaqQuestion}"\n`;
          }
        }
        content += `\n${cleanText}\n`;
        content += '────────────────────────────────────────────────────────────────────────────────\n\n';
        aCounter++;
      }
    }

    content += '================================================================================\n';
    content += '  UNIVERSITY HELPLINE & IMPORTANT INFORMATION\n';
    content += '================================================================================\n';
    content += '  Toll-Free Helpline : 1800-425-7884\n';
    content += '  Admissions Desk    : admissions@kare.ac.in | +91 4563 289 042\n';
    content += '  Academic Section   : academic@kare.ac.in\n';
    content += '  Official Website   : https://www.kalasalingam.ac.in\n';
    content += '  Address            : Anand Nagar, Krishnankoil, Srivilliputtur, Tamil Nadu 626126\n';
    content += '  Disclaimer         : This transcript is auto-generated for academic, admission,\n';
    content += '                       and advising reference. Formal regulations remain governed\n';
    content += '                       by the KARE Academic Council.\n';
    content += '================================================================================\n';

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    const cleanDateStr = now.toISOString().split('T')[0];
    const defaultFilename = currentUser?.applicationNumber 
      ? `KARE_Query_Log_${currentUser.applicationNumber}_${cleanDateStr}.txt`
      : `KARE_Conversation_Log_${cleanDateStr}.txt`;

    const finalFilename = customTitle
      ? `${customTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`
      : defaultFilename;

    a.href = url;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return {
      success: true,
      filename: finalFilename
    };
  } catch (err: any) {
    console.error('Failed to generate text file:', err);
    return {
      success: false,
      filename: '',
      error: err?.message || 'Unknown error generating text file'
    };
  }
}
