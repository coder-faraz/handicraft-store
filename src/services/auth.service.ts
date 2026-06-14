// FILE: src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import { getCurrentUser } from '@/lib/session';
import type { SessionData } from '@/lib/session';

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password using bcrypt.
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a bcrypt hash.
 */
export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Get the current session user in a Server Component or API route.
 * Returns null if not authenticated.
 */
export async function getSessionUser(): Promise<SessionData | null> {
  return getCurrentUser();
}

/**
 * Assert the request is authenticated as admin.
 * Throws if not.
 */
export async function requireAdmin(): Promise<SessionData> {
  const user = await getCurrentUser();
  if (!user || !user.isLoggedIn) {
    throw new Error('UNAUTHENTICATED');
  }
  if (user.role !== 'admin') {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

/**
 * Assert the request is authenticated (any role).
 * Throws if not.
 */
export async function requireAuth(): Promise<SessionData> {
  const user = await getCurrentUser();
  if (!user || !user.isLoggedIn) {
    throw new Error('UNAUTHENTICATED');
  }
  return user;
}
