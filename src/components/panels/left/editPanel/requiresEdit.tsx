import { find, map } from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { PlusSquare, Trash } from "react-feather";
import { NodesContext } from "../../../../providers/nodes/nodesProvider";
import { SmolButton } from "../../../common/buttons/smolButton";
import { NodeSelect } from "../../../common/selects/nodeSelect";
import { FancyNumberInput } from "../../../common/tag-input/fancyNumberInput";
import "./requiresEdit.scss";

export function RequiresEdit({ value, requirementType, valueChanged, nodeId }) {
  const [mappedValue, setMappedValue] = useState(value);
  const [isOr, setIsOr] = useState(requirementType === "or");
  const { nodes } = useContext(NodesContext);

  useEffect(() => {
    setMappedValue(value);
    setIsOr(requirementType === "or");
  }, [value, requirementType]);

  const changed = (value, index, prop) => {
    let newValue = [...mappedValue];
    newValue[index][prop] = value;
    valueChanged({ requires: newValue, requirementType: isOr ? "or" : "and" });
  };

  const removed = (index) => {
    let newValue = [...mappedValue];
    newValue.splice(index, 1);
    valueChanged({ requires: newValue, requirementType: isOr ? "or" : "and" });
  };

  const addPressed = () => {
    let newValue = [...mappedValue];
    newValue.push({ levels: "1" });
    valueChanged({
      requires: newValue,
      requirementType: isOr ? "or" : "and",
    });
  };

  const requirementTypeChanged = () => {
    valueChanged({
      requires: mappedValue,
      requirementType: isOr ? "and" : "or",
    });
  };

  return (
    <div className="require-select">
      {map(mappedValue, (requirement, index) => (
        <div className="requirement" key={index}>
          <div className="select">
            <NodeSelect
              defaultValue={requirement.id}
              usedOptions={[nodeId]}
              valueChanged={(e) => changed(e, index, "id")}
            />
            {find(nodes, { id: requirement.id })?.levels > 1 ? (
              <FancyNumberInput
                value={requirement.levels}
                valueChanged={(e) => changed(e, index, "levels")}
                min={1 as any}
                max={find(nodes, { id: requirement.id }).levels || 1}
              />
            ) : (
              <span></span>
            )}
          </div>
          <SmolButton clicked={(e) => removed(index)} color="danger">
            <Trash />
          </SmolButton>
        </div>
      ))}

      {mappedValue.length > 1 && (
        <div className="requirementType">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={isOr}
              onChange={requirementTypeChanged}
            ></input>
            Requires only one
          </label>
        </div>
      )}
      <SmolButton color="mutdWhite" clicked={addPressed}>
        <PlusSquare />
      </SmolButton>
    </div>
  );
}
