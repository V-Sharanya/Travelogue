import { useState } from "react";
import API from "../../api/api";

export default function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("Title and content are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("location", location);

      images.forEach((img) => {
        formData.append("images", img);
      });

      await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setContent("");
      setLocation("");
      setImages([]);

      if (onPostCreated) {
  onPostCreated();
}

    } catch {
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="create-post-wrapper">
    <h2 className="create-title">Share Your Journey</h2>

    {/* TITLE + LOCATION */}
    <div className="row">
      <div className="field">
        <label>Title</label>
        <input
          placeholder="Give your post a catchy title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Location</label>
        <input
          placeholder="Where was this?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
    </div>

    {/* STORY */}
    <div className="field">
      <label>Your Story</label>
      <textarea
        placeholder="Share the highlights of your travel experience..."
        rows={5}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>

    {/* PHOTOS */}
    <div className="field">
      <label>Photos</label>

      <label className="photo-box">
        <span>➕</span>
        <p>Add</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />
      </label>

      <div className="image-preview">
        {images.map((img, idx) => (
          <img key={idx} src={URL.createObjectURL(img)} />
        ))}
      </div>
    </div>

    {/* BUTTON */}
    <button className="share-btn" onClick={handleSubmit} disabled={loading}>
      {loading ? "Sharing..." : "Share Post"}
    </button>
  </div>
);

}
