import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";   // adjust path if needed
import "./admin.css";

export default function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="admin-sidebar">
      <h3>Admin Panel</h3>

      <nav className="admin-nav">
        <NavLink
          to="/admin"
          end
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

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="admin-button"
        style={{ marginTop: "auto", background: "#ef4444" }}
      >
        Logout
      </button>
    </aside>
  );
}
