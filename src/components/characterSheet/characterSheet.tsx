import { filter, groupBy } from "lodash-es";
import { useEffect, useState } from "react";
import { Accordion } from "../layout/accordion/accordion";
import { AbilityCard } from "./abilityCard/abilityCard";
import "./characterSheet.scss";
import { StatLine } from "./statLine/statLine";

function CharacterSheet({ dragon }) {
  const [knownAbilities, setKnownAbilities] = useState({});

  useEffect(() => {
    setKnownAbilities(
      groupBy(
        filter(dragon.abilities, (ability) => {
          return !ability.replaced && ability.learned;
        }),
        "type"
      )
    );
  }, [dragon]);

  return (
    <div className="character-sheet">
      <div className="stats">
        <div className="statLine">
          Skill Points Spent: {dragon.pointsInvested}
        </div>

        <StatLine label="Armor" value={dragon.armor}></StatLine>
        <StatLine label="HP" value={dragon.hp}></StatLine>
        <StatLine label="Movement" value={dragon.movement}></StatLine>

        <div className="title">Abilities</div>
        <div className="abilities">
          {knownAbilities &&
            Object.keys(knownAbilities).map((key) => (
              <Accordion startOpen={true} name={key}>
                <div className="ability-cards">
                  {knownAbilities[key].map((ability) => (
                    <AbilityCard ability={ability}></AbilityCard>
                  ))}
                </div>
              </Accordion>
            ))}
        </div>
      </div>
    </div>
  );
}

export default CharacterSheet;
