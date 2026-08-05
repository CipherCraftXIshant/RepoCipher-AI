import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../api";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      navigate("/app");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-95 mx-auto px-6 py-16 text-left">
      <h1 className="text-center text-[28px] font-medium text-heading dark:text-heading-dark mb-6">Log in</h1>

      <button
        type="button"
        className="w-full [font:inherit] text-[15px] p-3 rounded-lg border border-border dark:border-border-dark bg-bg dark:bg-bg-dark text-heading dark:text-heading-dark cursor-pointer"
        onClick={loginWithGoogle}
      >
        Continue with Google
      </button>

      <div className="text-center text-text dark:text-text-dark text-[13px] my-5">or</div>

      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1.5 text-sm text-text dark:text-text-dark">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="[font:inherit] text-[15px] px-3 py-2.5 border border-border dark:border-border-dark rounded-lg bg-bg dark:bg-bg-dark text-heading dark:text-heading-dark focus:outline-none focus:border-accent-border dark:focus:border-accent-border-dark"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-text dark:text-text-dark">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="[font:inherit] text-[15px] px-3 py-2.5 border border-border dark:border-border-dark rounded-lg bg-bg dark:bg-bg-dark text-heading dark:text-heading-dark focus:outline-none focus:border-accent-border dark:focus:border-accent-border-dark"
          />
        </label>
        {error && <p className="text-danger mt-4">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="[font:inherit] text-[15px] p-3 rounded-lg border border-accent-border dark:border-accent-border-dark bg-accent-bg dark:bg-accent-bg-dark text-heading dark:text-heading-dark cursor-pointer mt-1 disabled:opacity-50 disabled:cursor-default"
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-center mt-5 text-sm text-text dark:text-text-dark">
        Don't have an account? <Link to="/signup" className="text-accent dark:text-accent-dark">Sign up</Link>
      </p>
    </main>
  );
}
