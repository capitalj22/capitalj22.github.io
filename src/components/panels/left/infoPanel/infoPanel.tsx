import classNames from "classnames";
import { each, find, isUndefined, map, reduce, times } from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { AbilitiesContext } from "../../../../providers/abilities/abilitiesProvider";
import { BuildContext } from "../../../../providers/build/buildProvider";
import { NodesContext } from "../../../../providers/nodes/nodesProvider";
import { AbilityCard } from "../../../characterSheet/abilityCard/abilityCard";

import "./infoPanel.scss";

export const isNodeSelected = (node, nodeMeta) => {
  if (node) {
    if (node?.levels) {
      return nodeMeta?.acquired[node?.id] > 0;
    } else {
      return nodeMeta?.selected[node?.id];
    }
  }
};

function getAcquired(node, nodeMeta) {
  if (node.levels && node.levels > 1) {
    return nodeMeta?.acquired[node.id];
  } else {
    return nodeMeta?.selected[node.id] ? 1 : 0;
  }
}

function getRelatedAbilities(node, abilities) {
  return map(node?.providedAbilities, (ability) => {
    return { ...find(abilities, { id: ability.id }), modifiers: {} };
  });
}

function formatNodeModifiers(providedAbilities, build, selected) {
  let abilities = {};

  each(providedAbilities, (ability) => {
    let modifiers = { ...build?.abilities[ability?.id]?.modifiers } || {};

    each(ability.modifiers, (modifier) => {
      if (!selected) {
        if (isUndefined(modifiers[modifier.id])) {
          modifiers[modifier.id] = modifier.modifier;
        } else modifiers[modifier.id] += modifier.modifier;
      }
    });
    abilities[ability.id] = modifiers;
  });
  return abilities;
}

function getRequiredText(requires, nodes) {
  if (requires?.length) {
    return reduce(
      requires,
      (acc, required) => {
        const node = find(nodes, { id: required.id });
        let text;
        if (required.levels && required.levels > 1) {
          text = `${node?.name} (${required.levels})`;
        } else {
          text = node?.name;
        }
        return [...acc, text];
      },
      [] as string[]
    ).join(" + ");
  }
}

export function InfoPanel({ graphEvents }) {
  const { selectedNodeId, nodes, nodeMeta } = useContext(NodesContext);
  const { build } = useContext(BuildContext);
  const { abilities } = useContext(AbilitiesContext);
  const [node, setNode] = useState(find(nodes, { id: selectedNodeId }));
  const [relatedAbilities, setRelatedAbilities] = useState(
    getRelatedAbilities(node, abilities)
  );
  const [formattedModifiers, setFormattedModifiers] = useState(
    node
      ? formatNodeModifiers(node?.providedAbilities, build, node?.selected)
      : {}
  );
  const [requiredText, setRequiredText] = useState(
    getRequiredText(node?.requires, nodes)
  );
  const [acquired, setAcquired] = useState(getAcquired(node, nodeMeta));

  let nodeColor = node?.colors?.selected;

  useEffect(() => {
    setNode(find(nodes, { id: selectedNodeId }));
  }, [selectedNodeId]);

  useEffect(() => {
    if (node) {
      setAcquired(getAcquired(node, nodeMeta));
      nodeColor = node?.colors?.selected;
      setRelatedAbilities(getRelatedAbilities(node, abilities));
      setFormattedModifiers(
        formatNodeModifiers(node?.providedAbilities, build, node?.selected)
      );
      setRequiredText(getRequiredText(node?.requires, nodes));
    }
  }, [node]);

  const costPressed = (index?) => {
    if (node.levels && node.levels > 1) {
      if (acquired === index + 1) {
        setAcquired(index);
      } else {
        setAcquired(index + 1);
      }
    } else {
      setAcquired(acquired ? 0 : 1);
    }

    graphEvents.next({
      event: "nodeAcquisitionChanged",
      id: selectedNodeId,
      acquired,
    });
  };

  if (node) {
    return (
      <div className="info-panel">
        <div>
          {node?.levels ? (
            <span className="cost">
              {times(node?.levels, (index) => (
                <span
                  onClick={() => costPressed(index)}
                  key={index}
                  className={classNames({
                    "level-points": true,
                    "not-acquired": acquired < index + 1,
                  })}
                  style={acquired > index ? { background: nodeColor } : {}}
                >
                  {node?.levelCost?.length
                    ? node?.levelCost[index]
                    : node?.levelCost}
                </span>
              ))}
            </span>
          ) : (
            <span className="cost">
              <span
                onClick={() => costPressed()}
                className={classNames({
                  "level-points": true,
                  "not-acquired": !acquired,
                })}
                style={acquired ? { background: nodeColor } : {}}
              >
                {node?.cost > 1 ? node?.cost : ""}
              </span>
            </span>
          )}
        </div>

        <div className="title">{node?.name} </div>

        <div className="divider" style={{ backgroundColor: nodeColor }}></div>
        {!nodeMeta?.available[node?.id] ? (
          <div className="requires">
            Requires <span className="skill">{requiredText}</span>
          </div>
        ) : null}
        <div className="info-description">{node?.description}</div>
        {relatedAbilities.length > 0 && (
          <div className="abilities">
            <div className="title">Related Abilities:</div>
            {relatedAbilities &&
              relatedAbilities.map((ability) => (
                <AbilityCard
                  key={ability.id}
                  ability={ability}
                  modifiers={formattedModifiers[ability.id]}
                ></AbilityCard>
              ))}
          </div>
        )}
      </div>
    );
  } else {
    return <div className="info-panel">Select a Node </div>;
  }
}
