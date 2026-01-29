import { useEffect, useState } from "react";
import API from "../../api/api";
import PostCard from "../posts/PostCard";
import "./post.css";

export default function UserProfile() {
  const [posts, setPosts] = useState([]);

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

  return (
    <div className="profile-page">
      <h2 className="page-title">My Posts</h2>

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
  );
}
