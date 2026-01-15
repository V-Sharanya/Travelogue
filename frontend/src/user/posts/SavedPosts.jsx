import { useEffect, useState } from "react";
import API from "../../api/api";
import PostCard from "./PostCard";

export default function SavedPosts() {
  const [posts, setPosts] = useState([]);

  

  useEffect(() => {
  const fetchSaved = async () => {
    try {
      const res = await API.get("/posts/saved");
      setPosts(res.data);
    } catch {
      alert("Failed to load saved posts");
    }
  };

  fetchSaved();
}, []);


  return (
    <div>
      <h2>Saved Posts</h2>

      {posts.length === 0 && <p>No saved posts yet.</p>}

      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
