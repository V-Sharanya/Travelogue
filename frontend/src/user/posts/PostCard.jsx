export default function PostCard({ post }) {
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
        <span>❤️</span>
        <span>💬</span>
        <span>🔖</span>
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
