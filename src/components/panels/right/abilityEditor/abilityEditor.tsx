import { filter, map, orderBy, sortBy } from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { PlusSquare } from "react-feather";
import { AbilitiesContext } from "../../../../providers/abilities/abilitiesProvider";
import { AbilityCard } from "../../../characterSheet/abilityCard/abilityCard";
import "./abilityEditor.scss";

export function AbilityEditor({ abilitiesChanged }) {
  const { abilities, setAbilities } = useContext(AbilitiesContext);

  const abilityEdited = (event) => {
    let newAbilities = map(abilities, (ability) => {
      if (ability.id === event.id) {
        return event.ability;
      }
      return ability;
    });

    setAbilities(newAbilities);
    abilitiesChanged(newAbilities);
  };

  const abilityCopied = (event) => {
    // let newAbilities = map(abilities, (ability) => {
    //   if (ability.id === event.id) {
    //     return event.ability;
    //   }
    //   return ability;
    // });

    // newAbilities.push({
    //   ...event.ability,
    //   id: `${event.ability.id}-copy`,
    //   name: `${event.ability.name} Copy`,
    // });

    // setAbilities(newAbilities);
    // abilitiesChanged(newAbilities);
  };

  const abilityRemoved = (id) => {
    // let newAbilities = filter(abilities, (ability) => ability.id !== id);
    // setAbilities(newAbilities);
    // abilitiesChanged(newAbilities);
  };

  const addButtonPressed = () => {
    // setAbilities([
    //   ...abilities,
    //   { name: "Name", id: "id", description: "...", tags: [], type: "action" },
    // ]);
  };

  // useEffect(() => {
  //   setAbilities(orderBy(abilities, "name"));
  // }, [abilities]);
  return (
    <div className="ability-editor">
      <div className="ability-cards">
        {abilities.map((ability, index) => (
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
