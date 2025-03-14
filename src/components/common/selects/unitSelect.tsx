import { filter, find, includes, map, sortBy } from "lodash-es";
import { useContext, useState } from "react";
import Select, { StylesConfig } from "react-select";
import { BuildContext } from "../../../providers/build/buildProvider";
import { selectStyles } from "./select-styles";

function getOption(unitOptions, id, isMulti) {
  if (isMulti) {
    return [find(unitOptions, { value: id })];
  }
  return find(unitOptions, { value: id });
}

function getUnitOptions(customUnits, defaultUnits) {
  const options = map([...(customUnits || []), ...(defaultUnits || [])], (unit) => {
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
  valueChanged: (value: string | any[]) => void;
  defaultIds?: string | string[];
  showEmptyOption?: boolean;
  excludeDefaultUnits?: boolean;
  isMulti?: boolean;
}
export function UnitSelect({
  valueChanged,
  defaultIds,
  excludeDefaultUnits,
  isMulti,
}: Props) {
  const { customUnits, defaultUnits } = useContext(BuildContext);
  const [options, setOptions] = useState(
    getAvailableOptions(customUnits, excludeDefaultUnits ? [] : defaultUnits)
  );

  return (
    <Select
      className="unit-select"
      styles={selectStyles()}
      options={options}
      isMulti={!!isMulti}
      closeMenuOnSelect={!isMulti}
      onChange={(e) => valueChanged(e)}
      defaultValue={defaultIds}
    ></Select>
  );
}
