export default function RecentActivity() {
  return (
    <div className="card" style={{ height: "320px" }}>
      <h3 style={{ marginBottom: "16px", color: "var(--text-primary)" }}>
        Recent Activity
      </h3>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li style={{ marginBottom: "12px", color: "var(--text-secondary)" }}>
          You liked a post
        </li>
        <li style={{ marginBottom: "12px", color: "var(--text-secondary)" }}>
          You saved an article
        </li>
        <li style={{ color: "var(--text-secondary)" }}>
          New recommendation added
        </li>
      </ul>
    </div>
  );
}
