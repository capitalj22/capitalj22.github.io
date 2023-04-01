import { BuildContext } from "../../providers/build/buildProvider";
import "./pointCounter.scss";
import { useContext, useEffect, useState } from "react";
import { find } from "lodash-es";

function getUnitName(defaultUnits, customUnits, id) {
  return find([...defaultUnits, ...customUnits], { id });
}
export function PointCounter({ pointsSpent }) {
  const { customUnits, defaultUnits, selectedUnit } = useContext(BuildContext);
  const [unit, setUnit] = useState(
    getUnitName(defaultUnits, customUnits, selectedUnit?.unit?.id)
  );

  useEffect(() => {
    setUnit(getUnitName(defaultUnits, customUnits, selectedUnit?.unit?.id));
  }, [selectedUnit]);

  return (
    <div className="point-counter">
      {unit && <div>Unit: {unit?.name}</div>}
      <div>Spent: {pointsSpent}</div>
    </div>
  );
}
