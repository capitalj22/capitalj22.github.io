import { orderBy, sortBy } from "lodash-es";
import { useEffect, useState } from "react";
import { PlusSquare } from "react-feather";
import { AbilityCard } from "../../../characterSheet/abilityCard/abilityCard";
import "./AbilityEditor.scss";
export function AbilityEditor({ abilities, abilitiesChanged }) {
  const [_abilities, setAbilities] = useState(sortBy(abilities, "name)"));

  useEffect(() => {
    setAbilities(orderBy(abilities, "name"));
    console.log(abilities);
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
            ></AbilityCard>
          </div>
        ))}
        <div className="card-wrapper">
          <button>
            <PlusSquare /> New Ability
          </button>
        </div>
      </div>
    </div>
  );
}
