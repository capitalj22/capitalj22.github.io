import { clone, map, orderBy, sortBy } from "lodash-es";
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
        {_abilities.map((ability) => (
          <div className="card-wrapper">
            <AbilityCard
              ability={ability}
              isPlayerAbility={true}
              modifiers={ability.modifiers}
              startOpen={false}
              editable={true}
              abilityEdited={abilityEdited}
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
