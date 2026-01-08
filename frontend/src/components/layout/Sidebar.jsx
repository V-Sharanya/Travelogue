import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <NavLink to="/" className="sidebar-item">
        Dashboard
      </NavLink>
    </div>
  );
}
