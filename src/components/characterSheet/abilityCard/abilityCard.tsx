import { filter, isFunction } from "lodash-es";
import { Ability } from "../../../entities/abilities/abilities";
import "./abilityCard.scss";

export function AbilityCard(props: { ability: Ability }) {
  const description = isFunction(props.ability.description)
    ? props.ability.description(props.ability.modifiers as any)
    : props.ability.description;
  return (
    <div className="ability-card">
      <div className="title">{props.ability.name}</div>
      <div className="tags">
        <span className="tag">{props.ability.type}</span>
      </div>
      <p className="description">{description}</p>
    </div>
  );
}
