import { clone, filter, find, includes, map } from "lodash-es";
import { Lock, PlusSquare, Trash2, XCircle } from "react-feather";
import Select from "react-select";
import { BigButton } from "../../../../common/buttons/bigButton";
import { SmolButton } from "../../../../common/buttons/smolButton";
import { selectStyles } from "../../../../common/selects/select-styles";
import { FancyNumberInput } from "../../../../common/tag-input/fancyNumberInput";
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
    newStats[index].modifier = event;

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
              <div className="left">
                <Select
                  className="stat-select"
                  styles={selectStyles()}
                  options={getAvailableOptions(providedStats, options)}
                  onChange={(e) => statIdChanged(e, index)}
                  value={find(options, { value: stat.id })}
                ></Select>
                <FancyNumberInput
                  value={stat?.modifier}
                  valueChanged={(e) => statModifierChanged(e, index)}
                ></FancyNumberInput>
              </div>
              <div className="right">
                <SmolButton
                  clicked={(e) => lockToggled(index)}
                  color={stat?.set ? "white" : "mutedText"}
                >
                  <Lock />
                </SmolButton>
                <SmolButton
                  color="danger"
                  clicked={(e) => removeStatClicked(e, index)}
                >
                  <Trash2 />
                </SmolButton>
              </div>
            </div>
          ))
        : ""}
      <div>
        <SmolButton
          disabled={getAvailableOptions(providedStats, options).length === 0}
          type="outline"
          color="info"
          clicked={addbuttonClicked}
        >
          <PlusSquare />
          Add {name}
        </SmolButton>
      </div>
    </div>
  );
}
