import { NavLink } from "react-router-dom";
import { Home, PlusCircle, Bookmark, Compass, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../auth/useAuth";

export default function UserSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="user-sidebar">
      

      {/* Navigation */}
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">
          <Home size={20} />
          <span>Feed</span>
        </NavLink>

        <NavLink to="/dashboard/create" className="sidebar-link">
          <PlusCircle size={20} />
          <span>Create</span>
        </NavLink>

        <NavLink to="/dashboard/saved" className="sidebar-link">
          <Bookmark size={20} />
          <span>Saved</span>
        </NavLink>

        <NavLink to="/dashboard/recommendations" className="sidebar-link">
          <Compass size={20} />
          <span>Explore</span>
        </NavLink>

        <NavLink to="/dashboard/settings" className="sidebar-link">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Logout at bottom */}
      <button className="sidebar-logout" onClick={logout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
