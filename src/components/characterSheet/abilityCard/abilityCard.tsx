import { filter, isFunction } from "lodash-es";
import { Ability } from "../../../entities/abilities/abilities";
import { StatTag } from "../statTag/statTag";
import "./abilityCard.scss";

export function AbilityCard(props: { ability: Ability }) {
  const description = isFunction(props.ability.description)
    ? props.ability.description(props.ability.modifiers as any)
    : props.ability.description;
  return (
    <div className="ability-card">
      <div className="top">
        <div className="card-title">{props.ability.name}</div>

        <p className="description">{description}</p>
      </div>
      <div className="bottom">
        <div className="tags">
          <StatTag label={props.ability.type}></StatTag>
          {props.ability.tags?.map((tag) => (
            <StatTag label={tag}></StatTag>
          ))}
        </div>
      </div>
    </div>
  );
}
