import { filter } from "lodash-es";
import { AbilityCard } from "./abilityCard/abilityCard";
import "./characterSheet.scss";

function CharacterSheet(props: { dragon: any }) {
  const knownAbilities = filter(props.dragon.abilities, (ability) => {
    return !ability.replaced && ability.learned;
  });
  return (
    <div className="character-sheet">
      <h2>Character Sheet</h2>
      <div className="stats">
        <div className="statLine">
          Skill Points Spent: {props.dragon.pointsInvested}
        </div>
        <div className="statLine">
          <span className="label">Armor:</span>{" "}
          <span>{props.dragon.armor}</span>
        </div>
        <div className="statLine">HP: {props.dragon.hp}</div>
        <div className="title">Abilities</div>
        <div className="abilities">
          {knownAbilities &&
            Object.keys(knownAbilities).map((key) => (
              <AbilityCard ability={knownAbilities[key]}></AbilityCard>
            ))}
        </div>
      </div>
    </div>
  );
}

export default CharacterSheet;
