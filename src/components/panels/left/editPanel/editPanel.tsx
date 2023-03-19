import { map } from "lodash-es";
import React, { useState } from "react";
import { PlusSquare, Save } from "react-feather";
import { AbilitiesPanel } from "./abilities/abilitiesPanel";
import { CostPanel } from "./costPanel/costPanel";
import "./editPanel.scss";
import { StatsPanel } from "./stats/statsPanel";

const statOptions = [
  { value: "hp", label: "HP" },
  { value: "armor", label: "Armor" },
  { value: "movement", label: "Movement" },
];

function formatProvidedAbilities(providedAbilities) {
  return map(providedAbilities, (ability) => {
    let modifiers: any[] = [];

    if (ability.modifiers) {
      modifiers = map(Object.keys(ability.modifiers), (key) => ({
        id: key,
        modifier: ability.modifiers[key],
      }));
    }

    return {
      ...ability,
      modifiers,
    };
  });
}

export function EditPanel({ node, graphEvents }) {
  const [id, setId] = useState(node.id);
  const [name, setName] = useState(node.name);
  const [description, setDescription] = useState(node.description);
  const [levels, setLevels] = useState(node.levels);
  const [levelCost, setLevelCost] = useState(node.levelCost);
  const [cost, setCost] = useState(node.cost);
  const [levelsRequired, setLevelRequired] = useState(node.levelsRequired || 0);
  const [providedStats, setProvidedStats] = useState(node.providedStats || []);
  const [providedAbilities, setProvidedAbilities] = useState(
    formatProvidedAbilities(node.providedAbilities || [])
  );

  let nodeColor = node?.colors?.selected;

  const IdUpdated = (event) => {
    setId(event.target.value);
  };

  const NameUpdated = (event) => {
    setName(event.target.value);
  };

  const DescriptionUpdated = (event) => {
    setDescription(event.target.value);
  };

  const levelsRequiredUpdated = (event) => {
    setLevelRequired(event.target.value);
  };

  const AddButtonPressed = (event) => {
    graphEvents.next({
      event: "nodeAdded",
      data: {
        node: {
          requires: node.id,
          id: Math.floor(Math.random() * 200).toString(),
        },
      },
    });
  };

  const SavePressed = (event) => {
    const newNode = {
      id: id,
      name: name,
      description: description,
    } as any;

    if (levels === 1) {
      if (levelCost.length) {
        newNode.cost = levelCost[0];
      } else {
        newNode.cost = 1;
      }
    } else {
      newNode.levels = levels;
      newNode.levelCost = levelCost;
    }

    if (levelsRequired > 1) {
      newNode.levelsRequired = levelsRequired;
    }

    if (providedStats.length) {
      newNode.providedStats = providedStats;
    }

    graphEvents.next({
      event: "nodeEdited",
      data: {
        id: node.id,
        node: newNode,
      },
    });
  };

  const providedStatsChanged = (event) => {
    setProvidedStats(event);
  };

  const providedAbilitiesChanged = (event) => {
    setProvidedAbilities(event);
  };

  const costChanged = (event) => {
    setLevelCost(event.levelCost);
    setLevels(event.levels);

    console.log(event);
  };

  React.useEffect(() => {
    nodeColor = node?.colors?.selected;
    setId(node.id);
    setName(node.name);
    setDescription(node.description);
    setLevels(node.levels || 1);
    setLevelCost(node.levelCost);
    setCost(node.cost);
    setLevelRequired(node.levelsRequired || 1);
    setProvidedStats(node.providedStats || []);
    setProvidedAbilities(formatProvidedAbilities(node.providedAbilities || []));
  }, [node]);

  if (node) {
    return (
      <div className="edit-panel">
        <CostPanel
          levels={levels}
          levelCost={levelCost}
          cost={cost}
          color={nodeColor}
          levelsChanged={costChanged}
        />
        <div className="form-control name">
          <input type="text" onChange={NameUpdated} value={name || ""}></input>
        </div>

        <div className="form-control id">
          <input type="text" onChange={IdUpdated} value={id || ""}></input>
        </div>

        <div className="divider" style={{ backgroundColor: nodeColor }}></div>

        <div className="requires">
          Requires{" "}
          <span className="skill">
            {node.requiredName}{" "}
            <input
              min={1}
              type="number"
              value={levelsRequired}
              onChange={levelsRequiredUpdated}
            ></input>
          </span>
        </div>

        <div className="form-control description">
          <textarea
            rows={4}
            onChange={DescriptionUpdated}
            value={description || ""}
          ></textarea>
        </div>

        <StatsPanel
          providedStats={providedStats}
          providedStatsChanged={providedStatsChanged}
          options={statOptions}
          name="Stat"
        ></StatsPanel>
        <AbilitiesPanel
          providedAbilities={providedAbilities}
          providedAbilitiesChanged={providedAbilitiesChanged}
        ></AbilitiesPanel>

        <div className="buttons">
          <button onClick={SavePressed}>
            <Save />
            Update Node
          </button>

          <button onClick={AddButtonPressed}>
            <PlusSquare />
            Add Child Node
          </button>
        </div>
      </div>
    );
  } else {
    return <div className="edit-panel">Select a Node</div>;
  }
}
