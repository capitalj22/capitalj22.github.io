import React, { useContext, useEffect, useRef, useState } from "react";
import { PlusSquare, Save, Trash2 } from "react-feather";
import { AbilitiesPanel } from "./abilities/abilitiesPanel";
import { CostPanel } from "./costPanel/costPanel";
import "./editPanel.scss";
import { StatsPanel } from "./stats/statsPanel";
import { ColorPicker } from "../../../common/color-picker/colorPicker";
import { SkillNode } from "../../../../entities/skilltree/node.entity";
import TextareaAutosize from "react-textarea-autosize";
import { Accordion } from "../../../layout/accordion/accordion";
import { StatsContext } from "../../../../providers/stats/statsProvider";
import { filter, find, map, some, sortBy } from "lodash-es";
import { BigButton } from "../../../common/buttons/bigButton";
import { NodesContext } from "../../../../providers/nodes/nodesProvider";
import { NodeSelect } from "../../../common/selects/nodeSelect";
import { RequiresEdit } from "./requiresEdit";

interface Props {
  node?: SkillNode;
  graphEvents: any;
}

function getStatOptions(stats) {
  return map(stats, (stat) => ({ value: stat.id, label: stat.name }));
}

export function EditPanel({ graphEvents }: Props) {
  const { selectedNodeId, nodes, setNodes, setSelectedNodeId } =
    useContext(NodesContext);
  const { stats } = useContext(StatsContext);
  const [node, setNode] = useState(find(nodes, { id: selectedNodeId }) || {});
  const [id, setId] = useState(node.id);
  const [name, setName] = useState(node.name);
  const [description, setDescription] = useState(node.description);
  const [levels, setLevels] = useState(node.levels);
  const [levelCost, setLevelCost] = useState(node.levelCost);
  const [cost, setCost] = useState(node.cost);
  const [providedStats, setProvidedStats] = useState(node.providedStats || []);
  const [providedAbilities, setProvidedAbilities] = useState(
    node.providedAbilities || []
  );
  const [colors, setColors] = useState(node.colors || {});
  const [oldId, setOldId] = useState(node.id);
  const [requires, setRequires] = useState(node.requires || []);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNode(find(nodes, { id: selectedNodeId }) || {});
  }, [selectedNodeId]);

  const IdUpdated = (event) => {
    setId(event.target.value);
  };

  const NameUpdated = (event) => {
    setName(event.target.value);
  };

  const DescriptionUpdated = (event) => {
    setDescription(event.target.value);
  };

  const AddButtonPressed = (event) => {
    SavePressed({});

    const numChildren = filter(nodes, (node) =>
      some(node.requires, { id: node.id })
    )?.length;

    let newNode = {
      name: "NEW NODE",
      requires: [{ id: selectedNodeId, levels: 1 }],
      id: `${node.id}-${numChildren + 1}`,

      colors: node.colors,
    };

    setNodes({ type: "add", node: newNode });

    graphEvents.next({
      event: "nodeAdded",
      data: {
        node: newNode,
      },
    });
  };

  const deletePressed = (event) => {
    graphEvents.next({ event: "nodeDeleted", data: { id: id } });
    setNodes({ type: "remove", node });
  };

  const SavePressed = (event) => {
    const newNode = {
      id: id,
      name: name,
      requires: requires,
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
    if (providedStats.length) {
      newNode.providedStats = providedStats;
    }

    if (providedAbilities.length) {
      newNode.providedAbilities = providedAbilities;
    }

    graphEvents.next({
      event: "nodeEdited",
      data: {
        id: oldId,
        node: newNode,
      },
    });

    setNodes({ type: "update", node: newNode, targetId: oldId });
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

  const requiredChanged = (event) => {
    setRequires(event);
  };

  React.useEffect(() => {
    setColors(node.colors || {});
    setId(node.id);
    setName(node.name);
    setDescription(node.description);
    setLevels(node.levels || 1);
    setLevelCost(node.levelCost);
    setCost(node.cost);
    setProvidedStats(node.providedStats || []);
    setProvidedAbilities(node.providedAbilities || []);
    setOldId(node.id);
    setRequires(node.requires || []);

    nameInputRef.current?.focus();
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
          <input
            type="text"
            ref={nameInputRef}
            onChange={NameUpdated}
            value={name || ""}
          ></input>
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
              color={colors.selected}
              colorChanged={(e) => colorChanged(e, "selected")}
            />
          </div>
        </div>

        <div className="requires">
          Requires{" "}
          <RequiresEdit
            value={requires}
            valueChanged={requiredChanged}
            nodeId={id}
          />
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
          <BigButton type="outline" color="success" clicked={SavePressed}>
            <Save />
            Save Node
          </BigButton>
          <BigButton type="outline" color="success" clicked={AddButtonPressed}>
            <PlusSquare />
            Save and Add Child Node
          </BigButton>
          <BigButton type="outline" clicked={deletePressed} color="danger">
            <Trash2 />
            Delete Node
          </BigButton>
        </div>
      </div>
    );
  } else {
    return <div className="edit-panel">Select a Node</div>;
  }
}
