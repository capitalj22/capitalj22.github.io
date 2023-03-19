import { clone, each, find } from "lodash-es";
import { useEffect, useState } from "react";
import { Ability } from "../../../entities/abilities/abilities";
import { StatTag } from "../statTag/statTag";
import "./abilityCard.scss";

function applyParamsToDescription(description, params) {
  let editedDescription = description;
  each(Object.keys(params), (key) => {
    let value = params[key];

    editedDescription = editedDescription.replace(
      new RegExp("%" + key + "%", "g"),
      value
    );
  });

  return editedDescription;
}

function getDescription(ability, isPlayerAbility, modifiers) {
  let description;
  let params = clone(ability.params);

  if (params && modifiers) {
    each(Object.keys(params), (key) => {
      if (modifiers[key]) {
        params[key] = params[key] + modifiers[key];
      }
    });
  }

  // console.log(params);

  if (ability.params) {
    description = applyParamsToDescription(ability.description, params);
  }
  if (isPlayerAbility) {
    // description = isFunction(ability.description)
    //   ? ability.description(ability.modifiers as any)
    //   : ability.description;
  } else {
    // description = isFunction(ability.description)
    //   ? ability.description({})
    //   : ability.description;
  }

  return description;
}

type Props = {
  ability: Ability;
  isPlayerAbility?: boolean;
  modifiers?: any;
};
export function AbilityCard({ ability, isPlayerAbility, modifiers }: Props) {
  const [description, setDescription] = useState(
    getDescription(ability, isPlayerAbility, modifiers)
  );

  useEffect(() => {
    setDescription(getDescription(ability, isPlayerAbility, modifiers));
  }, [ability, modifiers]);

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
