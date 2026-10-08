import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore,
  setLogLevel,
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  Firestore 
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Filter out internal harmless Firestore stream disconnect logs from polluting server error handlers
try {
  setLogLevel('error');
} catch {}

const originalConsoleError = console.error;
console.error = function (...args: any[]) {
  const msg = typeof args[0] === 'string' ? args[0] : (args[0] ? String(args[0]) : '');
  if (
    msg.includes('Disconnecting idle stream') ||
    msg.includes('Timed out waiting for new targets') ||
    msg.includes("RpcConnection RPC 'Listen' stream") ||
    msg.includes("GrpcConnection RPC 'Listen' stream")
  ) {
    // Normal Firestore WebChannel idle stream cleanup event when no real-time listeners are active
    return;
  }
  originalConsoleError.apply(console, args);
};

export interface PersistentStudent {
  id: string;
  name: string;
  cohort: 'first_year' | 'senior_year';
  identifier: string;
  applicationNumber?: string;
  collegeEmail?: string;
  email?: string;
  joinedYear: number;
  yearOfStudy: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Postgraduate';
  department: string;
  rollNumber?: string;
  phone?: string;
  passwordHash: string;
  registeredAt: string;
  admissionStatus?: 'Provisional Confirmed' | 'Verification Pending' | 'Concession Approved' | 'Seat Confirmed' | 'Hostel Allotted' | 'Enrolled';
  intermediateMarks?: number;
  concessionApplied?: string;
  annualTuitionDue?: string;
  hostelAllotted?: string;
  documentsVerified?: boolean;
  admissionQuota?: string;
  updatedAt?: string;
  dislikedResponses?: any[];
}

export interface PersistentSession {
  token: string;
  studentId: string;
  email?: string;
  createdAt: string;
  expiresAt: string;
}

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let isConnected = false;

/**
 * Initializes and retrieves the Firestore database connection
 * using firebase-applet-config.json.
 */
export function getFirestoreDb(): Firestore | null {
  if (firestoreDb) return firestoreDb;

  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (!fs.existsSync(configPath)) {
      console.warn('[Firestore] Config file firebase-applet-config.json not found');
      return null;
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (!config.projectId) {
      console.warn('[Firestore] Invalid config: Missing projectId');
      return null;
    }

    if (!firebaseApp) {
      const existingApps = getApps();
      if (existingApps.length > 0) {
        firebaseApp = existingApps[0];
      } else {
        firebaseApp = initializeApp(config, 'kare-university-auth-app');
      }
    }

    const databaseId = config.firestoreDatabaseId || '(default)';
    try {
      firestoreDb = initializeFirestore(firebaseApp, {
        ignoreUndefinedProperties: true,
        experimentalAutoDetectLongPolling: true,
      }, databaseId);
    } catch {
      firestoreDb = getFirestore(firebaseApp, databaseId);
    }
    isConnected = true;
    console.log(`[Firestore] Connected successfully to project: ${config.projectId}, database: ${databaseId}`);
    return firestoreDb;
  } catch (err) {
    console.error('[Firestore] Initialization error:', err);
    return null;
  }
}

/**
 * Checks if the Firestore connection is currently active and healthy.
 */
export async function checkFirestoreHealth(): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;
  try {
    const testDocRef = doc(db, 'system', 'connection_test');
    await setDoc(testDocRef, { status: 'healthy', checkedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (err) {
    console.error('[Firestore] Health check failed:', err);
    return false;
  }
}

/**
 * Recursively strips undefined values from an object before saving to Firestore,
 * preventing 'Unsupported field value: undefined' errors.
 */
export function cleanFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as any;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter(item => item !== undefined)
      .map(item => (typeof item === 'object' && item !== null ? cleanFirestoreData(item) : item)) as any;
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        if (typeof value === 'object' && value !== null) {
          cleaned[key] = cleanFirestoreData(value);
        } else {
          cleaned[key] = value;
        }
      }
    }
    return cleaned as T;
  }
  return obj;
}

/**
 * Saves or updates a student account permanently in Firestore.
 */
export async function saveStudentToFirestore(student: PersistentStudent): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) {
    console.warn('[Firestore] DB not available; skipping cloud save');
    return false;
  }

  try {
    const rawPayload = {
      ...student,
      updatedAt: new Date().toISOString()
    };
    const payload = cleanFirestoreData(rawPayload);

    // Save primary document by ID
    const studentDocRef = doc(db, 'students', student.id);
    await setDoc(studentDocRef, payload, { merge: true });

    // Also persist by rollNumber if present, guaranteeing instant O(1) direct lookup by register number
    if (student.rollNumber && student.rollNumber !== student.id) {
      const rollDocRef = doc(db, 'students', student.rollNumber.trim().toLowerCase());
      await setDoc(rollDocRef, payload, { merge: true });
    }

    console.log(`[Firestore] Successfully saved student to database: ${student.id} / ${student.rollNumber || ''} (${student.name})`);
    return true;
  } catch (err) {
    console.error(`[Firestore] Failed to save student ${student.id}:`, err);
    return false;
  }
}

/**
 * Loads all registered students from Firestore database.
 */
export async function loadAllStudentsFromFirestore(): Promise<PersistentStudent[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  try {
    const studentsCol = collection(db, 'students');
    const snapshot = await getDocs(studentsCol);
    const map = new Map<string, PersistentStudent>();
    snapshot.forEach(docSnap => {
      const data = docSnap.data() as PersistentStudent;
      if (data && data.id) {
        // Deduplicate in case saved under both id and rollNumber
        map.set(data.id, data);
      }
    });
    const list = Array.from(map.values());
    console.log(`[Firestore] Fetched ${list.length} student records from Firestore database.`);
    return list;
  } catch (err) {
    console.error('[Firestore] Failed to load students from Firestore:', err);
    return [];
  }
}

