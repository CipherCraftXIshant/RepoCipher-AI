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
    <main className="page">
      <nav className="topnav">
        <Link to="/app" className="brand">RepoCipher AI</Link>
      </nav>

      <section className="profile">
        <div className="avatar-wrap">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="avatar" />
          ) : (
            <div className="avatar avatar-placeholder">{user.email[0]?.toUpperCase()}</div>
          )}
          <button type="button" className="secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
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

        <div className="profile-info">
          <h2>{user.displayName ?? user.email}</h2>
          <p className="repo-desc">{user.email}</p>
        </div>

        {error && <p className="error-text">{error}</p>}
      </section>
    </main>
  );
}
