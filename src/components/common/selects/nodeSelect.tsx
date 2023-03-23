import { filter, find, includes, map, sortBy } from "lodash-es";
import { useContext, useState } from "react";
import Select from "react-select";
import { NodesContext } from "../../../providers/nodes/nodesProvider";
import "./nodeSelect.scss";

function getOption(nodeOptions, val, isMulti) {
  if (isMulti) {
    return map(val, (id) => find(nodeOptions, { value: id }));
  } else {
    return find(nodeOptions, { value: val });
  }
}

function getNodeOptions(nodes) {
  return map(nodes, (node) => {
    return { value: node.id, label: node.name };
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

  console.log(defaultValue);

  const handleNewValueSelected = (event) => {
    console.log(event);
    if (isMulti) {
      valueChanged(map(event as any, "value"));
    } else {
      valueChanged(event.value);
    }
  };
  return (
    <Select
      isMulti={isMulti}
      className="node-select"
      classNames={{
        control: () => "select",
        singleValue: () => "single-value",
        menu: () => "select-menu",
      }}
      options={getAvailableOptions(usedOptions, nodes, showEmptyOption)}
      onChange={handleNewValueSelected}
      defaultValue={
        defaultValue ? getOption(nodeOptions, defaultValue, isMulti) : null
      }
      value={getOption(nodeOptions, defaultValue, isMulti)}
    ></Select>
  );
}
