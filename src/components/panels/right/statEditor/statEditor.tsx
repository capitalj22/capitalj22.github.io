import { map } from "lodash-es";
import { useContext } from "react";
import { MinusCircle, PlusSquare, Trash2 } from "react-feather";
import { StatsContext } from "../../../../providers/stats/statsProvider";
import { FancyTextInput } from "../../../common/tag-input/fancyTextInput";
import "./statEditor.scss";

export function StatEditor() {
  const { stats, setStats } = useContext(StatsContext);

  const addPressed = (event) => {
    setStats({ type: "add", stat: { id: "new-stat", name: "New Stat" } });
  };

  const removePressed = (event) => {
    setStats({
      type: "remove",
      stat: { id: event },
    });
  };

  const valueChanged = (val, index, prop) => {
    // setLocalStats((prevState) => {
    //   return {
    //     ...prevState,
    //     [index]: {
    //       ...prevState[index],
    //       [prop]: val,
    //     },
    //   };
    // });

    setStats({
      type: "update",
      index: index,
      stat: { ...stats[index], [prop]: val },
    });
  };

  const saveStats = () => {
    setStats({ type: "save" });
  };

  return (
    <div className="stat-editor">
      <div className="stats">
        {map(stats, (stat, index) => (
          <div key={index} className="stat-instance">
            <div className="top">
              <div className="name">
                <FancyTextInput
                  blur={saveStats}
                  value={stat.name}
                  valueChanged={(val) => valueChanged(val, index, "name")}
                />
              </div>
              <button
                className="remove-button"
                onClick={(e) => removePressed(stat.id)}
              >
                <Trash2 />
              </button>
            </div>
            <div className="bottom">
              <div className="id">
                <FancyTextInput
                  blur={saveStats}
                  value={stat.id}
                  valueChanged={(val) => valueChanged(val, index, "id")}
                />
              </div>
            </div>
          </div>
        ))}
        <button className="new-button" onClick={addPressed}>
          Add Stat <PlusSquare />
        </button>
      </div>
    </div>
  );
}
