import { useEffect, useState } from "react";
import { NodeSelect } from "../../../../common/selects/nodeSelect";

export function ExclusiveEdit({ value, valueChanged, nodeId }) {
  const [mappedValue, setMappedValue] = useState(value);

  useEffect(() => {
    setMappedValue(value);
  }, [value]);

  const changed = (value) => {
    let newValue = [...mappedValue];
    newValue = value;
    valueChanged(newValue);
  };

  return (
    <div className="excludes-select">
      <NodeSelect
        defaultValue={mappedValue}
        usedOptions={[nodeId]}
        valueChanged={changed}
        isMulti={true}
      />
    </div>
  );
}
