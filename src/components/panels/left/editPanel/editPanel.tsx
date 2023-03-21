import React, { useContext, useEffect, useState } from "react";
import { PlusSquare, Save, Trash2 } from "react-feather";
import { AbilitiesPanel } from "./abilities/abilitiesPanel";
import { CostPanel } from "./costPanel/costPanel";
import "./editPanel.scss";
import { StatsPanel } from "./stats/statsPanel";
import { ColorPicker } from "../../../common/color-picker/colorPicker";
import { SkillNode } from "../../../../entities/skilltree/node.entity";
import { Ability } from "../../../../entities/abilities/abilities";
import TextareaAutosize from "react-textarea-autosize";
import { Accordion } from "../../../layout/accordion/accordion";
import { StatsContext } from "../../../../providers/stats/statsProvider";
import { map } from "lodash-es";

interface Props {
  node?: SkillNode;
  graphEvents: any;
  abilities: Ability[];
}

function getStatOptions(stats) {
  return map(stats, (stat) => ({ value: stat.id, label: stat.name }));
}

export function EditPanel({
  node = {} as SkillNode,
  graphEvents,
  abilities,
}: Props) {
  const { stats } = useContext(StatsContext);
  const [id, setId] = useState(node.id);
  const [name, setName] = useState(node.name);
  const [description, setDescription] = useState(node.description);
  const [levels, setLevels] = useState(node.levels);
  const [levelCost, setLevelCost] = useState(node.levelCost);
  const [cost, setCost] = useState(node.cost);
  const [levelsRequired, setLevelRequired] = useState(node.levelsRequired || 0);
  const [providedStats, setProvidedStats] = useState(node.providedStats || []);
  const [providedAbilities, setProvidedAbilities] = useState(
    node.providedAbilities || []
  );
  const [_abilities, setAbilities] = useState(abilities);
  const [colors, setColors] = useState(node.colors || {});

  useEffect(() => {
    setAbilities(abilities);
  }, [abilities]);

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

  const deletePressed = (event) => {
    graphEvents.next({ event: "nodeDeleted", data: { id: id } });
  };

  const SavePressed = (event) => {
    const newNode = {
      id: id,
      name: name,
      description: description,
      colors,
    } as any;

    if (levels === 1) {
      if ((levelCost as any)?.length) {
        newNode.cost = (levelCost as any)[0];
      } else {
        newNode.cost = 1;
      }
    } else {
      newNode.levels = levels;
      newNode.levelCost = levelCost;
    }

    if (levelsRequired > 0) {
      newNode.levelsRequired = levelsRequired;
    }

    if (providedStats.length) {
      newNode.providedStats = providedStats;
    }

    if (providedAbilities.length) {
      newNode.providedAbilities = providedAbilities;
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
  };

  const colorChanged = (event, which) => {
    setColors({ ...colors, [which]: event });
  };

  React.useEffect(() => {
    setColors(node.colors || {});
    setId(node.id);
    setName(node.name);
    setDescription(node.description);
    setLevels(node.levels || 1);
    setLevelCost(node.levelCost);
    setCost(node.cost);
    setLevelRequired(node.levelsRequired || 1);
    setProvidedStats(node.providedStats || []);
    setProvidedAbilities(node.providedAbilities || []);
  }, [node]);

  if (node.id) {
    return (
      <div className="edit-panel">
        <CostPanel
          levels={levels}
          levelCost={levelCost}
          cost={cost}
          color={colors.selected}
          levelsChanged={costChanged}
        />
        <div className="form-control name">
          <input type="text" onChange={NameUpdated} value={name || ""}></input>
        </div>

        <div className="form-control id">
          <input type="text" onChange={IdUpdated} value={id || ""}></input>
        </div>

        <div className="colors">
          <div className="color-item">
            <ColorPicker
              color={colors.unavailable}
              colorChanged={(e) => colorChanged(e, "unavailable")}
            />
          </div>
          <div className="color-item">
            <ColorPicker
              color={colors.inactive}
              colorChanged={(e) => colorChanged(e, "inactive")}
            />
          </div>
          <div className="color-item">
            <ColorPicker
              color={colors.selected}
              colorChanged={(e) => colorChanged(e, "selected")}
            />
          </div>
        </div>

        <div className="requires">
          Requires{" "}
          <span className="skill">
            {(node as any).requiredName}{" "}
            <input
              min={1}
              type="number"
              value={levelsRequired}
              onChange={levelsRequiredUpdated}
            ></input>
          </span>
        </div>

        <div className="form-control description">
          <TextareaAutosize
            rows={4}
            onChange={DescriptionUpdated}
            value={description || ""}
          />
        </div>
        <Accordion name="Stats" startOpen={false}>
          <StatsPanel
            providedStats={providedStats as any}
            providedStatsChanged={providedStatsChanged}
            options={getStatOptions(stats)}
            name="Stat"
          ></StatsPanel>
        </Accordion>
        <Accordion name="Abilities" startOpen={false}>
          <AbilitiesPanel
            providedAbilities={providedAbilities}
            providedAbilitiesChanged={providedAbilitiesChanged}
          ></AbilitiesPanel>
        </Accordion>

        <div className="buttons">
          <button className="green" onClick={SavePressed}>
            <Save />
            Save Node
          </button>
          <button onClick={deletePressed} className="red">
            <Trash2 />
            Delete Node
          </button>

          <button onClick={AddButtonPressed}>
            <PlusSquare />
            Save and Add Child Node
          </button>
        </div>
      </div>
    );
  } else {
    return <div className="edit-panel">Select a Node</div>;
  }
}
