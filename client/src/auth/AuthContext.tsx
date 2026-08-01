import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ApiError, loginRequest, logoutRequest, refreshRequest, signupRequest } from "../api";
import type { User } from "../types";

type AuthStatus = "loading" | "anonymous" | "authenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
  completeGoogleLogin: () => Promise<void>;
  setUser: (user: User) => void;
  withAuth: <T>(fn: (accessToken: string) => Promise<T>) => Promise<T>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);
  const accessTokenRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    refreshRequest()
      .then((result) => {
        if (cancelled) return;
        accessTokenRef.current = result.accessToken;
        setUser(result.user);
        setStatus(result.user ? "authenticated" : "anonymous");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("anonymous");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    accessTokenRef.current = result.accessToken;
    setUser(result.user);
    setStatus("authenticated");
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const result = await signupRequest(email, password);
    accessTokenRef.current = result.accessToken;
    setUser(result.user);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest().catch(() => undefined);
    accessTokenRef.current = null;
    setUser(null);
    setStatus("anonymous");
  }, []);

  const loginWithGoogle = useCallback(() => {
    window.location.href = "/api/auth/google";
  }, []);

  const completeGoogleLogin = useCallback(async () => {
    const result = await refreshRequest();
    accessTokenRef.current = result.accessToken;
    setUser(result.user);
    setStatus(result.user ? "authenticated" : "anonymous");
  }, []);

  const withAuth = useCallback(async <T,>(fn: (accessToken: string) => Promise<T>): Promise<T> => {
    if (!accessTokenRef.current) {
      throw new ApiError(401, "Not authenticated");
    }
    try {
      return await fn(accessTokenRef.current);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        const result = await refreshRequest();
        accessTokenRef.current = result.accessToken;
        setUser(result.user);
        return await fn(result.accessToken);
      }
      throw err;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, login, signup, logout, loginWithGoogle, completeGoogleLogin, setUser, withAuth }),
    [status, user, login, signup, logout, loginWithGoogle, completeGoogleLogin, withAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
