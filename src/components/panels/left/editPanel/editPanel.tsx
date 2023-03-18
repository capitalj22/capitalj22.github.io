import { find, map, times } from "lodash-es";
import React from "react";
import { PlusSquare } from "react-feather";
import { ABILITIES } from "../../../../entities/abilities/abilities";
import { AbilityCard } from "../../../characterSheet/abilityCard/abilityCard";
import "./editPanel.scss";

export function EditPanel({ node, graphEvents }) {
  const relatedAbilities = map(node?.providedAbilities, (ability) => {
    return { ...find(ABILITIES, { id: ability.id }), modifiers: {} };
  });

  const handleAddButtonPressed = (event) => {
    graphEvents.next({
      event: "nodeAdded",
      data: {
        node: {
          requires: node.id,
          id: Math.random().toString()
        },
      },
    });
  };

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
      <div className="edit-panel">
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
        <div className="edit-description">{node?.description}</div>
        {/* {relatedAbilities.length > 0 && (
          <div className="abilities">
            <div className="title">Related Abilities:</div>
            {Object.keys(relatedAbilities).map((key) => (
              <AbilityCard ability={relatedAbilities[key]}></AbilityCard>
            ))}
          </div>
        )} */}

        <button onClick={handleAddButtonPressed}>
          <PlusSquare />
          Add New Skill
        </button>
      </div>
    );
  } else {
    return <div className="edit-panel">Select a Node</div>;
  }
}
