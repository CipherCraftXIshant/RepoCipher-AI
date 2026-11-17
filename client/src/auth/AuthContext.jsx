import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ApiError, loginRequest, logoutRequest, refreshRequest, signupRequest } from "../api";

const AuthContext = createContext(null);

const STORAGE_TOKEN_KEY = "repocipher_access_token";
const STORAGE_USER_KEY = "repocipher_user";

export function AuthProvider({ children }) {
  const initialToken = typeof window !== "undefined" ? localStorage.getItem(STORAGE_TOKEN_KEY) : null;
  const initialUser = typeof window !== "undefined" ? (() => {
    try {
      const u = localStorage.getItem(STORAGE_USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })() : null;

  const [status, setStatus] = useState(initialToken ? "authenticated" : "loading");
  const [user, setUser] = useState(initialUser);
  const accessTokenRef = useRef(initialToken);

  const saveSession = (accessToken, userObj) => {
    accessTokenRef.current = accessToken;
    setUser(userObj);
    setStatus(userObj ? "authenticated" : "anonymous");
    if (accessToken) {
      localStorage.setItem(STORAGE_TOKEN_KEY, accessToken);
    } else {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    }
    if (userObj) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userObj));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  };

  const clearSession = () => {
    accessTokenRef.current = null;
    setUser(null);
    setStatus("anonymous");
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
  };

  useEffect(() => {
    let cancelled = false;
    refreshRequest()
      .then((result) => {
        if (cancelled) return;
        saveSession(result.accessToken, result.user);
      })
      .catch(() => {
        if (cancelled) return;
        // If we didn't have a stored token, mark anonymous
        if (!accessTokenRef.current) {
          clearSession();
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await loginRequest(email, password);
    saveSession(result.accessToken, result.user);
    return result;
  }, []);

  const signup = useCallback(async (email, password, displayName) => {
    const result = await signupRequest(email, password, displayName);
    saveSession(result.accessToken, result.user);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest().catch(() => undefined);
    clearSession();
  }, []);

  const loginWithGoogle = useCallback(() => {
    window.location.href = "/api/auth/google";
  }, []);

  const completeGoogleLogin = useCallback(async () => {
    const result = await refreshRequest();
    saveSession(result.accessToken, result.user);
  }, []);

  const withAuth = useCallback(async (fn) => {
    if (!accessTokenRef.current) {
      throw new ApiError(401, "Not authenticated");
    }
    try {
      return await fn(accessTokenRef.current);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        try {
          const result = await refreshRequest();
          saveSession(result.accessToken, result.user);
          return await fn(result.accessToken);
        } catch {
          clearSession();
          throw err;
        }
      }
      throw err;
    }
  }, []);

  const value = useMemo(
    () => ({ status, user, login, signup, logout, loginWithGoogle, completeGoogleLogin, setUser, withAuth }),
    [status, user, login, signup, logout, loginWithGoogle, completeGoogleLogin, withAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
