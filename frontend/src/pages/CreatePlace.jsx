import { useState } from "react";
import API from "../api/api";

export default function CreatePlace({ onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/places", form);
      setForm({ title: "", description: "", location: "", category: "" });
      onCreated(); // refresh list
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to create place");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: "20px" }}>Create Place</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        style={inputStyle}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        style={{ ...inputStyle, marginTop: "12px" }}
        rows={3}
        required
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginTop: "12px",
        }}
      >
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <input
          name="category"
          placeholder="Category (Beach, Mountain)"
          value={form.category}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </div>

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          {loading ? "Creating..." : "Create Place"}
        </button>
      </div>
    </form>
  );
}
