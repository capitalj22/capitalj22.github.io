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
        <div className="title">Stats</div>
        <StatLine
          label=" Skill Points Spent"
          value={dragon.pointsInvested}
        ></StatLine>
        <StatLine label="Armor" value={dragon.armor}></StatLine>
        <StatLine label="HP" value={dragon.hp}></StatLine>
        <StatLine label="Movement" value={dragon.movement}></StatLine>
      </div>
      <div className="abilities">
      <div className="title">Abilities</div>
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
  );
}

export default CharacterSheet;
