import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Safely resolve Firebase App and Auth instances without throwing at module load
let firebaseAppInstance: any = null;
let authInstance: any = null;

try {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    firebaseAppInstance = existingApps[0];
  } else if (firebaseConfig && (firebaseConfig as any).apiKey) {
    firebaseAppInstance = initializeApp(firebaseConfig);
  }
  if (firebaseAppInstance) {
    authInstance = getAuth(firebaseAppInstance);
  }
} catch (err) {
  console.warn('[GoogleDriveService] Firebase initialization deferred:', err);
}

export const auth = authInstance;

// Configure Google Auth Provider with Google Drive Scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');
provider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly');
provider.setCustomParameters({
  prompt: 'select_account'
});

// Flag to indicate ongoing sign-in
let isSigningIn = false;

// In-memory access token cache (Strict security requirement: do NOT persist in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;

export interface DriveUser {
  displayName: string;
  emailAddress: string;
  photoLink?: string;
  permissionId?: string;
}

export interface DriveStorageQuota {
  limit?: string;
  usage?: string;
  usageInDrive?: string;
  usageInDriveTrash?: string;
}

export interface DriveAboutInfo {
  user: DriveUser;
  storageQuota: DriveStorageQuota;
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  iconLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  description?: string;
  owners?: DriveUser[];
  shared?: boolean;
  isFolder?: boolean;
  studentTag?: {
    studentId?: string;
    studentName?: string;
    documentType?: string;
  };
}

/**
 * Initialize Drive Auth listener.
 * Listens for auth state changes and clears cached token when logged out.
 */
export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (!auth) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }
  try {
    return onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        if (cachedAccessToken) {
          if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
        } else if (!isSigningIn) {
          cachedAccessToken = null;
          if (onAuthFailure) onAuthFailure();
        }
      } else {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    });
  } catch (err) {
    console.warn('[initDriveAuth] onAuthStateChanged warning:', err);
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }
};

/**
 * Perform Google Sign-In with Google Drive OAuth scopes
 */
