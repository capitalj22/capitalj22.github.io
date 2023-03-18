import { clone, find, map, times } from "lodash-es";
import React, { useState } from "react";
import { MinusSquare, PlusSquare, Save } from "react-feather";
import { ABILITIES } from "../../../../entities/abilities/abilities";
import { AbilityCard } from "../../../characterSheet/abilityCard/abilityCard";
import "./editPanel.scss";

function convertLevelCost(levelCost, cost) {
  if (levelCost) {
    if (levelCost.length) {
      return levelCost;
    } else {
      return [levelCost];
    }
  } else {
    return [cost];
  }
}
export function EditPanel({ node, graphEvents }) {
  const relatedAbilities = map(node?.providedAbilities, (ability) => {
    return { ...find(ABILITIES, { id: ability.id }), modifiers: {} };
  });

  const [id, setId] = useState(node.id);
  const [name, setName] = useState(node.name);
  const [description, setDescription] = useState(node.description);
  const [levels, setLevels] = useState(node.levels);
  const [levelCost, setLevelCost] = useState(
    convertLevelCost(node.levelCost, node.cost)
  );

  const handleIdUpdated = (event) => {
    setId(event.target.value);
  };

  const handleNameUpdated = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionUpdated = (event) => {
    setDescription(event.target.value);
  };

  const handleAddButtonPressed = (event) => {
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

  const handleSavePressed = (event) => {
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

  React.useEffect(() => {
    nodeColor = node?.colors?.selected;
    setId(node.id);
    setName(node.name);
    setDescription(node.description);
    setLevels(node.levels || 1);
    setLevelCost(convertLevelCost(node.levelCost, node.cost));
  }, [node]);

  if (node) {
    return (
      <div className="edit-panel">
        <div className="cost-panel">{costTemplate}</div>
        <div className="form-control name">
          <input
            type="text"
            onChange={handleNameUpdated}
            value={name || ""}
          ></input>
        </div>

        <div className="form-control id">
          <input
            type="text"
            onChange={handleIdUpdated}
            value={id || ""}
          ></input>
        </div>

        <div className="divider" style={{ backgroundColor: nodeColor }}></div>

        <div className="form-control description">
          <textarea
            rows={4}
            onChange={handleDescriptionUpdated}
            value={description || ""}
          ></textarea>
        </div>

        <div className="buttons">
          <button onClick={handleSavePressed}>
            <Save />
            Update Node
          </button>

          <button onClick={handleAddButtonPressed}>
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
