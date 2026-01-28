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
  <div className="create-post-card">
    <h2>Create a Post</h2>

    <div className="form-group">
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Location (optional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
    </div>

    <textarea
      placeholder="Share your travel experience..."
      rows={4}
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />

    <label className="file-input">
      Add Images
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />
    </label>

    <div className="image-preview">
      {images.map((img, idx) => (
        <img key={idx} src={URL.createObjectURL(img)} />
      ))}
    </div>

    <button onClick={handleSubmit} disabled={loading}>
      {loading ? "Posting..." : "Post"}
    </button>
  </div>
);

}