export const signInWithGoogleDrive = async (): Promise<{ user: User; accessToken: string }> => {
  if (!auth) {
    throw new Error('Google Drive authentication is not available in this environment.');
  }
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Drive OAuth access token.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Drive sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Sign out of Google Drive and clear in-memory token cache
 */
export const signOutGoogleDrive = async (): Promise<void> => {
  if (!auth) return;
  try {
    await signOut(auth);
    cachedAccessToken = null;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Retrieve the current in-memory access token
 */
export const getDriveAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Manually set the access token (e.g. if refreshed)
 */
export const setDriveAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

/**
 * Fetch Google Drive User & Storage Quota Info
 */
export const getDriveAbout = async (): Promise<DriveAboutInfo | null> => {
  const token = await getDriveAccessToken();
  if (!token) return null;

  try {
    const res = await fetch('https://www.googleapis.com/drive/v3/about?fields=user,storageQuota', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        cachedAccessToken = null;
        throw new Error('Drive authentication token expired. Please sign in again.');
      }
      throw new Error(`Failed to fetch Drive info: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error in getDriveAbout:', error);
    throw error;
  }
};

/**
 * List files in a Google Drive folder or root.
 * Supports filtering by parent folder ID, searching by name, or custom query.
 */
export const listDriveFiles = async (options: {
  folderId?: string;
  searchQuery?: string;
  pageSize?: number;
  pageToken?: string;
  includeFolders?: boolean;
}): Promise<{ files: DriveFileItem[]; nextPageToken?: string }> => {
  const token = await getDriveAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Drive. Please sign in first.');
  }

  const { folderId, searchQuery, pageSize = 50, pageToken } = options;

  // Build Drive query string
  const queryParts: string[] = ['trashed = false'];

  if (folderId && folderId !== 'root') {
    queryParts.push(`'${folderId}' in parents`);
  }

  if (searchQuery && searchQuery.trim()) {
    const clean = searchQuery.trim().replace(/'/g, "\\'");
    queryParts.push(`(name contains '${clean}' or description contains '${clean}')`);
  }

  const q = queryParts.join(' and ');
  const fields = 'nextPageToken, files(id, name, mimeType, modifiedTime, size, iconLink, webViewLink, webContentLink, thumbnailLink, description, owners, shared)';

  const params = new URLSearchParams({
    q,
    fields,
    pageSize: pageSize.toString(),
    orderBy: 'folder,name'
  });

  if (pageToken) {
    params.append('pageToken', pageToken);
  }

  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    if (res.status === 401) {
      cachedAccessToken = null;
      throw new Error('Drive authentication token expired. Please sign in again.');
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to fetch files (${res.status})`);
  }

  const data = await res.json();
  const rawFiles: any[] = data.files || [];

  const files: DriveFileItem[] = rawFiles.map((f) => {
    const isFolder = f.mimeType === 'application/vnd.google-apps.folder';
    
    // Parse student tag from description or filename
    let studentTag = undefined;
    const nameLower = f.name.toLowerCase();
    
    // Heuristic document type tags for student admissions/records
    let docType = 'General Document';
    if (nameLower.includes('10th') || nameLower.includes('ssc') || nameLower.includes('secondary')) {
      docType = '10th Marksheet';
    } else if (nameLower.includes('12th') || nameLower.includes('intermediate') || nameLower.includes('hsc') || nameLower.includes('mpc') || nameLower.includes('bipc')) {
      docType = '12th / Intermediate Marksheet';
    } else if (nameLower.includes('tc') || nameLower.includes('transfer')) {
      docType = 'Transfer Certificate (TC)';
    } else if (nameLower.includes('hall') || nameLower.includes('admit') || nameLower.includes('kare')) {
      docType = 'Entrance Hall Ticket';
    } else if (nameLower.includes('fee') || nameLower.includes('receipt') || nameLower.includes('challan')) {
      docType = 'Tuition Fee Payment Receipt';
    } else if (nameLower.includes('aadhaar') || nameLower.includes('id') || nameLower.includes('passport')) {
      docType = 'Government ID Proof';
    } else if (nameLower.includes('community') || nameLower.includes('caste')) {
      docType = 'Community / Category Certificate';
    } else if (nameLower.includes('conduct') || nameLower.includes('bonafide')) {
      docType = 'Conduct / Bonafide Certificate';
    } else if (nameLower.includes('resume') || nameLower.includes('cv')) {
      docType = 'Placement Resume';
    }

    // Extract student register number or application ID pattern (e.g. 9921004123 or KARE2025...)
    const idMatch = f.name.match(/([0-9]{8,10}|KARE[0-9A-Z]{4,8}|APP[0-9]{4,8})/i);
    const studentId = idMatch ? idMatch[1] : undefined;

    studentTag = {
      studentId,
      studentName: f.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
      documentType: docType
    };

    return {
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      modifiedTime: f.modifiedTime,
      size: f.size,
      iconLink: f.iconLink,
      webViewLink: f.webViewLink,
      webContentLink: f.webContentLink,
      thumbnailLink: f.thumbnailLink,
      description: f.description,
      owners: f.owners,
      shared: f.shared,
      isFolder,
      studentTag
    };
  });

  return {
    files,
    nextPageToken: data.nextPageToken
  };
};

/**
 * Create a new folder in Google Drive
 */
export const createDriveFolder = async (
  folderName: string,
  parentFolderId?: string
): Promise<DriveFileItem> => {
  const token = await getDriveAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive.');

  const metadata: any = {
    name: folderName.trim(),
    mimeType: 'application/vnd.google-apps.folder'
  };

  if (parentFolderId && parentFolderId !== 'root') {
    metadata.parents = [parentFolderId];
  }

  const res = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,mimeType,modifiedTime,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to create folder in Google Drive.');
  }

  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    mimeType: data.mimeType,
    modifiedTime: data.modifiedTime,
    webViewLink: data.webViewLink,
    isFolder: true
  };
};

/**
 * Upload a document directly to Google Drive using multipart upload
 */
export const uploadDriveFile = async (
  file: File,
  parentFolderId?: string,
  description?: string
): Promise<DriveFileItem> => {
  const token = await getDriveAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive.');

  const metadata: any = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    description: description || 'Uploaded via KARE Student Portal'
  };

  if (parentFolderId && parentFolderId !== 'root') {
    metadata.parents = [parentFolderId];
  }

  const boundary = '-------kare_drive_boundary_' + Math.random().toString(36).substring(2);
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const reader = new FileReader();
  const fileDataPromise = new Promise<ArrayBuffer>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

  const arrayBuffer = await fileDataPromise;
  const uint8Array = new Uint8Array(arrayBuffer);

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
  const mediaPartHeader = `${delimiter}Content-Type: ${file.type || 'application/octet-stream'}\r\nContent-Transfer-Encoding: binary\r\n\r\n`;

  const encoder = new TextEncoder();
  const part1 = encoder.encode(metadataPart);
  const part2 = encoder.encode(mediaPartHeader);
  const part3 = uint8Array;
  const part4 = encoder.encode(closeDelimiter);

  const fullBody = new Uint8Array(part1.length + part2.length + part3.length + part4.length);
  fullBody.set(part1, 0);
  fullBody.set(part2, part1.length);
  fullBody.set(part3, part1.length + part2.length);
  fullBody.set(part4, part1.length + part2.length + part3.length);

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,size,webViewLink,webContentLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: fullBody
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to upload document to Google Drive.');
  }

  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    mimeType: data.mimeType,
    modifiedTime: data.modifiedTime,
    size: data.size,
    webViewLink: data.webViewLink,
    webContentLink: data.webContentLink,
    isFolder: false
  };
};

/**
 * Delete a file or folder from Google Drive
 * NOTE: As per system rules, this must be preceded by an explicit user confirmation dialog.
 */
export const deleteDriveFile = async (fileId: string): Promise<boolean> => {
  const token = await getDriveAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive.');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to delete file (${res.status})`);
  }

  return true;
};