/**
 * Looks up a single student by identifier/email/application number/roll number directly in Firestore.
 */
export async function findStudentInFirestore(identifier: string): Promise<PersistentStudent | null> {
  if (!identifier) return null;
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const clean = identifier.trim().toLowerCase();
    
    // Direct ID check first
    const directDoc = await getDoc(doc(db, 'students', clean));
    if (directDoc.exists()) {
      return directDoc.data() as PersistentStudent;
    }

    // Direct clean digits check if identifier has non-digit characters (e.g. email)
    const digitsOnly = clean.replace(/\D/g, '');
    if (digitsOnly && digitsOnly.length >= 5) {
      const digitDoc = await getDoc(doc(db, 'students', digitsOnly));
      if (digitDoc.exists()) {
        return digitDoc.data() as PersistentStudent;
      }
    }

    // Scan all docs in students collection
    const students = await loadAllStudentsFromFirestore();
    return students.find(s => {
      const idMatch = s.id?.toLowerCase() === clean;
      const identMatch = s.identifier?.toLowerCase() === clean;
      const emailMatch = s.email?.toLowerCase() === clean;
      const colEmailMatch = s.collegeEmail?.toLowerCase() === clean;
      const rollMatch = s.rollNumber?.toLowerCase() === clean;
      const appMatch = s.applicationNumber?.toLowerCase() === clean;
      const rollDigitsMatch = digitsOnly && s.rollNumber ? s.rollNumber.replace(/\D/g, '') === digitsOnly : false;

      return idMatch || identMatch || emailMatch || colEmailMatch || rollMatch || appMatch || rollDigitsMatch;
    }) || null;
  } catch (err) {
    console.error(`[Firestore] Error querying student for ${identifier}:`, err);
    return null;
  }
}

/**
 * Creates and persists a secure session token in Firestore.
 * Standard validity: 30 days.
 */
export async function createFirestoreSession(studentId: string, email?: string): Promise<{ token: string; expiresAt: string }> {
  const token = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  const sessionData: PersistentSession = {
    token,
    studentId,
    email: email || '',
    createdAt: now.toISOString(),
    expiresAt
  };

  const db = getFirestoreDb();
  if (db) {
    try {
      await setDoc(doc(db, 'sessions', token), cleanFirestoreData(sessionData));
      console.log(`[Firestore] Created persistent session in database for student: ${studentId}`);
    } catch (err) {
      console.error('[Firestore] Failed to persist session to Firestore:', err);
    }
  }

  return { token, expiresAt };
}

/**
 * Verifies if a given session token exists, is valid, and is not expired in Firestore.
 */
export async function getFirestoreSession(token: string): Promise<PersistentSession | null> {
  if (!token) return null;
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const sessionDoc = await getDoc(doc(db, 'sessions', token));
    if (!sessionDoc.exists()) return null;

    const data = sessionDoc.data() as PersistentSession;
    if (new Date(data.expiresAt).getTime() < Date.now()) {
      // Expired session - clean up
      await deleteDoc(doc(db, 'sessions', token));
      return null;
    }

    return data;
  } catch (err) {
    console.error('[Firestore] Error verifying session token:', err);
    return null;
  }
}

/**
 * Deletes a session token upon logout from Firestore.
 */
export async function deleteFirestoreSession(token: string): Promise<boolean> {
  if (!token) return false;
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    await deleteDoc(doc(db, 'sessions', token));
    console.log(`[Firestore] Deleted session token: ${token.slice(0, 8)}...`);
    return true;
  } catch (err) {
    console.error('[Firestore] Error deleting session:', err);
    return false;
  }
}

/**
 * Saves an AI chat query and generated response to the chat_logs collection in Firestore.
 */
export async function saveChatLogToFirestore(log: {
  id?: string;
  userQuery: string;
  aiResponse: string;
  studentId?: string;
  studentName?: string;
  source?: string;
}): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const id = log.id || `chat-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const payload = cleanFirestoreData({
      id,
      timestamp: new Date().toISOString(),
      userQuery: log.userQuery,
      aiResponse: log.aiResponse,
      studentId: log.studentId || 'guest',
      studentName: log.studentName || 'Student Guest',
      source: log.source || 'gemini-campus-ai'
    });
    await setDoc(doc(db, 'chat_logs', id), payload, { merge: true });
    console.log(`[Firestore] Successfully saved AI chat log to Firestore: ${id}`);
    return true;
  } catch (err) {
    console.error('[Firestore] Error saving AI chat log to Firestore:', err);
    return false;
  }
}

/**
 * Stores university trained knowledge (regulations, admission rules, FAQs, fee structure) in Firestore.
 */
export async function syncTrainedDataToFirestore(items: Array<{
  id: string;
  category: string;
  title: string;
  content: string;
}>): Promise<number> {
  const db = getFirestoreDb();
  if (!db) return 0;

  let count = 0;
  for (const item of items) {
    try {
      const payload = cleanFirestoreData({
        ...item,
        updatedAt: new Date().toISOString()
      });
      await setDoc(doc(db, 'trained_data', item.id), payload, { merge: true });
      count++;
    } catch (err) {
      console.error(`[Firestore] Error storing trained data ${item.id}:`, err);
    }
  }
  console.log(`[Firestore] Synced ${count} trained knowledge items to /trained_data collection`);
  return count;
}
