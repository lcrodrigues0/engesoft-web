"use client";

import { clearAuthToken, getAuthToken } from "@/lib/auth-token";
import { getCurrentUser } from "@/services/user.service";
import { AuthUser } from "@/types/auth-user";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void
  refreshUser: () => Promise<void>
  logoutAndClear: () => void 
}

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(
    () => typeof window !== "undefined" && !!getAuthToken(),
  );

  const [user, setUser] = useState<AuthUser | null>(null);

  const logoutAndClear = useCallback(() => {
    clearAuthToken();
    setUser(null);
    setAuthenticated(false);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setAuthenticated(true)
    } catch {
      logoutAndClear();
    }
  }, [logoutAndClear]);

  useEffect(() => {
    if (!getAuthToken()) {
      setUser(null);
      setAuthenticated(false);
      return;
    }

    void refreshUser();
  }, [refreshUser])

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated, user, setUser, refreshUser, logoutAndClear }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}