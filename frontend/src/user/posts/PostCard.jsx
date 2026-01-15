import API from "../../api/api";
import { useState } from "react";

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked);
  const [saved, setSaved] = useState(post.saved);
  const [likeCount, setLikeCount] = useState(post.like_count);

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
    } catch {
      alert("Failed to like post");
    }
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
    } catch {
      alert("Failed to save post");
    }
  };

  return (
    <div className="post-card">
      {/* HEADER */}
      <div className="post-header">
        <div>
          <strong>User {post.user_id}</strong>
          {post.location && (
            <div className="post-location">📍 {post.location}</div>
          )}
        </div>
        <span className="post-menu">⋮</span>
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
        <span onClick={toggleLike} style={{ cursor: "pointer" }}>
          {liked ? "❤️" : "🤍"} {likeCount}
        </span>

        <span>💬</span>

        <span onClick={toggleSave} style={{ cursor: "pointer" }}>
          {saved ? "🔖" : "📑"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="post-body">
        <strong>{post.title}</strong>
        <p>{post.content}</p>
      </div>

      {/* DATE */}
      <div className="post-date">
        {new Date(post.created_at).toLocaleDateString()}
      </div>
    </div>
  );
}
