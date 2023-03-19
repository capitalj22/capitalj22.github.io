import { clone, each, filter, find, includes, map, sortBy } from "lodash-es";
import { useEffect, useState } from "react";
import { PlusSquare, XCircle } from "react-feather";
import Select from "react-select";
import {
  ABILITIES,
  Ability,
} from "../../../../../entities/abilities/abilities";
import { AbilityCard } from "../../../../characterSheet/abilityCard/abilityCard";
import { StatsPanel } from "../stats/statsPanel";
import "./abilitiesPanel.scss";

const abilityOptions = map(ABILITIES, (ability) => {
  return { value: ability.id, label: ability.name };
});

function getModifierOptions(abilityId) {
  const ability = find(ABILITIES, { id: abilityId });

  if (ability?.params) {
    return map(Object.keys(ability.params), (param) => ({
      label: param,
      value: param,
    }));
  } else {
    return [];
  }
}

function getOption(abilityId) {
  return find(abilityOptions, { value: abilityId });
}

function getAvailableOptions(providedAbilities) {
  const usedAbilities = map(providedAbilities, (stat) => stat.id);

  return sortBy(
    filter(
      abilityOptions,
      (options) => !includes(usedAbilities, options.value)
    ),
    "label"
  );
}

function formatModifiersForCard(rawModifiers) {
  let modifiers = {};

  each(rawModifiers, (m) => {
    modifiers[m.id] = m.modifier;
  });

  return modifiers;
}

export function AbilitiesPanel({
  providedAbilities,
  providedAbilitiesChanged,
}) {
  const [abilities, setAbilities] = useState(providedAbilities);

  const abilityChanged = (event, index) => {
    const newAbilities = clone(abilities);
    newAbilities[index].id = event.value;
    newAbilities[index].modifiers = [];

    providedAbilitiesChanged(newAbilities);
  };

  const removeStatClicked = (event, index) => {
    let newAbilities = clone(abilities);
    newAbilities = filter(newAbilities, (stat, idx) => index !== idx);

    providedAbilitiesChanged(newAbilities);
  };

  const addbuttonClicked = () => {
    let newAbilities = clone(abilities);
    newAbilities.push({ id: "", modifier: 1 });

    providedAbilitiesChanged(newAbilities);
  };

  const handleModifiersChanged = (event, index) => {
    const newAbilities = clone(abilities);
    newAbilities[index].modifiers = event;

    providedAbilitiesChanged(newAbilities);
  };

  const grantChanged = (event, index) => {
    const newAbilities = clone(abilities);
    newAbilities[index].gain = !newAbilities[index].gain;

    providedAbilitiesChanged(newAbilities);
  };

  useEffect(() => {
    setAbilities(() => providedAbilities);
  }, [providedAbilities]);

  return (
    <div className="abilities-panel">
      <div className="abilities-title">Abilities:</div>
      {abilities.length
        ? map(abilities, (ability, index) => (
            <div className="stat-edit-line">
              <div className="ability-select">
                <button onClick={(e) => removeStatClicked(e, index)}>
                  <XCircle />
                </button>
                <Select
                  classNames={{
                    control: () => "select",
                    singleValue: () => "single-value",
                    menu: () => "select-menu",
                  }}
                  options={getAvailableOptions(abilities)}
                  onChange={(e) => abilityChanged(e, index)}
                  defaultValue={getOption(ability.id)}
                  value={getOption(ability.id)}
                ></Select>
              </div>

              {/* <input
                type="number"
                value={stat?.modifier}
                onChange={(e) => statModifierChanged(e, index)}
              ></input> */}

              {ability.id ? (
                <div className="ability-options">
                  <AbilityCard
                    ability={find(ABILITIES, { id: ability?.id }) as Ability}
                    modifiers={formatModifiersForCard(ability.modifiers)}
                    isPlayerAbility={false}
                  ></AbilityCard>
                  <div className="grant">
                    <label>
                      Grant
                      <input
                        type="checkbox"
                        checked={ability.gain}
                        onChange={(e) => grantChanged(e, index)}
                      ></input>
                    </label>
                  </div>
                  {find(ABILITIES, { id: ability?.id })?.params ? (
                    <StatsPanel
                      providedStats={ability.modifiers}
                      providedStatsChanged={(e) =>
                        handleModifiersChanged(e, index)
                      }
                      options={getModifierOptions(ability.id)}
                      name="Modifier"
                    ></StatsPanel>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          ))
        : ""}
      <div className="add-button">
        <button onClick={addbuttonClicked}>
          Add Ability
          <PlusSquare />
        </button>
      </div>
    </div>
  );
}
