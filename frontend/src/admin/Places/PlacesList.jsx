import { useEffect, useState } from "react";
import API from "../../api/api";
import { Link } from "react-router-dom";
import "../admin.css";

export default function PlacesList() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    API.get("/places").then((res) => setPlaces(res.data));
  }, []);

  // ✅ MUST be inside component
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this place?")) return;

    try {
      await API.delete(`/admin/places/${id}`);
      setPlaces((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete place");
    }
  };

  return (
    <div className="admin-card">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2>Places</h2>

        <Link to="/admin/places/add">
          <button className="admin-button">Add Place</button>
        </Link>
      </div>

      {/* Table */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {places.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.country}</td>
              <td>{p.category}</td>
              <td style={{ display: "flex", gap: "12px" }}>
                <Link
                  to={`/admin/places/edit/${p.id}`}
                  className="admin-action"
                >
                  Edit
                </Link>

                <span
                  className="admin-action"
                  style={{ color: "#ef4444" }}
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
