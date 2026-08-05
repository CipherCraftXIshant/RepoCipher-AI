import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ApiError, loginRequest, logoutRequest, refreshRequest, signupRequest } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const accessTokenRef = useRef(null);

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

  const login = useCallback(async (email, password) => {
    const result = await loginRequest(email, password);
    accessTokenRef.current = result.accessToken;
    setUser(result.user);
    setStatus("authenticated");
  }, []);

  const signup = useCallback(async (email, password) => {
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

  const withAuth = useCallback(async (fn) => {
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
