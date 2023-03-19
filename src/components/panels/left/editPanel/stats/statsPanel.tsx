import { clone, filter, find, includes, map } from "lodash-es";
import { Plus, PlusSquare, XCircle } from "react-feather";
import Select from "react-select";
import "./statsPanel.scss";

const statOptions = [
  { value: "hp", label: "HP" },
  { value: "armor", label: "Armor" },
  { value: "movement", label: "Movement" },
];

function getAvailableOptions(providedStats) {
  const usedStats = map(providedStats, (stat) => stat.id);

  return filter(statOptions, (options) => !includes(usedStats, options.value));
}

export function StatsPanel({ providedStats, providedStatsChanged }) {
  console.log(providedStats);
  const statIdChanged = (event, index) => {
    const newStats = clone(providedStats);
    newStats[index].id = event.value;

    providedStatsChanged(newStats);
  };

  const statModifierChanged = (event, index) => {
    const newStats = clone(providedStats);
    newStats[index].modifier = event.target.value;

    providedStatsChanged(newStats);
  };

  const removeStatClicked = (event, index) => {
    let newStats = clone(providedStats);
    newStats = filter(newStats, (stat, idx) => index !== idx);

    providedStatsChanged(newStats);
  };

  const addbuttonClicked = () => {
    let newStats = clone(providedStats);
    newStats.push({ id: "", modifier: 1 });

    providedStatsChanged(newStats);
  };

  return (
    <div className="stats">
      <div className="stats-title">Stats:</div>
      {providedStats?.length
        ? map(providedStats, (stat, index) => (
            <div className="stat-edit-line">
              <button onClick={(e) => removeStatClicked(e, index)}>
                <XCircle />
              </button>
              <Select
                classNames={{
                  control: () => "select",
                  singleValue: () => "single-value",
                  menu: () => "select-menu",
                }}
                // theme={(theme) => ({
                //   ...theme,
                //   colors: {
                //     ...theme.colors,
                //     text: "#3599B8",
                //     font: "#3599B8",
                //     primary25: "#3599B8",
                //     primary: "#3599B8",
                //     neutral80: "black",
                //     color: "black",
                //   },
                // })}
                options={getAvailableOptions(providedStats)}
                onChange={(e) => statIdChanged(e, index)}
                defaultValue={find(statOptions, { value: stat.id })}
              ></Select>
              <input
                type="number"
                value={stat?.modifier}
                onChange={(e) => statModifierChanged(e, index)}
              ></input>
            </div>
          ))
        : ""}
      <div className="add-button">
        <button onClick={addbuttonClicked}>
          Add Stat
          <PlusSquare />
        </button>
      </div>
    </div>
  );
}
