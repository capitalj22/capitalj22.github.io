import { filter, find, includes, map, sortBy } from "lodash-es";
import { useContext, useState } from "react";
import Select from "react-select";
import { AbilitiesContext } from "../../../providers/abilities/abilitiesProvider";
import "./abilitySelect.scss";

function getOption(abilityOptions, id) {
  return find(abilityOptions, { value: id });
}

function getAbilityOptions(abilities) {
  return map(abilities, (ability) => {
    return { value: ability.id, label: ability.name };
  });
}

function getAvailableOptions(usedOptions, abilities, showEmptyOption) {
  const options = sortBy(
    filter(
      getAbilityOptions(abilities),
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
  valueChanged: (value: string) => void;
  defaultValue?: string;
  showEmptyOption?: boolean;
}
export function AbilitySelect({
  usedOptions,
  valueChanged,
  defaultValue,
  showEmptyOption = false,
}: Props) {
  const { abilities } = useContext(AbilitiesContext);
  const [abilityOptions, setAbilityOptions] = useState(
    getAvailableOptions(usedOptions, abilities, showEmptyOption)
  );
  return (
    <Select
      className="ability-select"
      classNames={{
        control: () => "select",
        singleValue: () => "single-value",
        menu: () => "select-menu",
      }}
      options={getAvailableOptions(usedOptions, abilities, showEmptyOption)}
      onChange={(e) => valueChanged(e?.value)}
      defaultValue={
        defaultValue ? getOption(abilityOptions, defaultValue) : null
      }
      value={getOption(abilityOptions, defaultValue)}
    ></Select>
  );
}
