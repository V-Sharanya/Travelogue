import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function UserSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="user-sidebar">
      <h3>Travelogue</h3>

      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/dashboard/create">Create Post</NavLink>
        <NavLink to="/dashboard/my-feed">My Feed</NavLink>
        <NavLink to="/dashboard/saved">Saved</NavLink>
        <NavLink to="/dashboard/recommendations">Recommendations</NavLink>
        <NavLink to="/dashboard/settings">Settings</NavLink>
      </nav>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}
