import { find, map } from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { PlusSquare, Trash } from "react-feather";
import { NodesContext } from "../../../../providers/nodes/nodesProvider";
import { SmolButton } from "../../../common/buttons/smolButton";
import { NodeSelect } from "../../../common/selects/nodeSelect";
import { FancyNumberInput } from "../../../common/tag-input/fancyNumberInput";
import "./requiresEdit.scss";

export function RequiresEdit({ value, valueChanged, nodeId }) {
  const [mappedValue, setMappedValue] = useState(value);
  const { nodes } = useContext(NodesContext);

  useEffect(() => {
    setMappedValue(value);
  }, [value]);

  const changed = (value, index, prop) => {
    let newValue = [...mappedValue];
    newValue[index][prop] = value;
    valueChanged(newValue);
  };

  const removed = (index) => {
    let newValue = [...mappedValue];
    newValue.splice(index, 1);
    valueChanged(newValue);
  };

  const addPressed = () => {
    let newValue = [...mappedValue];
    newValue.push({ levels: "1" });
    valueChanged(newValue);
  };

  return (
    <div className="require-select">
      {map(mappedValue, (requirement, index) => (
        <div className="requirement">
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
          <SmolButton clicked={(e) => removed(index)} color="danger">
            <Trash />
          </SmolButton>
        </div>
      ))}
      <SmolButton color="danger" clicked={addPressed}>
        <PlusSquare />
      </SmolButton>
    </div>
  );
}
