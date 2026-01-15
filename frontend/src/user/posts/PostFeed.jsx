import { useEffect, useState } from "react";
import API from "../../api/api";
import PostCard from "./PostCard";


export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/posts");
      setPosts(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* PAGE HEADER */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "1.6rem" }}>Dashboard</h2>
        <p style={{ color: "#6b7280", marginTop: "4px" }}>
          Explore travel experiences shared by others
        </p>
      </div>

      {loading && <p>Loading posts...</p>}

      {posts.length === 0 && !loading && (
        <p>No posts yet. Be the first to share your experience.</p>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}
