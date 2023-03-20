import { clone, filter, map, orderBy, sortBy } from "lodash-es";
import { useEffect, useState } from "react";
import { PlusSquare } from "react-feather";
import { AbilityCard } from "../../../characterSheet/abilityCard/abilityCard";
import "./abilityEditor.scss";

export function AbilityEditor({ abilities, abilitiesChanged }) {
  const [_abilities, setAbilities] = useState(sortBy(abilities, "name)"));

  const abilityEdited = (event) => {
    let newAbilities = map(_abilities, (ability) => {
      if (ability.id === event.id) {
        return event.ability;
      }
      return ability;
    });

    setAbilities(newAbilities);
    abilitiesChanged(newAbilities);
  };

  const abilityCopied = (event) => {
    let newAbilities = map(_abilities, (ability) => {
      if (ability.id === event.id) {
        return event.ability;
      }
      return ability;
    });

    newAbilities.push({
      ...event.ability,
      id: `${event.ability.id}-copy`,
      name: `${event.ability.name} Copy`,
    });

    setAbilities(newAbilities);
    abilitiesChanged(newAbilities);
  };

  const abilityRemoved = (id) => {
    let newAbilities = filter(_abilities, (ability) => ability.id !== id);
    setAbilities(newAbilities);
    abilitiesChanged(newAbilities);
  };

  const addButtonPressed = () => {
    setAbilities([
      ..._abilities,
      { name: "Name", id: "id", description: "...", tags: [], type: "action" },
    ]);
  };

  useEffect(() => {
    setAbilities(orderBy(abilities, "name"));
  }, [abilities]);
  return (
    <div className="ability-editor">
      <div className="ability-cards">
        {_abilities.map((ability, index) => (
          <div className="card-wrapper">
            <AbilityCard
              key={index}
              ability={ability}
              isPlayerAbility={true}
              modifiers={ability.modifiers}
              startOpen={false}
              editable={true}
              abilityEdited={abilityEdited}
              abilityCopied={abilityCopied}
              abilityRemoved={abilityRemoved}
            ></AbilityCard>
          </div>
        ))}
        <div className="card-wrapper new-button">
          <button onClick={addButtonPressed}>
            <PlusSquare /> New Ability
          </button>
        </div>
      </div>
    </div>
  );
}
