import { useEffect, useState } from "react";
import API from "../../api/api";
import { useAuth } from "../../auth/useAuth";
import PostCard from "./PostCard";
import "./post.css";
import "./profile.css";

export default function UserProfile() {
  const { user: authUser, refreshUser } = useAuth();
  const [user, setUser] = useState(authUser || null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUser(authUser);
    if (authUser) {
      setName(authUser.name || "");
      setBio(authUser.bio || "");
      setUsername(authUser.username || "");
    }
  }, [authUser]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await API.get("/posts/me");
        setPosts(res.data);
      } catch {
        alert("Failed to load your posts");
      }
    };
    fetchMyPosts();
  }, []);

  const handleSaveProfile = async () => {
    try {
      await API.put("/users/me", { name, bio, username: username || null });
      await refreshUser();
      setEditing(false);
    } catch (err) {
      const msg = err.response?.data?.detail ?? "Failed to update profile";
      alert(typeof msg === "string" ? msg : "Failed to update profile");
    }
  };

  const initials = user?.name
    ? user.name.trim().split(/\s+/).map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  return (
    <div className="profile-page">
      {/* PROFILE HEADER (like reference image) */}
      <div className="profile-header">
        <div className="profile-banner" />
        <div className="profile-info-row">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-meta">
            <div className="profile-name-row">
              <div>
                <h1 className="profile-name">
                  {editing ? (
                    <input
                      className="profile-edit-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  ) : (
                    user?.name || "Traveler"
                  )}
                </h1>
                <p className="profile-username">
                  {editing ? (
                    <input
                      className="profile-edit-input username-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="@username"
                    />
                  ) : (
                    user?.username ? `@${user.username}` : "Add a username in Edit Profile"
                  )}
                </p>
              </div>
              <div className="profile-actions">
                {editing ? (
                  <>
                    <button type="button" className="btn-profile btn-cancel" onClick={() => setEditing(false)}>
                      Cancel
                    </button>
                    <button type="button" className="btn-profile btn-primary" onClick={handleSaveProfile}>
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn-profile btn-edit"
                    onClick={() => setEditing(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                )}
              </div>
            </div>
            {!editing && (
              <p className="profile-bio">{user?.bio || "Add a short bio in Edit Profile."}</p>
            )}
            {editing && (
              <textarea
                className="profile-edit-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            )}
            <div className="profile-details">
              {joinDate && (
                <span className="profile-join">📅 Joined {joinDate}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* POSTS SECTION */}
      <div className="profile-posts-section">
        <h2 className="profile-posts-title">Posts</h2>
        {posts.length === 0 ? (
          <p className="empty-text">You haven’t posted anything yet.</p>
        ) : (
          <div className="feed-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
