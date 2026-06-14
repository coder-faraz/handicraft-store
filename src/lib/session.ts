// FILE: src/lib/session.ts
import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  userId: string;
  role: 'admin' | 'customer';
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'limra_session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    sameSite: 'lax',
    path: '/',
  },
};

if (!process.env.SESSION_SECRET) {
  throw new Error(
    'Please define SESSION_SECRET environment variable in .env.local (min 32 chars)'
  );
}

/**
 * Get the current iron-session in a Server Component / Route Handler.
 */
export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}

/**
 * Convenience helper: returns session data or null if not logged in.
 */
export async function getCurrentUser(): Promise<SessionData | null> {
  const session = await getSession();
  if (!session.isLoggedIn) return null;
  return {
    userId: session.userId,
    role: session.role,
    name: session.name,
    email: session.email,
    isLoggedIn: session.isLoggedIn,
  };
}
