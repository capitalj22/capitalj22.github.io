import { clone, filter, find, includes, map } from "lodash-es";
import { Lock, PlusSquare, XCircle } from "react-feather";
import Select from "react-select";
import "./statsPanel.scss";

function getAvailableOptions(providedStats, options) {
  const usedStats = map(providedStats, (stat) => stat.id);
  return filter(options, (options) => !includes(usedStats, options.value));
}
interface Props {
  providedStats: Array<{ id: string; modifier: number; set?: boolean }>;
  providedStatsChanged: (
    providedStats: Array<{ id: string; modifier: number; set?: boolean }>
  ) => void;
  options: Array<{ value: any; label: any }>;
  name: string;
}
export function StatsPanel({
  providedStats = [],
  providedStatsChanged,
  options,
  name,
}: Props) {
  const statIdChanged = (event, index) => {
    const newStats = clone(providedStats);
    newStats[index].id = event.value;

    providedStatsChanged(newStats);
  };

  const statModifierChanged = (event, index) => {
    const newStats = clone(providedStats);
    newStats[index].modifier = parseInt(event.target.value, 10);

    providedStatsChanged(newStats);
  };

  const removeStatClicked = (event, index) => {
    let newStats = clone(providedStats);
    newStats = filter(newStats, (stat, idx) => index !== idx);

    providedStatsChanged(newStats);
  };

  const addbuttonClicked = () => {
    let newStats = clone(providedStats);
    newStats.push({ id: "", modifier: 1, set: false });

    providedStatsChanged(newStats);
  };

  const lockToggled = (index) => {
    const newStats = clone(providedStats);
    newStats[index].set = !newStats[index].set;

    providedStatsChanged(newStats);
  };

  return (
    <div className="stats-panel">
      {providedStats?.length
        ? map(providedStats, (stat, index) => (
            <div className="stat-edit-line" key={index}>
              <button
                className="remove"
                onClick={(e) => removeStatClicked(e, index)}
              >
                <XCircle />
              </button>

              <Select
                classNames={{
                  control: () => "select",
                singleValue: () => "single-value",
                  menu: () => "select-menu",
                }}
                options={getAvailableOptions(providedStats, options)}
                onChange={(e) => statIdChanged(e, index)}
                value={find(options, { value: stat.id })}
              ></Select>
              <input
                type="number"
                value={stat?.modifier}
                onChange={(e) => statModifierChanged(e, index)}
              ></input>
              <button
                onClick={(e) => lockToggled(index)}
                style={{ color: stat?.set ? "#fff" : "#222" }}
              >
                <Lock />
              </button>
            </div>
          ))
        : ""}
      <div className="add-button">
        <button onClick={addbuttonClicked}>
          Add {name}
          <PlusSquare />
        </button>
      </div>
    </div>
  );
}
