import { clone, find, map, times } from "lodash-es";
import React, { useState } from "react";
import { MinusSquare, PlusSquare, Save } from "react-feather";
import { ABILITIES } from "../../../../entities/abilities/abilities";
import { AbilitiesPanel } from "./abilities/abilitiesPanel";
import "./editPanel.scss";
import { StatsPanel } from "./stats/statsPanel";

function convertLevelCost(levelCost, levels, cost) {
  if (levels) {
    if (levelCost?.length) {
      return levelCost;
    } else {
      const lvlArray: number[] = [];
      times(levels, () => lvlArray.push(levelCost || 1));
      return lvlArray;
    }
  } else {
    return [cost || 1];
  }
}

const statOptions = [
  { value: "hp", label: "HP" },
  { value: "armor", label: "Armor" },
  { value: "movement", label: "Movement" },
];

function formatProvidedAbilities(providedAbilities) {
  console.log('format provided abilities');
  return map(providedAbilities, (ability) => {
    let modifiers: any[] = [];

    if (ability.modifiers) {
      modifiers = map(Object.keys(ability.modifiers), (key) => ({
        id: key,
        modifier: ability.modifiers[key],
      }));
    }

    console.log(modifiers);

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
  const [levelCost, setLevelCost] = useState(
    convertLevelCost(node.levelCost, node.levels, node.cost)
  );
  const [levelsRequired, setLevelRequired] = useState(node.levelsRequired || 0);
  const [providedStats, setProvidedStats] = useState(node.providedStats || []);
  const [providedAbilities, setProvidedAbilities] = useState(
    formatProvidedAbilities(node.providedAbilities || [])
  );

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
      newNode.cost = levelCost[0];
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

  const costPlusClicked = (event) => {
    setLevels(levels + 1);

    if (levelCost.length) {
      setLevelCost([...levelCost, 1]);
    }
  };

  const costMinusClicked = (event) => {
    if (levels > 1) {
      setLevels(levels - 1);

      if (levelCost.length) {
        const newCost = levelCost.slice(0, levelCost.length - 1);
        setLevelCost(newCost);
      }
    }
  };

  const onWheel = (event, index?) => {
    if (event.deltaY < 0) {
      let newCost = clone(levelCost);
      newCost[index] += 1;

      setLevelCost(newCost);
    } else if (levelCost[index] > 1) {
      let newCost = clone(levelCost);
      newCost[index] -= 1;

      setLevelCost(newCost);
    }
  };

  let nodeColor = node?.colors?.selected;

  let costTemplate = (
    <div>
      <button onClick={costMinusClicked}>
        <MinusSquare />
      </button>
      {times(levels, (index) => (
        <span
          onWheel={(e) => onWheel(e, index)}
          className="level-points"
          style={{
            background: nodeColor,
          }}
        >
          {levelCost.length ? levelCost[index] : levelCost}
        </span>
      ))}

      <button onClick={costPlusClicked}>
        <PlusSquare />
      </button>
    </div>
  );

  const providedStatsChanged = (event) => {
    setProvidedStats(event);
  };

  const providedAbilitiesChanged = (event) => {
    setProvidedAbilities(event);
  };

  React.useEffect(() => {
    nodeColor = node?.colors?.selected;
    setId(node.id);
    setName(node.name);
    setDescription(node.description);
    setLevels(node.levels || 1);
    setLevelCost(convertLevelCost(node.levelCost, node.levels, node.cost));
    setLevelRequired(node.levelsRequired || 1);
    setProvidedStats(node.providedStats || []);
    setProvidedAbilities(formatProvidedAbilities(node.providedAbilities || []));
  }, [node]);

  if (node) {
    return (
      <div className="edit-panel">
        <div className="cost-panel">{costTemplate}</div>
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
