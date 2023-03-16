import './pointCounter.scss';

export function PointCounter({ pointsSpent }) {
  return <div className="point-counter">Spent: {pointsSpent}</div>;
}
