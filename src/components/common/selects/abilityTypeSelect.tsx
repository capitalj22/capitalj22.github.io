import { find, map } from "lodash-es";
import { useContext, useState } from "react";
import Select from "react-select";
import { AbilitiesContext } from "../../../providers/abilities/abilitiesProvider";
import "./abilitySelect.scss";

function getOption(abilityOptions, id) {
  return find(abilityOptions, { value: id });
}

function getOptions(abilities) {
  return map(abilities, (ability) => {
    return { value: ability.id, label: ability.name };
  });
}

interface Props {
  valueChanged: (value: string) => void;
  defaultValue?: string;
}
export function AbilityTypeSelect({ valueChanged, defaultValue }: Props) {
  const { abilityTypes } = useContext(AbilitiesContext);
  const [abilityOptions, setAbilityOptions] = useState(
    getOptions(abilityTypes)
  );

  return (
    <Select
      className="ability-select"
      classNames={{
        control: () => "select",
        singleValue: () => "single-value",
        menu: () => "select-menu",
      }}
      options={abilityOptions}
      onChange={(e) => valueChanged(e?.value)}
      defaultValue={
        defaultValue ? getOption(abilityOptions, defaultValue) : null
      }
      value={getOption(abilityOptions, defaultValue)}
    ></Select>
  );
}
