import { filter, find, includes, map, sortBy } from "lodash-es";
import { useContext, useState } from "react";
import Select, { StylesConfig } from "react-select";
import { AbilitiesContext } from "../../../providers/abilities/abilitiesProvider";
import "./abilitySelect.scss";
import chroma from "chroma-js";
import { selectStyles } from "./select-styles";

function getOption(abilityOptions, id) {
  return find(abilityOptions, { value: id });
}

function getAbilityOptions(abilities, abilityTypes) {
  const options = map(abilities, (ability) => {
    return {
      value: ability.id,
      label: ability.name,
      typeColor: find(abilityTypes, { id: ability.type })?.color || "#ffffff",
    };
  });

  return options;
}

function getAvailableOptions(
  usedOptions,
  abilities,
  showEmptyOption,
  abilityTypes
) {
  const options = sortBy(
    filter(
      getAbilityOptions(abilities, abilityTypes),
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
  const { abilities, abilityTypes } = useContext(AbilitiesContext);
  const [abilityOptions, setAbilityOptions] = useState(
    getAvailableOptions(usedOptions, abilities, showEmptyOption, abilityTypes)
  );
  return (
    <Select
      className="ability-select"
      styles={selectStyles({ dot: true, colorProp: "typeColor" })}
      options={getAvailableOptions(
        usedOptions,
        abilities,
        showEmptyOption,
        abilityTypes
      )}
      onChange={(e) => valueChanged(e?.value)}
      defaultValue={
        defaultValue ? getOption(abilityOptions, defaultValue) : null
      }
      value={getOption(abilityOptions, defaultValue)}
    ></Select>
  );
}
