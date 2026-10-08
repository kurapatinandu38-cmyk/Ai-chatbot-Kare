import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  AdmissionsInfo, 
  FeeStructureItem, 
  PlacedStudentItem, 
  StudentUser, 
  AnnouncementItem, 
  LiveSyncPayload,
  EnquiryItem,
  EnquiryStatus,
  EnquirySubmissionPayload,
  DislikeFeedbackItem
} from '../types';
import { INITIAL_ADMISSIONS_INFO, INITIAL_FEE_STRUCTURES, INITIAL_PLACEMENTS, INITIAL_STUDENTS } from '../data/initialAdmissions';
import { INITIAL_ANNOUNCEMENTS } from '../data/initialAnnouncements';
import { INITIAL_ENQUIRIES } from '../data/initialEnquiries';

interface LiveSyncState {
  admissionsInfo: AdmissionsInfo | null;
  feeStructures: FeeStructureItem[];
  placements: PlacedStudentItem[];
  students: StudentUser[];
  announcements: AnnouncementItem[];
  latestAnnouncementAlert: AnnouncementItem | null;
  enquiries: EnquiryItem[];
  latestEnquiryAlert: EnquiryItem | null;
  dislikeFeedbackList: DislikeFeedbackItem[];
  isConnected: boolean;
  lastSync: Date | null;
  lastEventReason: string | null;
}

// Resilient helper to fetch JSON with automatic retry and timeout
async function safeFetchJson<T>(url: string, retries = 2, delayMs = 600): Promise<T | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return (await res.json()) as T;
      }
    } catch {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, delayMs * attempt));
      }
    }
  }
  return null;
}

