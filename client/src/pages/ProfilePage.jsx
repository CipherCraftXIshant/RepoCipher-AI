import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, uploadAvatar } from "../api";
import { useAuth } from "../auth/AuthContext";

export function ProfilePage() {
  const { user, setUser, withAuth } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const result = await withAuth((token) => uploadAvatar(token, file));
      setUser(result.user);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <main className="max-w-180 mx-auto pt-12 px-6 pb-20 text-left">
      <nav className="flex items-center justify-between gap-4 mb-8">
        <Link to="/app" className="flex items-center gap-2.5 font-semibold text-lg text-heading dark:text-heading-dark no-underline">
          RepoCipher AI
        </Link>
      </nav>

      <section className="flex flex-col items-center gap-4 py-8">
        <div className="flex flex-col items-center gap-3">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-24 h-24 rounded-full object-cover border border-border dark:border-border-dark" />
          ) : (
            <div className="w-24 h-24 rounded-full object-cover border border-border dark:border-border-dark flex items-center justify-center bg-accent-bg dark:bg-accent-bg-dark text-heading dark:text-heading-dark text-[32px] font-semibold">
              {user.email[0]?.toUpperCase()}
            </div>
          )}
          <button
            type="button"
            className="[font:inherit] text-base px-5 py-3 rounded-lg border border-border dark:border-border-dark bg-transparent text-heading dark:text-heading-dark cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-default"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Change photo"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => void handleFileChange(e)}
          />
        </div>

        <div className="text-center">
          <h2 className="text-xl lg:text-2xl font-medium text-heading dark:text-heading-dark leading-[118%] tracking-[-0.24px] mb-2">
            {user.displayName ?? user.email}
          </h2>
          <p className="text-text dark:text-text-dark mt-1">{user.email}</p>
        </div>

        {error && <p className="text-danger mt-4">{error}</p>}
      </section>
    </main>
  );
}
