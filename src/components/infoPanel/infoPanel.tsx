import { filter, find, map } from "lodash-es";
import React from "react";
import { useState } from "react";
import { ABILITIES } from "../../entities/abilities/abilities";
import { SkillNode } from "../../entities/skilltree/node.entity";
import { AbilityCard } from "../characterSheet/abilityCard/abilityCard";
import "./infoPanel.scss";

export function InfoPanel({ info }) {
  const relatedAbilities = map(info.node?.providedAbilities, (ability) => {
    return { ...find(ABILITIES, { id: ability.id }), modifiers: {} };
  });

  return (
    <div className="info-panel">
      <div className="title">{info.node?.name}</div>
      <div className="description">{info.node?.description}</div>
      {relatedAbilities.length > 0 && (
        <div className="abilities">
          <div className="title">Related Abilities:</div>
          {Object.keys(relatedAbilities).map((key) => (
            <AbilityCard ability={relatedAbilities[key]}></AbilityCard>
          ))}
        </div>
      )}
    </div>
  );
}
