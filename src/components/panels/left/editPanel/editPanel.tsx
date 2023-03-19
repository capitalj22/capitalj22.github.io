import { clone, find, map, times } from "lodash-es";
import React, { useState } from "react";
import { MinusSquare, PlusSquare, Save } from "react-feather";
import { ABILITIES } from "../../../../entities/abilities/abilities";
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

export function EditPanel({ node, graphEvents }) {
  const relatedAbilities = map(node?.providedAbilities, (ability) => {
    return { ...find(ABILITIES, { id: ability.id }), modifiers: {} };
  });

  const [id, setId] = useState(node.id);
  const [name, setName] = useState(node.name);
  const [description, setDescription] = useState(node.description);
  const [levels, setLevels] = useState(node.levels);
  const [levelCost, setLevelCost] = useState(
    convertLevelCost(node.levelCost, node.levels, node.cost)
  );
  const [levelsRequired, setLevelRequired] = useState(node.levelsRequired || 0);
  const [providedStats, setProvidedStats] = useState(node.providedStats || []);

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

  React.useEffect(() => {
    nodeColor = node?.colors?.selected;
    setId(node.id);
    setName(node.name);
    setDescription(node.description);
    setLevels(node.levels || 1);
    setLevelCost(convertLevelCost(node.levelCost, node.levels, node.cost));
    setLevelRequired(node.levelsRequired || 1);
    setProvidedStats(node.providedStats || []);
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

        {/* <div className="stats">
          <div>Stats:</div>
          {providedStats?.length
            ? map(providedStats, (stat, index) => (
                <div className="stat-edit-line">
                  <Select
                    classNames={{
                      control: () => "select",
                      singleValue: () => "single-value",
                      menu: () => "select-menu",
                    }}
                    // theme={(theme) => ({
                    //   ...theme,
                    //   colors: {
                    //     ...theme.colors,
                    //     text: "#3599B8",
                    //     font: "#3599B8",
                    //     primary25: "#3599B8",
                    //     primary: "#3599B8",
                    //     neutral80: "black",
                    //     color: "black",
                    //   },
                    // })}
                    options={statOptions}
                    onChange={(e) => statIdChanged(e, index)}
                    defaultValue={find(statOptions, { value: stat.id })}
                  ></Select>
                  <input
                    type="number"
                    value={stat?.modifier}
                    onChange={(e) => statModifierChanged(e, index)}
                  ></input>
                </div>
              ))
            : ""}
        </div> */}

        <StatsPanel
          providedStats={providedStats}
          providedStatsChanged={providedStatsChanged}
        ></StatsPanel>
        <div className="abilities">
          <div>Abilities:</div>
        </div>
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
