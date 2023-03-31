import { filter, find, includes, map, sortBy } from "lodash-es";
import { useContext, useState } from "react";
import Select, { StylesConfig } from "react-select";
import { BuildContext } from "../../../providers/build/buildProvider";
import { selectStyles } from "./select-styles";

function getOption(abilityOptions, id) {
  return find(abilityOptions, { value: id });
}

function getUnitOptions(customUnits, defaultUnits) {
  const options = map([...customUnits, ...defaultUnits], (unit) => {
    return {
      value: unit.id as string,
      label: unit.name as string,
    };
  });

  return options;
}

function getAvailableOptions(customUnits, defaultUnits) {
  const options = sortBy(getUnitOptions(customUnits, defaultUnits), "label");
  return options;
}

interface Props {
  valueChanged: (value: string) => void;
  defaultValue?: string;
  showEmptyOption?: boolean;
}
export function UnitSelect({ valueChanged, defaultValue }: Props) {
  const { customUnits, defaultUnits, selectedUnitId } =
    useContext(BuildContext);
  const [options, setOptions] = useState(
    getAvailableOptions(customUnits, defaultUnits)
  );

  return (
    <Select
      className="unit-select"
      styles={selectStyles()}
      options={options}
      onChange={(e) => valueChanged(e?.value)}
      defaultValue={defaultValue ? getOption(options, defaultValue) : null}
      value={getOption(options, defaultValue)}
    ></Select>
  );
}
