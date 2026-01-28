import { useEffect, useState } from "react";
import API from "../../api/api";
import PostCard from "./PostCard";
import "./post.css";



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
    <div className="feed-header">
      <h2>Explore</h2>
      <p>Discover travel experiences from fellow explorers</p>
    </div>

    {loading && <p>Loading posts...</p>}

    {!loading && posts.length === 0 && (
      <p>No posts yet. Be the first to share your experience.</p>
    )}

    <div className="feed-grid">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  </>
);

}
