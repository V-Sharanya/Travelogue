import { useEffect, useState } from "react";
import API from "../../api/api";
import PostCard from "./PostCard";
import "./post.css";

export default function RecommendationsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await API.get("/posts/recommendations");
        setPosts(res.data);
      } catch {
        alert("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <>
      <div className="feed-header recommendations-header">
        <h2>Recommendation</h2>
        <p>
          Your next travel destinations, based on your saved posts, likes, and the
          places and topics you care about.
        </p>
      </div>

      {loading && <p>Loading recommendations...</p>}

      {!loading && posts.length === 0 && (
        <p className="empty-text">
          Save or like some posts to get personalized recommendations, or explore
          the feed to discover trips.
        </p>
      )}

      <div className="feed-grid">
        {posts.map((post) => (
          <div key={post.id} className="recommendation-item">
            <PostCard post={post} />
            {post.recommendation_reason && (
              <div className="recommendation-meta">
                <strong>Why this is recommended</strong>
                <p>{post.recommendation_reason}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
