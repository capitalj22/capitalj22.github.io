import classNames from "classnames";
import { divide, each, find, isUndefined, map, reduce, times } from "lodash-es";
import { useContext, useEffect, useRef, useState } from "react";
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
  if (node) {
    if (node.levels && node.levels > 1) {
      return nodeMeta?.acquired[node.id];
    } else {
      return nodeMeta?.selected[node.id] ? 1 : 0;
    }
  }
  return [];
}

function nameFromId(id, nodes) {
  return find(nodes, { id })?.name;
}

function getRelatedAbilities(node, abilities) {
  return map(node?.providedAbilities, (ability) => {
    return { ...find(abilities, { id: ability.id }), modifiers: {} };
  });
}

function formatNodeModifiers(providedAbilities, build, node, nodeMeta) {
  let abilities = {};
  each(providedAbilities, (ability) => {
    let modifiers = { ...build?.abilities[ability?.id]?.modifiers } || {};

    each(ability.modifiers, (modifier) => {
      if (node.levels && node.levels > 1) {
        if (!nodeMeta.acquired[node.id]) {
          if (isUndefined(modifiers[modifier.id])) {
            modifiers[modifier.id] = modifier.modifier;
          } else
            modifiers[modifier.id] +=
              modifier.modifier * nodeMeta.acquired[node.id];
        }
      } else {
        if (!nodeMeta.selected[node.id]) {
          if (isUndefined(modifiers[modifier.id])) {
            modifiers[modifier.id] = modifier.modifier;
          } else modifiers[modifier.id] += modifier.modifier;
        }
      }
    });
    abilities[ability.id] = modifiers;
  });
  return abilities;
}

function getRequiredText(node, nodes) {
  let requiredText = "";

  if (node?.requires?.length) {
    requiredText = reduce(
      node.requires,
      (acc, required) => {
        const node = find(nodes, { id: required.id });
        let text;
        if (required.levels && required.levels > 1) {
          text = `${node?.name} (${required.levels})`;
        } else {
          text = node?.name;
        }
        return [...acc, `${text}`];
      },
      [] as string[]
    ).join(node.requirementType === "or" ? " or " : " and ");
  }
  return `${requiredText}`;
}

export function InfoPanel({ graphEvents$ }) {
  const { selectedNodeId, nodes, nodeMeta } = useContext(NodesContext);
  const { build } = useContext(BuildContext);
  const { abilities } = useContext(AbilitiesContext);
  const [node, setNode] = useState(find(nodes, { id: selectedNodeId }));
  const [relatedAbilities, setRelatedAbilities] = useState(
    getRelatedAbilities(node, abilities)
  );

  const [formattedModifiers, setFormattedModifiers] = useState(
    node
      ? formatNodeModifiers(node?.providedAbilities, build, node, nodeMeta)
      : {}
  );

  const [requiredText, setRequiredText] = useState(
    getRequiredText(node, nodes)
  );

  const [acquired, setAcquired] = useState(getAcquired(node, nodeMeta));
  const requiredTextRef = useRef(requiredText);
  let nodeColor = node?.colors?.selected;
  const nodeRef = useRef(node);

  useEffect(() => {
    graphEvents$.subscribe({
      next: (event) => {
        if (event.event === "nodeMetaUpdated") {
          setAcquired(getAcquired(nodeRef.current, event.data.nodeMeta));
        }
      },
    });
  }, []);

  useEffect(() => {
    setFormattedModifiers(
      formatNodeModifiers(
        nodeRef.current?.providedAbilities,
        build,
        nodeRef.current,
        nodeMeta
      )
    );
  }, [build]);

  useEffect(() => {
    setNode(find(nodes, { id: selectedNodeId }));
    nodeRef.current = find(nodes, { id: selectedNodeId });
  }, [selectedNodeId]);

  useEffect(() => {
    if (node) {
      setAcquired(getAcquired(node, nodeMeta));
      nodeColor = node?.colors?.selected;
      setRelatedAbilities(getRelatedAbilities(node, abilities));
      setFormattedModifiers(
        formatNodeModifiers(node?.providedAbilities, build, node, nodeMeta)
      );
      setRequiredText(getRequiredText(node, node));
      requiredTextRef.current = getRequiredText(node, nodes);
    }
  }, [node]);

  // useEffect(() => {
  //   setAcquired(getAcquired(node, nodeMeta));
  //   requiredTextRef.current = getRequiredText(node, nodes);
  // }, [nodeMeta]);

  const costPressed = (index?) => {
    if (nodeMeta.available[selectedNodeId]) {
      let newAcquired = acquired;

      if (node.levels && node.levels > 1) {
        if (acquired === index + 1) {
          newAcquired = index;
        } else {
          newAcquired = index + 1;
        }
      } else {
        newAcquired = !newAcquired;
      }

      setAcquired(newAcquired);

      graphEvents$.next({
        event: "nodeAcquisitionChanged",
        data: {
          id: selectedNodeId,
          acquired: newAcquired,
        },
      });
    }
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
                    unavailable: !nodeMeta.available[selectedNodeId],
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
                  unavailable: !nodeMeta.available[selectedNodeId],
                  "level-points": true,
                  "not-acquired": !acquired,
                })}
                style={acquired ? { background: nodeColor } : {}}
              >
                {node?.cost !== 1 && node.cost !== undefined ? node?.cost : ""}
              </span>
            </span>
          )}
        </div>

        <div className="title">{node?.name} </div>

        <div className="divider" style={{ backgroundColor: nodeColor }}></div>
        {!nodeMeta?.available[node?.id] ? (
          <div className="requires">
            <span>Requires</span>{" "}
            <span className="skill">{requiredTextRef.current}</span>
          </div>
        ) : null}
        {!!node?.exclusiveWith?.length && (
          <div className="exclusions">
            Exclusive With
            <div className="skills">
              {node?.exclusiveWith?.map((exclusion) => (
                <div className="skill">{nameFromId(exclusion, nodes)}</div>
              ))}
            </div>
          </div>
        )}
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
