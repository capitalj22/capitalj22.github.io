import { clone, each, filter, find, includes, map, sortBy } from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { PlusSquare, XCircle } from "react-feather";
import { Ability } from "../../../../../entities/abilities/abilities";
import { AbilitiesContext } from "../../../../../providers/abilities/abilitiesProvider";
import { AbilityCard } from "../../../../characterSheet/abilityCard/abilityCard";
import { AbilitySelect } from "../../../../common/selects/abilitySelect";
import { StatsPanel } from "../stats/statsPanel";
import "./abilitiesPanel.scss";

function getModifierOptions(abilityId, allAbilities) {
  const ability = find(allAbilities, { id: abilityId });

  if (ability?.params) {
    return map(Object.keys(ability.params), (param) => ({
      label: param,
      value: param,
    }));
  } else {
    return [];
  }
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
  const allAbilities = useContext(AbilitiesContext).abilities;
  const [_providedAbilities, setAbilities] = useState(providedAbilities);

  const abilityChanged = (event, index) => {
    console.log(event, index);
    const newAbilities = clone(_providedAbilities);
    newAbilities[index].id = event;
    newAbilities[index].modifiers = [];

    providedAbilitiesChanged(newAbilities);
  };

  const removeStatClicked = (event, index) => {
    let newAbilities = clone(_providedAbilities);
    newAbilities = filter(newAbilities, (stat, idx) => index !== idx);

    providedAbilitiesChanged(newAbilities);
  };

  const addbuttonClicked = () => {
    let newAbilities = clone(_providedAbilities);
    newAbilities.push({ id: "", modifier: 1 });

    providedAbilitiesChanged(newAbilities);
  };

  const handleModifiersChanged = (event, index) => {
    const newAbilities = clone(_providedAbilities);
    newAbilities[index].modifiers = event;

    providedAbilitiesChanged(newAbilities);
  };

  const grantChanged = (event, index) => {
    const newAbilities = clone(_providedAbilities);
    newAbilities[index].gain = !newAbilities[index].gain;

    providedAbilitiesChanged(newAbilities);
  };

  useEffect(() => {
    setAbilities(() => providedAbilities);
  }, [providedAbilities]);

  return (
    <div className="abilities-panel">
      {_providedAbilities.length
        ? map(_providedAbilities, (ability, index) => (
            <div className="stat-edit-line">
              <div className="ability-select">
                <button
                  className="remove-ability-button"
                  onClick={(e) => removeStatClicked(e, index)}
                >
                  <XCircle />
                </button>
                <AbilitySelect
                  usedOptions={map(_providedAbilities, "id")}
                  defaultValue={ability.id}
                  valueChanged={(e) => abilityChanged(e, index)}
                />
              </div>

              {ability.id ? (
                <div className="ability-options">
                  {find(allAbilities, { id: ability?.id }) && (
                    <AbilityCard
                      ability={
                        find(allAbilities, { id: ability?.id }) as Ability
                      }
                      modifiers={formatModifiersForCard(ability.modifiers)}
                      isPlayerAbility={false}
                      editable={true}
                      startOpen={false}
                    ></AbilityCard>
                  )}
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
                  {find(allAbilities, { id: ability?.id })?.params ? (
                    <StatsPanel
                      providedStats={ability.modifiers}
                      providedStatsChanged={(e) =>
                        handleModifiersChanged(e, index)
                      }
                      options={getModifierOptions(ability.id, allAbilities)}
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
