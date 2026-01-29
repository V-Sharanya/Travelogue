// src/user/components/UserNavbar.jsx
import { Search, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./userNavbar.css";

export default function UserNavbar() {
  const navigate = useNavigate();
  return (
    <header className="user-navbar">
      {/* Left: Logo */}
      <div className="navbar-left">
        <div className="logo-icon">🧭</div>
        <span className="logo-text">Travelogue</span>
      </div>

      {/* Center: Search */}
      <div className="navbar-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search destinations, posts..."
        />
      </div>

      {/* Right: Icons */}
      <div className="navbar-right">
        <User
          size={20}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/profile")}
        />
      </div>
    </header>
  );
}
