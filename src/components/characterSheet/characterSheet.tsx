import { filter, groupBy } from "lodash-es";
import { Accordion } from "../layout/accordion/accordion";
import { AbilityCard } from "./abilityCard/abilityCard";
import "./characterSheet.scss";
import { StatLine } from "./statLine/statLine";

function CharacterSheet(props: { dragon: any }) {
  const knownAbilities = groupBy(
    filter(props.dragon.abilities, (ability) => {
      return !ability.replaced && ability.learned;
    }),
    "type"
  );

  console.log(knownAbilities);
  return (
    <div className="character-sheet">
      <h2>Character Sheet</h2>
      <div className="stats">
        <div className="statLine">
          Skill Points Spent: {props.dragon.pointsInvested}
        </div>

        <StatLine label="Armor" value={props.dragon.armor}></StatLine>
        <StatLine label="HP" value={props.dragon.hp}></StatLine>
        <StatLine label="Movement" value={props.dragon.movement}></StatLine>

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
