import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const SALT_ROUNDS = 10;

/**
 * Computes a secure salted bcrypt hash for a given plaintext password.
 */
export function hashPassword(plainText: string): string {
  if (!plainText || typeof plainText !== 'string') {
    return '';
  }
  const clean = plainText.trim();
  if (!clean) return '';
  return bcrypt.hashSync(clean, SALT_ROUNDS);
}

/**
 * Verifies an entered password against a stored hash or legacy plaintext string.
 * Returns match status and whether the stored credential needs to be upgraded to bcrypt.
 */
export function verifyPasswordHash(entered: string, stored: string | undefined | null): { match: boolean; needsRehash: boolean } {
  if (!entered || !stored) {
    return { match: false, needsRehash: false };
  }

  const cleanEntered = entered.trim();
  const rawEntered = entered;
  const cleanStored = String(stored).trim();

  // If already a bcrypt hash (starts with $2a$, $2b$, or $2y$)
  if (cleanStored.startsWith('$2a$') || cleanStored.startsWith('$2b$') || cleanStored.startsWith('$2y$')) {
    try {
      const match = bcrypt.compareSync(cleanEntered, cleanStored) || bcrypt.compareSync(rawEntered, cleanStored);
      return { match, needsRehash: false };
    } catch (err) {
      console.error('[Auth] Error comparing bcrypt hash:', err);
      return { match: false, needsRehash: false };
    }
  }

  // Legacy plain-text fallback (during seamless migration)
  const legacyMatch =
    cleanEntered === cleanStored ||
    rawEntered === stored ||
    cleanEntered.toLowerCase() === cleanStored.toLowerCase();

  return { match: legacyMatch, needsRehash: legacyMatch };
}

/**
 * Strips password hashes, raw password arrays, and internal tokens from a student object
 * before returning it to the client.
 */
export function sanitizeStudent(student: any): any {
  if (!student) return null;
  const clone = { ...student };
  delete clone.passwordHash;
  delete clone.passwords;
  return clone;
}

/**
 * Strips password hashes and raw password arrays from an admin object
 * before returning it to the client.
 */
export function sanitizeAdmin(admin: any): any {
  if (!admin) return null;
  const clone = { ...admin };
  delete clone.passwordHash;
  delete clone.passwords;
  return clone;
}

/**
 * Atomically writes JSON data to disk by writing to a temporary file first
 * and renaming it into place. This prevents corruption during sudden restarts.
 */
export function atomicWriteJsonSync(targetPath: string, data: any): void {
  try {
    const parentDir = path.dirname(targetPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    const tempPath = `${targetPath}.${Date.now()}.${Math.random().toString(36).slice(2, 7)}.tmp`;
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(tempPath, jsonString, 'utf8');
    fs.renameSync(tempPath, targetPath);
  } catch (err) {
    console.error(`[AuthStorage] Failed atomic write to ${targetPath}:`, err);
    // Fallback standard write if rename fails
    try {
      fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (fallbackErr) {
      console.error(`[AuthStorage] Fallback write also failed for ${targetPath}:`, fallbackErr);
    }
  }
}
