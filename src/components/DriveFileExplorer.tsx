import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Folder,
  FileText,
  FileCheck,
  UploadCloud,
  FolderPlus,
  RefreshCw,
  Search,
  Trash2,
  ExternalLink,
  Download,
  AlertCircle,
  HardDrive,
  User as UserIcon,
  LogOut,
  ChevronRight,
  Filter,
  Grid,
  List,
  FileSpreadsheet,
  FileImage,
  FileCode,
  File,
  CheckCircle2,
  X,
  Plus
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  DriveFileItem,
  DriveAboutInfo,
  initDriveAuth,
  signInWithGoogleDrive,
  signOutGoogleDrive,
  getDriveAbout,
  listDriveFiles,
  createDriveFolder,
  uploadDriveFile,
  deleteDriveFile
} from '../services/googleDriveService';

interface DriveFileExplorerProps {
  initialFolderId?: string;
  preselectedStudentId?: string;
  preselectedStudentName?: string;
  onSelectDocument?: (doc: DriveFileItem) => void;
  className?: string;
}

interface BreadcrumbItem {
  id: string;
  name: string;
}

export const DriveFileExplorer: React.FC<DriveFileExplorerProps> = ({
  initialFolderId = 'root',
  preselectedStudentId,
  preselectedStudentName,
  onSelectDocument,
  className = ''
}) => {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Drive About & Quota
  const [aboutInfo, setAboutInfo] = useState<DriveAboutInfo | null>(null);

  // Explorer navigation & files
  const [currentFolderId, setCurrentFolderId] = useState<string>(initialFolderId);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: 'root', name: 'Google Drive' }
  ]);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState(preselectedStudentId || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals & Drawers
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<DriveFileItem | null>(null);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadStudentId, setUploadStudentId] = useState(preselectedStudentId || '');
  const [uploadDocType, setUploadDocType] = useState('12th / Intermediate Marksheet');
  const [uploadDescription, setUploadDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // New Folder Form State
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Delete Confirmation State (Mandatory User Confirmation as per Workspace Skill)
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification Toast
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // 1. Initialize Auth Listener on mount
  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (authedUser, accessToken) => {
        setUser(authedUser);
        setToken(accessToken);
        setIsAuthLoading(false);
        loadDriveAbout();
      },
      () => {
        setUser(null);
        setToken(null);
        setIsAuthLoading(false);
        setAboutInfo(null);
        setFiles([]);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // 2. Fetch Drive Quota & User info
  const loadDriveAbout = async () => {
    try {
      const info = await getDriveAbout();
      if (info) setAboutInfo(info);
    } catch (err: any) {
      console.warn('Could not load Drive about info:', err);
    }
  };

  // 3. Fetch files for current folder
  const fetchFiles = useCallback(async (folderId: string, search?: string) => {
    setIsLoadingFiles(true);
    setFetchError(null);
    try {
      const res = await listDriveFiles({
        folderId,
        searchQuery: search || undefined,
        pageSize: 100
      });
      setFiles(res.files);
    } catch (err: any) {
      console.error('Error fetching Drive files:', err);
      setFetchError(err.message || 'Failed to list files from Google Drive');
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  // Fetch when token or currentFolderId changes
  useEffect(() => {
    if (token) {
      fetchFiles(currentFolderId, searchQuery);
    }
  }, [token, currentFolderId, fetchFiles]);

  // Handle Google Sign-In
  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const res = await signInWithGoogleDrive();
      setUser(res.user);
      setToken(res.accessToken);
      showToast(`Connected to Google Drive as ${res.user.displayName || res.user.email}`);
      loadDriveAbout();
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setAuthError(err.message || 'Google Drive authentication was cancelled or failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Google Sign-Out
  const handleSignOut = async () => {
    try {
      await signOutGoogleDrive();
      setUser(null);
      setToken(null);
      setFiles([]);
      showToast('Signed out of Google Drive.');
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  // Navigate into a folder
  const handleOpenFolder = (folder: DriveFileItem) => {
    setCurrentFolderId(folder.id);
    setBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }]);
  };

  // Navigate via breadcrumbs
  const handleBreadcrumbClick = (index: number) => {
    const target = breadcrumbs[index];
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    setCurrentFolderId(target.id);
  };

  // Quick action: Initialize KARE Student Archive folder
  const handleInitArchiveFolder = async () => {
    setIsCreatingFolder(true);
    try {
      const folder = await createDriveFolder('KARE Student Records & Certificates', currentFolderId);
      showToast(`Created archive folder "${folder.name}" on Google Drive.`);
      fetchFiles(currentFolderId);
    } catch (err: any) {
      showToast(err.message || 'Failed to create folder', 'error');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Handle File Upload Submit
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadProgress(20);

    try {
      // Build descriptive file name if student ID is provided
      let finalName = uploadFile.name;
      const cleanType = uploadDocType.replace(/[/\\?%*:|"<>]/g, '-');
      if (uploadStudentId.trim()) {
        const ext = uploadFile.name.split('.').pop() || '';
        finalName = `${uploadStudentId.trim()}_${cleanType}.${ext}`;
      }

      // Create a renamed file object
      const taggedFile: any = (typeof window !== 'undefined' && (window as any).File)
        ? new (window as any).File([uploadFile], finalName, { type: uploadFile.type })
        : uploadFile;

      setUploadProgress(50);
      const desc = `Student ID: ${uploadStudentId.trim()} | Doc Type: ${uploadDocType} | ${uploadDescription}`.trim();
      const uploaded = await uploadDriveFile(taggedFile, currentFolderId, desc);

      setUploadProgress(100);
      showToast(`Successfully uploaded "${uploaded.name}" to Google Drive.`);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadDescription('');
      fetchFiles(currentFolderId);
    } catch (err: any) {
      console.error('Upload error:', err);
      showToast(err.message || 'File upload failed', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle Create New Folder Submit
  const handleCreateFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      const folder = await createDriveFolder(newFolderName.trim(), currentFolderId);
      showToast(`Created folder "${folder.name}".`);
      setNewFolderName('');
      setShowNewFolderModal(false);
      fetchFiles(currentFolderId);
    } catch (err: any) {
      showToast(err.message || 'Folder creation failed', 'error');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Handle Delete Confirmation (Mandatory Dialog requirement)
  const handleExecuteDelete = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);

    try {
      await deleteDriveFile(fileToDelete.id);
      showToast(`Deleted "${fileToDelete.name}" from Google Drive.`);
      setFiles(prev => prev.filter(f => f.id !== fileToDelete.id));
      if (selectedFileForPreview?.id === fileToDelete.id) {
        setSelectedFileForPreview(null);
      }
      setFileToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete file from Google Drive', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper to format byte sizes
  const formatBytes = (bytes?: string | number) => {
    if (!bytes) return '—';
    const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
    if (isNaN(num)) return '—';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    if (num < 1024 * 1024 * 1024) return `${(num / (1024 * 1024)).toFixed(1)} MB`;
    return `${(num / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // Helper icon for mime type
  const getFileIcon = (file: DriveFileItem) => {
    if (file.isFolder) {
      return <Folder className="w-5 h-5 text-amber-400 fill-amber-400/20" />;
    }
    const mime = file.mimeType.toLowerCase();
    if (mime.includes('pdf')) {
      return <FileText className="w-5 h-5 text-rose-400" />;
    }
    if (mime.includes('spreadsheet') || mime.includes('sheet') || mime.includes('csv')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    }
    if (mime.includes('image')) {
      return <FileImage className="w-5 h-5 text-blue-400" />;
    }
    if (mime.includes('document') || mime.includes('word')) {
      return <FileCode className="w-5 h-5 text-indigo-400" />;
    }
    return <File className="w-5 h-5 text-zinc-400" />;
  };

  // Filtered files by category and search
  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'folders' && !f.isFolder) return false;
        if (selectedCategory !== 'folders') {
          const docType = f.studentTag?.documentType || '';
          if (!docType.toLowerCase().includes(selectedCategory.toLowerCase())) return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = f.name.toLowerCase().includes(q);
        const matchesTag = f.studentTag?.studentId?.toLowerCase().includes(q) ||
          f.studentTag?.documentType?.toLowerCase().includes(q);
        const matchesDesc = (f.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesTag && !matchesDesc) return false;
      }

      return true;
    });
  }, [files, selectedCategory, searchQuery]);

  return (
    <div className={`space-y-4 text-white ${className}`}>
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl backdrop-blur-md animate-fadeIn ${
          notification.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
            : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header & Connection Deck */}
      <div className="bg-[#0e0e0e] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border border-blue-500/30 text-blue-400">
              <HardDrive className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Google Drive Student Archive</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  user
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}>
                  {user ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Authenticated Google Drive file explorer for verified student certificates, marksheets, and fee receipts
              </p>
            </div>
          </div>

          {/* Right Action: Sign-in / Connected user pill */}
          <div className="flex items-center gap-2 shrink-0">
            {isAuthLoading ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Checking Drive Auth...</span>
              </div>
            ) : user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'Drive User'} className="w-5 h-5 rounded-full" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-blue-400" />
                  )}
                  <span className="font-medium max-w-[140px] truncate">{user.displayName || user.email}</span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Disconnect Google Drive"
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isLoggingIn}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 font-semibold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {/* Official Google SVG icon */}
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quota Bar (If user connected) */}
        {aboutInfo && aboutInfo.storageQuota && (
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-zinc-300">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>Storage Quota:</span>
              <strong className="text-white font-mono">{formatBytes(aboutInfo.storageQuota.usageInDrive || aboutInfo.storageQuota.usage)}</strong>
              <span className="text-zinc-500">used of</span>
              <span className="text-zinc-400 font-mono">{aboutInfo.storageQuota.limit ? formatBytes(aboutInfo.storageQuota.limit) : 'Unlimited'}</span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">
              Account: {aboutInfo.user.emailAddress}
            </span>
          </div>
        )}

        {/* Auth Warning Error */}
        {authError && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{authError}</span>
          </div>
        )}
      </div>

      {/* Main Explorer Area (When connected) */}
      {!user ? (
        <div className="bg-[#0a0a0a] border border-zinc-800/90 rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
            <HardDrive className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h4 className="text-base font-bold text-white">Connect Google Drive to Access Student Files</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Authenticate using your Google Workspace account with permission from the app's users to list, preview, and upload student verification certificates directly into cloud storage.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isLoggingIn}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
            >
              <HardDrive className="w-4 h-4" />
              <span>{isLoggingIn ? 'Authorizing Google Drive...' : 'Authorize Google Drive Access'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
          
          {/* Breadcrumbs & Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.id + idx}>
                    <button
                      type="button"
                      onClick={() => handleBreadcrumbClick(idx)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors font-medium ${
                        isLast
                          ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                      }`}
                    >
                      {idx === 0 ? <HardDrive className="w-3.5 h-3.5 text-blue-400" /> : <Folder className="w-3.5 h-3.5 text-amber-400" />}
                      <span className="truncate max-w-[140px]">{crumb.name}</span>
                    </button>
                    {!isLast && <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Action Buttons: New Folder, Upload, Refresh */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => fetchFiles(currentFolderId, searchQuery)}
                disabled={isLoadingFiles}
                title="Refresh Files"
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => setShowNewFolderModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>New Folder</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-500 text-xs font-semibold text-white transition-colors shadow-sm shadow-blue-600/20"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Document</span>
              </button>

              {/* View toggle */}
              <div className="hidden sm:flex items-center border border-zinc-800 rounded-xl bg-zinc-900 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Table View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar & Document Category Pills */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student documents by register number, application ID, or keyword..."
                  className="w-full bg-[#141414] border border-zinc-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Preselected Student Highlight Pill */}
              {preselectedStudentId && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs shrink-0">
                  <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Filtering: <strong>{preselectedStudentId}</strong></span>
                  {preselectedStudentName && <span className="text-zinc-400">({preselectedStudentName})</span>}
                </div>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[11px]">
              <span className="text-zinc-500 flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3" /> Filters:
              </span>
              {[
                { id: 'all', label: 'All Files' },
                { id: 'folders', label: 'Folders' },
                { id: '12th', label: '12th / Intermediate' },
                { id: '10th', label: '10th Marksheet' },
                { id: 'transfer', label: 'Transfer Cert (TC)' },
                { id: 'entrance', label: 'Entrance Ticket' },
                { id: 'receipt', label: 'Fee Receipt' },
                { id: 'id proof', label: 'Govt ID' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors font-medium ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                      : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Files List / Grid */}
          {isLoadingFiles ? (
            <div className="p-12 text-center text-zinc-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-400" />
              <p className="text-xs">Fetching items from Google Drive...</p>
            </div>
          ) : fetchError ? (
            <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-800/40 text-center space-y-3">
              <AlertCircle className="w-6 h-6 text-rose-400 mx-auto" />
              <p className="text-xs text-rose-200">{fetchError}</p>
              <button
                type="button"
                onClick={() => fetchFiles(currentFolderId)}
                className="px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-900 border border-rose-700 text-xs font-semibold text-white"
              >
                Retry Request
              </button>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="p-10 text-center border border-dashed border-zinc-800 rounded-2xl space-y-3">
              <Folder className="w-8 h-8 text-zinc-600 mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-300">No documents found in this folder</p>
                <p className="text-[11px] text-zinc-500">
                  {searchQuery ? `No files matching "${searchQuery}"` : 'Upload student certificates or create an organized folder.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleInitArchiveFolder}
                  disabled={isCreatingFolder}
                  className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Create KARE Archive Folder</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredFiles.map((item) => (
                <div
                  key={item.id}
                  className="group relative p-3 rounded-xl bg-[#121212] hover:bg-[#181818] border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between gap-3 shadow-sm hover:shadow-lg"
                >
                  <div
                    onClick={() => {
                      if (item.isFolder) {
                        handleOpenFolder(item);
                      } else {
                        setSelectedFileForPreview(item);
                        if (onSelectDocument) onSelectDocument(item);
                      }
                    }}
                    className="cursor-pointer space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/80 group-hover:border-zinc-700 transition-colors">
                        {getFileIcon(item)}
                      </div>
                      
                      {/* Document Type Badge */}
                      {item.studentTag && !item.isFolder && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30 truncate max-w-[120px]">
                          {item.studentTag.documentType}
                        </span>
                      )}
                      {item.isFolder && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          Folder
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate" title={item.name}>
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        {item.isFolder ? 'Folder' : formatBytes(item.size)} • {new Date(item.modifiedTime).toLocaleDateString()}
                      </p>
                    </div>

                    {item.studentTag?.studentId && (
                      <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                        <span className="text-zinc-500">Reg/App:</span>
                        <strong className="text-blue-400">{item.studentTag.studentId}</strong>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                    <button
                      type="button"
                      onClick={() => {
                        if (item.isFolder) {
                          handleOpenFolder(item);
                        } else {
                          setSelectedFileForPreview(item);
                        }
                      }}
                      className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                    >
                      {item.isFolder ? 'Open Folder' : 'Details'}
                    </button>

                    <div className="flex items-center gap-1">
                      {item.webViewLink && (
                        <a
                          href={item.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open in Google Drive"
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {item.webContentLink && (
                        <a
                          href={item.webContentLink}
                          download
                          title="Direct Download"
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {/* Delete with Mandatory Confirmation */}
                      <button
                        type="button"
                        onClick={() => setFileToDelete(item)}
                        title="Delete File from Drive"
                        className="p-1 rounded hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="overflow-x-auto border border-zinc-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141414] border-b border-zinc-800 text-zinc-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Item Name</th>
                    <th className="p-3">Doc Type / Tag</th>
                    <th className="p-3">Student Ref</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Modified</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredFiles.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#151515] transition-colors group"
                    >
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.isFolder) {
                              handleOpenFolder(item);
                            } else {
                              setSelectedFileForPreview(item);
                              if (onSelectDocument) onSelectDocument(item);
                            }
                          }}
                          className="flex items-center gap-2 text-left font-medium text-zinc-200 hover:text-white"
                        >
                          {getFileIcon(item)}
                          <span className="truncate max-w-xs">{item.name}</span>
                        </button>
                      </td>
                      <td className="p-3">
                        {item.isFolder ? (
                          <span className="text-zinc-500 font-mono">Folder</span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                            {item.studentTag?.documentType || 'Document'}
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-zinc-400">
                        {item.studentTag?.studentId ? (
                          <span className="text-blue-400 font-bold">{item.studentTag.studentId}</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-3 font-mono text-zinc-400">
                        {item.isFolder ? '—' : formatBytes(item.size)}
                      </td>
                      <td className="p-3 font-mono text-zinc-400">
                        {new Date(item.modifiedTime).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.webViewLink && (
                            <a
                              href={item.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                              title="Open in Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setFileToDelete(item)}
                            className="p-1 rounded hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: UPLOAD DOCUMENT MODAL */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0e0e0e] border border-zinc-800 rounded-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Upload Student Certificate / Document</h3>
                  <p className="text-[11px] text-zinc-400">Directly syncs to Google Drive connected folder</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* File Drop Area */}
              <div>
                <label className="block text-zinc-300 font-medium mb-1.5">Select Document File:</label>
                <div className="border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-xl p-5 text-center transition-colors bg-[#141414]">
                  <input
                    type="file"
                    required
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="drive-file-input"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  />
                  <label htmlFor="drive-file-input" className="cursor-pointer block space-y-2">
                    <UploadCloud className="w-8 h-8 text-blue-400 mx-auto" />
                    {uploadFile ? (
                      <div>
                        <p className="font-semibold text-emerald-400">{uploadFile.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{formatBytes(uploadFile.size)}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-zinc-300">Click to browse or drag and drop</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">PDF, PNG, JPG, Word, Excel (Max 50MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Student Register / Application Number */}
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Student Register / Application Number (Optional):
                </label>
                <input
                  type="text"
                  value={uploadStudentId}
                  onChange={(e) => setUploadStudentId(e.target.value)}
                  placeholder="e.g. 9921004123 or KARE20250084"
                  className="w-full bg-[#161616] border border-zinc-800 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Document Category Type */}
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Document Classification:</label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value)}
                  className="w-full bg-[#161616] border border-zinc-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="12th / Intermediate Marksheet">12th / Intermediate Marksheet (+2)</option>
                  <option value="10th Marksheet">10th Standard Marksheet / SSC</option>
                  <option value="Transfer Certificate (TC)">Transfer Certificate (TC) & Migration</option>
                  <option value="Entrance Hall Ticket">KARE Entrance Hall Ticket / Rank Card</option>
                  <option value="Tuition Fee Payment Receipt">Tuition Fee Payment Receipt / Challan</option>
                  <option value="Government ID Proof">Aadhaar Card / Passport / Voter ID</option>
                  <option value="Community / Category Certificate">Community / Caste / Income Certificate</option>
                  <option value="Conduct / Bonafide Certificate">Conduct / Study Bonafide Certificate</option>
                  <option value="Placement Resume">Placement Resume & Internships Portfolio</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Notes / Verification Remarks:</label>
                <textarea
                  rows={2}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="e.g. Original verified by Admissions Desk counter 3..."
                  className="w-full bg-[#161616] border border-zinc-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 text-center font-mono">Uploading to Google Drive...</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !uploadFile}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading...' : 'Confirm & Upload to Drive'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CREATE FOLDER MODAL */}
      {/* ========================================================================= */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0e0e0e] border border-zinc-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Create New Folder in Drive</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFolderSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Folder Name:</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Admissions 2025-26 or B.Tech AIML Cohort"
                  className="w-full bg-[#161616] border border-zinc-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  disabled={isCreatingFolder}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingFolder || !newFolderName.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreatingFolder ? 'Creating...' : 'Create Folder'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: MANDATORY USER CONFIRMATION FOR DESTRUCTIVE OPERATION */}
      {/* Required by skills/system_skills/workspace_integration/SKILL.md */}
      {/* ========================================================================= */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121212] border border-rose-800/80 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-white">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirm Google Drive Deletion</h3>
                <p className="text-xs text-zinc-400">Destructive Workspace API Operation</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 text-xs text-rose-200 space-y-2">
              <p>
                Are you sure you want to permanently delete{' '}
                <strong className="text-white font-mono">{fileToDelete.name}</strong> from Google Drive?
              </p>
              <p className="text-[11px] text-zinc-400">
                This will remove the file from your connected cloud storage. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting from Drive...' : 'Delete File'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER / MODAL 4: FILE DETAILS & PREVIEW */}
      {/* ========================================================================= */}
      {selectedFileForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0e0e0e] border border-zinc-800 rounded-2xl w-full max-w-xl p-5 sm:p-6 space-y-4 shadow-2xl text-white">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                  {getFileIcon(selectedFileForPreview)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate max-w-md">
                    {selectedFileForPreview.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    ID: {selectedFileForPreview.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFileForPreview(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#141414] border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Document Classification</span>
                <span className="font-medium text-blue-300">
                  {selectedFileForPreview.studentTag?.documentType || 'General Document'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141414] border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Student Register / App Ref</span>
                <span className="font-mono font-bold text-emerald-400">
                  {selectedFileForPreview.studentTag?.studentId || 'Not Tagged'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141414] border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">File Size</span>
                <span className="font-mono text-zinc-300">
                  {formatBytes(selectedFileForPreview.size)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141414] border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Last Modified</span>
                <span className="font-mono text-zinc-300">
                  {new Date(selectedFileForPreview.modifiedTime).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Description Notes */}
            {selectedFileForPreview.description && (
              <div className="p-3 rounded-xl bg-[#141414] border border-zinc-800/80 text-xs">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block mb-1">Description & Remarks</span>
                <p className="text-zinc-300 leading-relaxed">{selectedFileForPreview.description}</p>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setFileToDelete(selectedFileForPreview);
                  setSelectedFileForPreview(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete File</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedFileForPreview.webContentLink && (
                  <a
                    href={selectedFileForPreview.webContentLink}
                    download
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                )}
                {selectedFileForPreview.webViewLink && (
                  <a
                    href={selectedFileForPreview.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Google Drive</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
