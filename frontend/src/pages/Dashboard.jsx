import MetricCard from "../components/dashboard/MetricCard";
import ActivityChart from "../components/dashboard/ActivityChart";
import RecentActivity from "../components/dashboard/RecentActivity";

function Dashboard() {
  return (
    <div
      style={{
        padding: "24px",
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ color: "var(--text-primary)" }}>Dashboard</h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Overview of your activity
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid">
        <MetricCard title="Saved Items" value="128" variant="purple" />
        <MetricCard title="Likes" value="76" variant="blue" />
        <MetricCard title="Recommendations" value="24" variant="orange" />
        <MetricCard title="My Posts" value="52" variant="pink" />
      </div>

      {/* Charts + Activity */}
      <div className="grid-large">
        <ActivityChart />
        <RecentActivity />
      </div>
    </div>
  );
}

export default Dashboard;
