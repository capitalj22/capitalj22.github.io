import { filter, find, includes, map, sortBy } from "lodash-es";
import { useContext, useState } from "react";
import Select, { StylesConfig } from "react-select";
import { AbilitiesContext } from "../../../providers/abilities/abilitiesProvider";
import "./abilitySelect.scss";
import chroma from "chroma-js";

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

  console.log(options);
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

const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const color = {
  color: "var(--textColor)",
};

const bgColor = {
  backgroundColor: "var(--panelColor2)",
};

const colourStyles: StylesConfig<any> = {
  menu: (styles) => ({ ...styles, ...color, ...bgColor }),
  valueContainer: (styles) => ({ ...styles, ...bgColor, ...color }),
  control: (styles) => ({
    ...styles,
    ...color,
    ...bgColor,
    borderColor: "var(--supermutedText)",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      ...color,
      backgroundColor: isSelected ? "var(--panelColor3)" : "var(--panelColor2)",
      ":hover": {
        backgroundColor: "var(--panelColor)",
      },
      ":focus": {
        backgroundColor: "var(--panelColor)",
      },
      ...dot(data.typeColor),
    };
  },

  input: (styles) => ({ ...styles, ...color, ...dot() }),
  placeholder: (styles) => ({ ...styles, ...color }),
  singleValue: (styles, { data }) => ({
    ...styles,
    ...color,
    ...dot(data.typeColor),
  }),
};

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
      styles={colourStyles}
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
