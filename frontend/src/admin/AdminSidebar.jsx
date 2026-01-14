import { NavLink } from "react-router-dom";
import "./admin.css";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h3>Admin Panel</h3>

      <nav className="admin-nav">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `admin-link ${isActive ? "active" : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/places"
          className={({ isActive }) =>
            `admin-link ${isActive ? "active" : ""}`
          }
        >
          Places
        </NavLink>
      </nav>
    </aside>
  );
}
