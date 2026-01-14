import { useEffect, useState } from "react";
import API from "../api/api";
import "./admin.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPlaces: 0,
    categories: 0,
    recent: [],
  });

  useEffect(() => {
    API.get("/places").then((res) => {
      const places = res.data;
      const categories = new Set(places.map(p => p.category));

      setStats({
        totalPlaces: places.length,
        categories: categories.size,
        recent: places.slice(-5).reverse(),
      });
    });
  }, []);

  return (
    <div className="admin-page">
      <h2>Dashboard</h2>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          marginTop: "1.5rem",
        }}
      >
        <div className="admin-card">
          <h4>Total Places</h4>
          <p style={{ fontSize: "2rem", fontWeight: 700 }}>
            {stats.totalPlaces}
          </p>
        </div>

        <div className="admin-card">
          <h4>Categories</h4>
          <p style={{ fontSize: "2rem", fontWeight: 700 }}>
            {stats.categories}
          </p>
        </div>
      </div>

      {/* Recent Places */}
      <div className="admin-card" style={{ marginTop: "2rem" }}>
        <h3>Recently Added Places</h3>

        {stats.recent.length === 0 ? (
          <p>No places added yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Country</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.country}</td>
                  <td>{p.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
