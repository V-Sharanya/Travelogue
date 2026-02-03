import API from "../../api/api";
import { useState } from "react";

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked);
  const [saved, setSaved] = useState(post.saved);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [showMenu, setShowMenu] = useState(false);


  const toggleLike = async () => {
    try {
      if (liked) {
        const res = await API.delete(`/posts/${post.id}/like`);
        setLiked(false);
        setLikeCount(res.data.like_count);
      } else {
        const res = await API.post(`/posts/${post.id}/like`);
        setLiked(true);
        setLikeCount(res.data.like_count);
      }
    } catch { /* empty */ }
  };

  const toggleSave = async () => {
    try {
      if (saved) {
        await API.delete(`/posts/${post.id}/save`);
        setSaved(false);
      } else {
        await API.post(`/posts/${post.id}/save`);
        setSaved(true);
      }
    } catch { /* empty */ }
  };
  const handleDelete = async () => {
  if (!window.confirm("Delete this post?")) return;

  try {
    await API.delete(`/posts/${post.id}`);
    window.location.reload(); // simple & safe for now
  } catch (err) {
    console.error("Failed to delete post", err);
  }
};


  return (
    <div className="post-card">
      {/* HEADER */}
      <div className="post-header">
        <div className="post-user">
          <div className="avatar">👤</div>
          <div>
            <div className="username">Traveler</div>
            {post.location && (
              <div className="post-location">📍 {post.location}</div>
            )}
          </div>
        </div>

        <div className="post-menu">
  <span
    className="menu-trigger"
    onClick={() => setShowMenu(!showMenu)}
  >
    ⋯
  </span>

  {showMenu && (
    <div className="menu-dropdown">
      <div className="menu-item" onClick={() => alert("Edit coming soon")}>
        ✏️ Edit
      </div>
      <div className="menu-item danger" onClick={handleDelete}>
        🗑 Delete
      </div>
    </div>
  )}
</div>

      </div>

      {/* IMAGE */}
      {post.images?.length > 0 && (
        <div className="post-image">
          <img
            src={`http://localhost:8000/${post.images[0].image_url}`}
            alt="post"
          />
        </div>
      )}

      {/* ACTIONS */}
      <div className="post-actions">
        <div className="left-actions">
          <span onClick={toggleLike}>
            {liked ? "❤️" : "🤍"} {likeCount}
          </span>
          <span>💬</span>
        </div>

        <span onClick={toggleSave}>
          {saved ? "🔖" : "📑"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="post-content">
        <h4>{post.title}</h4>
        <p>{post.content}</p>
      </div>

      {/* DATE */}
      <div className="post-date">
        {new Date(post.created_at).toLocaleDateString()}
      </div>
    </div>
  );
}
