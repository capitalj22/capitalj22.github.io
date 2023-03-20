import { find, map, times } from "lodash-es";
import React from "react";
import { AbilityCard } from "../../../characterSheet/abilityCard/abilityCard";
import "./infoPanel.scss";

export function InfoPanel({ node, build, abilities }) {
  const relatedAbilities = map(node?.providedAbilities, (ability) => {
    return { ...find(abilities, { id: ability.id }), modifiers: {} };
  });

  let nodeColor = node?.colors?.selected;

  React.useEffect(() => {
    nodeColor = node?.colors?.selected;
  }, [node]);

  const cost = node?.levels ? (
    <span className="cost">
      {times(node?.levels, (index) => (
        <span
          className="level-points"
          style={{
            background: node.acquired > index ? nodeColor : "#666",
          }}
        >
          {node?.levelCost?.length ? node.levelCost[index] : node.levelCost}
        </span>
      ))}
    </span>
  ) : (
    <span className="cost">
      <span
        className="level-points"
        style={{ background: node?.selected ? nodeColor : "#666" }}
      >
        {node?.cost > 1 ? node?.cost : ""}
      </span>
    </span>
  );

  if (node) {
    return (
      <div className="info-panel">
        {cost}
        <div className="title">{node?.name}</div>

        <div className="divider" style={{ backgroundColor: nodeColor }}></div>
        {!node.available ? (
          <div className="requires">
            Requires{" "}
            <span className="skill">
              {node.requiredName}{" "}
              {node.levelsRequired ? (
                <span>({node.levelsRequired})</span>
              ) : null}
            </span>
          </div>
        ) : null}
        <div className="info-description">{node?.description}</div>
        {relatedAbilities.length > 0 && (
          <div className="abilities">
            <div className="title">Related Abilities:</div>
            {Object.keys(relatedAbilities).map((key) => (
              <AbilityCard
                ability={relatedAbilities[key]}
                modifiers={
                  build?.abilities[relatedAbilities[key]?.id]?.modifiers
                }
              ></AbilityCard>
            ))}
          </div>
        )}
      </div>
    );
  } else {
    return <div className="info-panel">Select a Node</div>;
  }
}
