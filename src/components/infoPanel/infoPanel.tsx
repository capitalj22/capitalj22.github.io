import { find, map, times } from "lodash-es";
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

  const cost = info.node?.levels ? (
    <span className="cost">
      {times(info.node?.levels, (index) => (
        <span
          className="level-points"
          style={{
            background: info.node.acquired > index ? nodeColor : "#666",
          }}
        >
          {info.node?.levelCost?.length
            ? info.node.levelCost[index]
            : info.node.levelCost}
        </span>
      ))}
    </span>
  ) : (
    <span className="cost">
      <span
        className="level-points"
        style={{ background: info.node?.selected ? nodeColor : "#666" }}
      >
        {info.node?.cost > 1 ? info.node?.cost : ""}
      </span>
    </span>
  );

  if (info.node) {
    return (
      <div className="info-panel">
        {cost}
        <div className="title">{info.node?.name}</div>

        <div className="divider" style={{ backgroundColor: nodeColor }}></div>
        {!info.node.available ? (
          <div className="requires">
            Requires{" "}
            <span className="skill">
              {info.node.requiredName}{" "}
              {info.node.levelsRequired ? (
                <span>({info.node.levelsRequired})</span>
              ) : null}
            </span>
          </div>
        ) : null}
        <div className="info-description">{info.node?.description}</div>
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
    return <div className="info-panel">Select a Node</div>;
  }
}
