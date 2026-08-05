import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function AuthCallbackPage() {
  const { completeGoogleLogin } = useAuth();
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    completeGoogleLogin()
      .then(() => setDone(true))
      .catch(() => setFailed(true));
  }, [completeGoogleLogin]);

  if (failed) return <Navigate to="/login" replace />;
  if (done) return <Navigate to="/app" replace />;

  return (
    <div className="page-loading">
      <p>Signing you in…</p>
    </div>
  );
}
