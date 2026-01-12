import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "220px",
        background: "#1f2937",
        color: "#e5e7eb",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Travelogue</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            color: isActive ? "#38bdf8" : "#e5e7eb",
            textDecoration: "none",
            fontWeight: isActive ? "600" : "400",
          })}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/places"
          style={({ isActive }) => ({
            color: isActive ? "#38bdf8" : "#e5e7eb",
            textDecoration: "none",
            fontWeight: isActive ? "600" : "400",
          })}
        >
          Places
        </NavLink>
      </nav>
    </aside>
  );
}
