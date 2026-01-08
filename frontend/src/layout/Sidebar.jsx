import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "220px",
        padding: "20px",
        borderRight: "1px solid #444",
      }}
    >
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/explore">Explore</Link></li>
        <li><Link to="/my-posts">My Posts</Link></li>
        <li><Link to="/saved">Saved</Link></li>
        <li><Link to="/recommendations">Recommendations</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
