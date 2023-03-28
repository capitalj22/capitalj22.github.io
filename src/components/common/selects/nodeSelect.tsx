import { filter, find, includes, map, sortBy } from "lodash-es";
import { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { NodesContext } from "../../../providers/nodes/nodesProvider";
import "./nodeSelect.scss";
import { selectStyles } from "./select-styles";

function getOption(nodeOptions, val, isMulti) {
  if (isMulti) {
    return map(val, (id) => find(nodeOptions, { value: id }));
  } else {
    return find(nodeOptions, { value: val });
  }
}

function getNodeOptions(nodes) {
  return map(nodes, (node) => {
    return { value: node.id, label: node.name, color: node.colors.selected };
  });
}

function getAvailableOptions(usedOptions, nodes, showEmptyOption) {
  const options = sortBy(
    filter(
      getNodeOptions(nodes),
      (option) => !includes(usedOptions, (option as any).value)
    ),
    "label"
  );

  if (showEmptyOption) {
    return [{ value: null, label: "(None)" }, ...options];
  } else {
    return options;
  }
}

interface Props {
  usedOptions: string[];
  valueChanged: (value: string | string[]) => void;
  defaultValue?: string;
  showEmptyOption?: boolean;
  isMulti?: boolean;
}
export function NodeSelect({
  usedOptions,
  valueChanged,
  defaultValue,
  showEmptyOption = false,
  isMulti = false,
}: Props) {
  const { nodes } = useContext(NodesContext);
  const [nodeOptions, setNodeOptions] = useState(
    getAvailableOptions(usedOptions, nodes, showEmptyOption)
  );
  const [selectedValue, setSelectedValue] = useState(
    getOption(nodeOptions, defaultValue, isMulti)
  );

  useEffect(() => {
    setNodeOptions(getAvailableOptions(usedOptions, nodes, showEmptyOption));
  }, [nodes]);

  useEffect(() => {
    setNodeOptions(getAvailableOptions(usedOptions, nodes, showEmptyOption));
  }, [defaultValue]);

  useEffect(() => {
    setSelectedValue(getOption(nodeOptions, defaultValue, isMulti));
  }, [nodeOptions]);

  const handleNewValueSelected = (event) => {
    if (isMulti) {
      valueChanged(map(event as any, "value"));
    } else {
      valueChanged(event.value);
    }
  };
  function colorStyles():
    | import("react-select").StylesConfig<
        any,
        boolean,
        import("react-select").GroupBase<any>
      >
    | undefined {
    throw new Error("Function not implemented.");
  }

  return (
    <Select
      isMulti={isMulti}
      className="node-select"
      styles={selectStyles({ dot: true, colorProp: "color" })}
      options={nodeOptions}
      onChange={handleNewValueSelected}
      defaultValue={selectedValue}
      value={selectedValue}
    ></Select>
  );
}
