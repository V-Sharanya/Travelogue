export default function MetricCard({ title, value, variant }) {
  return (
    <div className={`metric-card ${variant}`}>
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}
