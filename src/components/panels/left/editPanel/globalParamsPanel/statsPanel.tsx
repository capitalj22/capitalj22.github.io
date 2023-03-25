import { clone, filter, find, includes, map } from "lodash-es";
import { Lock, PlusSquare, XCircle } from "react-feather";
import Select from "react-select";
import "./statsPanel.scss";

function getAvailableOptions(params, options) {
  const usedStats = map(params, (stat) => stat.id);
  return filter(options, (options) => !includes(usedStats, options.value));
}
interface Props {
  params: Array<{ id: string; modifier: number; set?: boolean }>;
  paramsChanged: (
    params: Array<{ id: string; modifier: number; set?: boolean }>
  ) => void;
  options: Array<{ value: any; label: any }>;
}
export function GlobalParamsPanel({
  params = [],
  paramsChanged,
  options,
}: Props) {
  const statIdChanged = (event, index) => {
    const newParams = clone(params);
    newParams[index].id = event.value;

    paramsChanged(newParams);
  };

  const statModifierChanged = (event, index) => {
    const newParams = clone(params);
    newParams[index].modifier = parseInt(event.target.value, 10);

    paramsChanged(newParams);
  };

  const removeStatClicked = (event, index) => {
    let newParams = clone(params);
    newParams = filter(newParams, (stat, idx) => index !== idx);

    paramsChanged(newParams);
  };

  const addbuttonClicked = () => {
    let newParams = clone(params);
    newParams.push({ id: "", modifier: 1, set: false });

    paramsChanged(newParams);
  };

  const lockToggled = (index) => {
    const newParams = clone(params);
    newParams[index].set = !newParams[index].set;

    paramsChanged(newParams);
  };

  return (
    <div className="stats-panel">
      {params?.length
        ? map(params, (stat, index) => (
            <div className="stat-edit-line">
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
                options={getAvailableOptions(params, options)}
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
        {/* <button onClick={addbuttonClicked}>
          Add {name}
          <PlusSquare />
        </button> */}
      </div>
    </div>
  );
}
