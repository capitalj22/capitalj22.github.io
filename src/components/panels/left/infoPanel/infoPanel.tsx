import { each, find, isUndefined, map, reduce, times } from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { AbilitiesContext } from "../../../../providers/abilities/abilitiesProvider";
import { BuildContext } from "../../../../providers/build/buildProvider";
import { AbilityCard } from "../../../characterSheet/abilityCard/abilityCard";
import "./infoPanel.scss";

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

export function InfoPanel({ node }) {
  const { build } = useContext(BuildContext);
  const { abilities } = useContext(AbilitiesContext);
  const [relatedAbilities, setRelatedAbilities] = useState(
    getRelatedAbilities(node, abilities)
  );
  const [formattedModifiers, setFormattedModifiers] = useState(
    node
      ? formatNodeModifiers(node.providedAbilities, build, node.selected)
      : {}
  );

  let nodeColor = node?.colors?.selected;

  useEffect(() => {
    if (node) {
      nodeColor = node?.colors?.selected;
      setRelatedAbilities(getRelatedAbilities(node, abilities));
      setFormattedModifiers(
        formatNodeModifiers(node?.providedAbilities, build, node.selected)
      );
    }
  }, [node]);

  useEffect(() => {}, [build]);

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
            {relatedAbilities &&
              relatedAbilities.map((ability) => (
                <AbilityCard
                  ability={ability}
                  modifiers={formattedModifiers[ability.id]}
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
