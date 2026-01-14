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
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading posts...</p>;

  return (
    <div>
      {posts.length === 0 && (
        <p>No posts yet. Be the first to share your travel experience.</p>
      )}

      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
