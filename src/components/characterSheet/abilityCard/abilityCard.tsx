import { filter, isFunction } from "lodash-es";
import { useState } from "react";
import { Ability } from "../../../entities/abilities/abilities";
import { StatTag } from "../statTag/statTag";
import "./abilityCard.scss";

function getDescription(ability, isPlayerAbility) {
  let description;

  if (isPlayerAbility) {
    description = isFunction(ability.description)
      ? ability.description(ability.modifiers as any)
      : ability.description;
  } else {
    description = isFunction(ability.description)
      ? ability.description({})
      : ability.description;
  }

  return description;
}

type Props = {
  ability: Ability;
  isPlayerAbility?: boolean;
};
export function AbilityCard({ ability, isPlayerAbility }: Props) {
  const [description, setDescription] = useState(
    getDescription(ability, isPlayerAbility)
  );

  return (
    <div className="ability-card">
      <div className="top">
        <div className="card-title">{ability.name}</div>

        <p className="description">{description}</p>
      </div>
      <div className="bottom">
        <div className="tags">
          <StatTag label={ability.type}></StatTag>
          {ability.tags?.map((tag) => (
            <StatTag label={tag}></StatTag>
          ))}
        </div>
      </div>
    </div>
  );
}
