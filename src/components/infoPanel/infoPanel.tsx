import { find, map } from "lodash-es";
import React from "react";
import { ABILITIES } from "../../entities/abilities/abilities";
import { AbilityCard } from "../characterSheet/abilityCard/abilityCard";
import "./infoPanel.scss";

export function InfoPanel({ info }) {
  const relatedAbilities = map(info.node?.providedAbilities, (ability) => {
    return { ...find(ABILITIES, { id: ability.id }), modifiers: {} };
  });

  let nodeColor = info.node?.colors?.selected;

  React.useEffect(() => {
    nodeColor = info.node?.colors?.selected;
  }, [info]);

  const cost = info.node?.points ? (
    <span className="cost" style={{ color: nodeColor }}>
      {info.node?.committed}/{info.node?.points}
    </span>
  ) : (
    <span className="cost" style={{ color: nodeColor }}>
      {info.node?.cost}pt
    </span>
  );

  if (info.node) {
    return (
      <div className="info-panel">
        {cost}
        <div className="title">{info.node?.name}</div>

        <div className="divider" style={{ backgroundColor: nodeColor }}></div>
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
  } else {
    return <div className="info-panel"></div>;
  }
}
