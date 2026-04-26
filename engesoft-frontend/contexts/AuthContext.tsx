"use client";

import { clearAuthToken, getAuthToken } from "@/lib/auth-token";
import {
  clearAuthSessionCookie,
  syncAuthSessionCookie,
} from "@/lib/sync-auth-session-client";
import { getCurrentUser } from "@/services/user.service";
import { AuthUser } from "@/types/auth-user";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  setAuthenticated: (value: boolean) => void;
  refreshUser: () => Promise<void>;
  logoutAndClear: () => void;
}

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setAuthenticated] = useState(false);

  const [user, setUser] = useState<AuthUser | null>(null);

  const logoutAndClear = useCallback(() => {
    clearAuthToken();
    void clearAuthSessionCookie();

    setUser(null);
    setAuthenticated(false);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        logoutAndClear();
        return;
      }

      const currentUser = await getCurrentUser();

      await syncAuthSessionCookie(token);

      setUser(currentUser);
      setAuthenticated(true);
    } catch {
      logoutAndClear();
    } finally {
      setLoading(false);
    }
  }, [logoutAndClear]);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setLoading(false);
      setUser(null);
      setAuthenticated(false);
      return;
    }

    void refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        setUser,
        setAuthenticated,
        refreshUser,
        logoutAndClear,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}