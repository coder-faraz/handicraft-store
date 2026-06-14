// FILE: src/context/AuthContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { SessionUser } from '@/types';

// ─── Context value shape ──────────────────────────────────────────────────────

interface AuthContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch current session from the server.
   * Called on mount and after login/logout.
   */
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.isLoggedIn) {
          setUser(data.data);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    })();
  }, [refreshUser]);

  /**
   * Log in with email + password.
   * Calls POST /api/auth/login and refreshes the user state on success.
   */
  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          await refreshUser();
          return { success: true };
        }

        return {
          success: false,
          error: data.error ?? 'Login failed. Please try again.',
        };
      } catch {
        return {
          success: false,
          error: 'Network error. Please check your connection.',
        };
      }
    },
    [refreshUser]
  );

  /**
   * Log out — calls DELETE /api/auth/logout and clears local state.
   */
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch {
      // Silently fail — still clear local state
    } finally {
      setUser(null);
    }
  }, []);

  const isLoggedIn = !!user?.isLoggedIn;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn,
        isAdmin,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
