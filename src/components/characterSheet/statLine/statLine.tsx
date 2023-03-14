import "./statLine.scss";

export function StatLine({ label, value }) {
  return (
    <div className="stat-line">
      <span className="label">{label}: </span>
      <span className="value">{value}</span>
    </div>
  );
}