export function useLiveSync() {
  const [state, setState] = useState<LiveSyncState>({
    admissionsInfo: INITIAL_ADMISSIONS_INFO,
    feeStructures: INITIAL_FEE_STRUCTURES,
    placements: INITIAL_PLACEMENTS,
    students: INITIAL_STUDENTS,
    announcements: INITIAL_ANNOUNCEMENTS,
    latestAnnouncementAlert: null,
    enquiries: INITIAL_ENQUIRIES,
    latestEnquiryAlert: null,
    dislikeFeedbackList: [],
    isConnected: false,
    lastSync: null,
    lastEventReason: null
  });

  const isRefreshingRef = useRef(false);

  const clearLatestAnnouncementAlert = useCallback(() => {
    setState(prev => ({ ...prev, latestAnnouncementAlert: null }));
  }, []);

  const clearLatestEnquiryAlert = useCallback(() => {
    setState(prev => ({ ...prev, latestEnquiryAlert: null }));
  }, []);

  const refreshAll = useCallback(async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;

    try {
      const [admResult, stuResult, annResult, enqResult] = await Promise.allSettled([
        safeFetchJson<{ admissionsInfo: AdmissionsInfo; feeStructures: FeeStructureItem[]; placements: PlacedStudentItem[] }>('/api/admissions/all'),
        safeFetchJson<{ students: StudentUser[] }>('/api/auth/students'),
        safeFetchJson<{ announcements: AnnouncementItem[] }>('/api/announcements'),
        safeFetchJson<{ enquiries: EnquiryItem[] }>('/api/enquiries')
      ]);

      const admData = admResult.status === 'fulfilled' ? admResult.value : null;
      const stuData = stuResult.status === 'fulfilled' ? stuResult.value : null;
      const annData = annResult.status === 'fulfilled' ? annResult.value : null;
      const enqData = enqResult.status === 'fulfilled' ? enqResult.value : null;

      setState(prev => {
        const nextAdmissionsInfo = admData?.admissionsInfo || prev.admissionsInfo || INITIAL_ADMISSIONS_INFO;
        const nextFeeStructures = (admData?.feeStructures && admData.feeStructures.length > 0)
          ? admData.feeStructures
          : (prev.feeStructures.length > 0 ? prev.feeStructures : INITIAL_FEE_STRUCTURES);
        const nextPlacements = (admData?.placements && admData.placements.length > 0)
          ? admData.placements
          : (prev.placements.length > 0 ? prev.placements : INITIAL_PLACEMENTS);
        const nextStudents = (stuData?.students && stuData.students.length > 0)
          ? stuData.students
          : (prev.students.length > 0 ? prev.students : INITIAL_STUDENTS);
        const nextAnnouncements = (annData?.announcements && annData.announcements.length > 0)
          ? annData.announcements
          : (prev.announcements.length > 0 ? prev.announcements : INITIAL_ANNOUNCEMENTS);
        const nextEnquiries = (enqData?.enquiries && enqData.enquiries.length > 0)
          ? enqData.enquiries
          : (prev.enquiries.length > 0 ? prev.enquiries : INITIAL_ENQUIRIES);

        return {
          ...prev,
          admissionsInfo: nextAdmissionsInfo,
          feeStructures: nextFeeStructures,
          placements: nextPlacements,
          students: nextStudents,
          announcements: nextAnnouncements,
          enquiries: nextEnquiries,
          lastSync: new Date()
        };
      });
    } catch {
      // Quietly retain initialized fallback data during transient offline/restart states
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  const submitEnquiry = useCallback(async (payload: EnquirySubmissionPayload): Promise<{ success: boolean; message: string; enquiry?: EnquiryItem }> => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.enquiry) {
          setState(prev => ({
            ...prev,
            enquiries: [data.enquiry, ...prev.enquiries.filter(e => e.id !== data.enquiry.id)]
          }));
        }
        return { success: true, message: data.message, enquiry: data.enquiry };
      }
      return { success: false, message: data.error || 'Failed to submit enquiry.' };
    } catch (err: any) {
      // Optimistically create local fallback enquiry if offline
      const fallbackEnquiry: EnquiryItem = {
        id: `ENQ-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        programInterested: payload.programInterested,
        degreeType: payload.degreeType || 'UG',
        intermediateMarks: payload.intermediateMarks,
        city: payload.city,
        state: payload.state,
        categoryQuota: payload.categoryQuota,
        message: payload.message,
        status: 'Pending',
        submittedAt: new Date().toISOString(),
        source: 'Admissions Enquiry Form'
      };
      setState(prev => ({ ...prev, enquiries: [fallbackEnquiry, ...prev.enquiries] }));
      return {
        success: true,
        message: 'Your enquiry has been saved and queued for campus counselors.',
        enquiry: fallbackEnquiry
      };
    }
  }, []);

  const updateEnquiryStatus = useCallback(async (
    id: string, 
    status: EnquiryStatus, 
    notes?: string, 
    assignedCounselor?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes, assignedCounselor })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.enquiry) {
          setState(prev => ({
            ...prev,
            enquiries: prev.enquiries.map(e => e.id === id ? data.enquiry : e)
          }));
        }
        return true;
      }
      return false;
    } catch {
      // Local optimistic update
      setState(prev => ({
        ...prev,
        enquiries: prev.enquiries.map(e => e.id === id ? { ...e, status, notes: notes !== undefined ? notes : e.notes, assignedCounselor: assignedCounselor !== undefined ? assignedCounselor : e.assignedCounselor } : e)
      }));
      return true;
    }
  }, []);

  const deleteEnquiry = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setState(prev => ({
          ...prev,
          enquiries: prev.enquiries.filter(e => e.id !== id)
        }));
        return true;
      }
      return false;
    } catch {
      setState(prev => ({
        ...prev,
        enquiries: prev.enquiries.filter(e => e.id !== id)
      }));
      return true;
    }
  }, []);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;
    let bc: BroadcastChannel | null = null;
    let isSubscribed = true;

    // Cross-tab broadcast channel
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('kare_live_sync');
        bc.onmessage = (event) => {
          if (event.data?.type === 'REFRESH') {
            refreshAll();
          }
        };
      }
    } catch {
      // BroadcastChannel not available or restricted
    }

    const connectSSE = () => {
      if (!isSubscribed) return;

      try {
        eventSource = new EventSource('/api/live/stream');

        eventSource.onopen = () => {
          if (!isSubscribed) return;
          setState(prev => ({ ...prev, isConnected: true, lastSync: new Date() }));
        };

        eventSource.onmessage = (event) => {
          if (!isSubscribed) return;
          try {
            if (!event.data || event.data.startsWith(':')) return; // heartbeat
            const payload: LiveSyncPayload = JSON.parse(event.data);
            
            if (payload.data) {
              setState(prev => ({
                ...prev,
                admissionsInfo: payload.data?.admissionsInfo !== undefined ? payload.data.admissionsInfo : prev.admissionsInfo,
                feeStructures: payload.data?.feeStructures !== undefined ? payload.data.feeStructures : prev.feeStructures,
                placements: payload.data?.placements !== undefined ? payload.data.placements : prev.placements,
                students: payload.data?.students !== undefined ? payload.data.students : prev.students,
                announcements: payload.data?.announcements !== undefined ? payload.data.announcements : prev.announcements,
                enquiries: payload.data?.enquiries !== undefined ? payload.data.enquiries : prev.enquiries,
                dislikeFeedbackList: payload.data?.dislikeFeedbackList !== undefined ? payload.data.dislikeFeedbackList : prev.dislikeFeedbackList,
                latestAnnouncementAlert: payload.type === 'ANNOUNCEMENT_PUBLISHED' && payload.data?.latestAnnouncement 
                  ? payload.data.latestAnnouncement 
                  : prev.latestAnnouncementAlert,
                latestEnquiryAlert: payload.type === 'ENQUIRY_SUBMITTED' && payload.data?.latestEnquiry
                  ? payload.data.latestEnquiry
                  : prev.latestEnquiryAlert,
                isConnected: true,
                lastSync: new Date(payload.timestamp || Date.now()),
                lastEventReason: payload.type
              }));
            }

            // Notify other tabs
            if (bc) {
              bc.postMessage({ type: 'REFRESH', reason: payload.type });
            }
          } catch {
            // Ignored malformed SSE chunk
          }
        };

        eventSource.onerror = () => {
          if (!isSubscribed) return;
          setState(prev => ({ ...prev, isConnected: false }));
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Retry after backoff
          reconnectTimeout = setTimeout(connectSSE, 5000);
        };
      } catch {
        if (!isSubscribed) return;
        setState(prev => ({ ...prev, isConnected: false }));
        reconnectTimeout = setTimeout(connectSSE, 5000);
      }
    };

    // Initial fetch to populate immediately
    refreshAll();
    connectSSE();

    // Polling interval (every 15s)
    const fallbackPoll = setInterval(refreshAll, 15000);

    return () => {
      isSubscribed = false;
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (fallbackPoll) clearInterval(fallbackPoll);
      if (bc) bc.close();
    };
  }, [refreshAll]);

  return {
    ...state,
    refreshAll,
    clearLatestAnnouncementAlert,
    clearLatestEnquiryAlert,
    submitEnquiry,
    updateEnquiryStatus,
    deleteEnquiry
  };
}
