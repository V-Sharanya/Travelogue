import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside style={{ width: "220px", background: "#111", color: "#fff", padding: "20px" }}>
      <h3>Admin</h3>
      <nav>
        <Link to="/admin" style={{ color: "#fff" }}>Dashboard</Link><br />
        <Link to="/admin/places" style={{ color: "#fff" }}>Places</Link>
      </nav>
    </aside>
  );
}
