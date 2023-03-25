import React, { useContext, useEffect, useRef, useState } from "react";
import { PlusSquare, Save, Trash2 } from "react-feather";
import { AbilitiesPanel } from "./abilities/abilitiesPanel";
import { CostPanel } from "./costPanel/costPanel";
import "./editPanel.scss";
import { StatsPanel } from "./stats/statsPanel";
import { ColorPicker } from "../../../common/color-picker/colorPicker";
import TextareaAutosize from "react-textarea-autosize";
import { Accordion } from "../../../layout/accordion/accordion";
import { StatsContext } from "../../../../providers/stats/statsProvider";
import { filter, find, map, sample, some } from "lodash-es";
import { BigButton } from "../../../common/buttons/bigButton";
import { NodesContext } from "../../../../providers/nodes/nodesProvider";
import { RequiresEdit } from "./requiresEdit";
import { AbilitiesContext } from "../../../../providers/abilities/abilitiesProvider";

interface Props {
  graphEvents?: any;
}

function getStatOptions(stats) {
  return map(stats, (stat) => ({ value: stat.id, label: stat.name }));
}

function getGlobalParamOptions(globalParams) {
  return map(globalParams, (param) => ({ value: param.id, label: param.id }));
}

export function EditPanel({ graphEvents }: Props) {
  const { selectedNodeId, nodes, setNodes } = useContext(NodesContext);
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
  const [requirementType, setRequirementType] = useState(
    node.requirementType || "and"
  );
  const [unsavedData, setUnsavedData] = useState(false);
  const { globalParams, setGlobalParams } = useContext(AbilitiesContext);
  const [nodeGlobalParams, setNodeGlobalParams] = useState(
    node.globalParams || []
  );
  const nameInputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(node.id);


  useEffect(() => {
    setNode(find(nodes, { id: selectedNodeId }) || {});
    setUnsavedData(false);
  }, [selectedNodeId]);

  const IdUpdated = (event) => {
    setId(event.target.value);
    idRef.current = event.target.value;
    setUnsavedData(true);
  };

  const NameUpdated = (event) => {
    setName(event.target.value);
    setUnsavedData(true);
  };

  const DescriptionUpdated = (event) => {
    setDescription(event.target.value);
    setUnsavedData(true);
  };

  const AddButtonPressed = (event) => {
    SavePressed({});

    const numChildren = filter(nodes, (node) =>
      some(node.requires, { id: node.id })
    )?.length;

    console.log(idRef.current)

    let newNode = {
      name: "NEW NODE",
      requires: [{ id: idRef.current, levels: 1 }],
      id: `${idRef.current}-${numChildren + 1}-${sample([
        "a",
        "b",
        "c",
        "d",
        "e",
      ])}${sample(["x", "z", "y", "v", "d"])}`,

      colors: colors,
    };

    setNodes({ type: "add", node: newNode });

    graphEvents.next({
      event: "nodeAdded",
      data: {
        node: newNode,
      },
    });
    nameInputRef.current?.focus();
  };

  const deletePressed = (event) => {
    graphEvents.next({ event: "nodeDeleted", data: { id: id } });
    setNodes({ type: "remove", node });
  };

  // [d] SAVE
  const SavePressed = (event) => {
    const newNode = {
      id: id,
      name: name,
      requires: requires,
      requirementType: requires.length < 2 ? "and" : requirementType,
      description: description,
      globalParams: nodeGlobalParams,
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

    setUnsavedData(false);
    setNodes({ type: "update", node: newNode, targetId: oldId });
  };

  const providedStatsChanged = (event) => {
    setProvidedStats(event);
    setUnsavedData(true);
  };

  const providedAbilitiesChanged = (event) => {
    setProvidedAbilities(event);
    setUnsavedData(true);
  };

  const costChanged = (event) => {
    setLevelCost(event.levelCost);
    setLevels(event.levels);
    setUnsavedData(true);
  };

  const colorChanged = (event, which) => {
    setColors({ ...colors, [which]: event });
    setUnsavedData(true);
  };

  const requiredChanged = (event) => {
    setRequires(event.requires);
    setRequirementType(event.requirementType);
    setUnsavedData(true);
  };

  const nodeGlobalParamsChanged = (event) => {
    setNodeGlobalParams(event);
    setUnsavedData(true);
  };

  React.useEffect(() => {
    setColors(node.colors || {});
    setId(node.id);
    idRef.current = node.id;
    setName(node.name);
    setDescription(node.description);
    setLevels(node.levels || 1);
    setLevelCost(node.levelCost);
    setCost(node.cost);
    setProvidedStats(node.providedStats || []);
    setProvidedAbilities(node.providedAbilities || []);
    setOldId(node.id);
    setRequires(node.requires || []);
    setRequirementType(node.requirementType || "and");
    setNodeGlobalParams(node.globalParams || []);
  }, [node]);

  if (node.id) {
    return (
      <div className="edit-panel">
        <div className="edit-panel-top">
          <CostPanel
            levels={levels}
            levelCost={levelCost}
            cost={cost}
            color={colors.selected}
            levelsChanged={costChanged}
          />
        </div>

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

        <div className="form-control node-description">
          <TextareaAutosize
            rows={6}
            onChange={DescriptionUpdated}
            value={description || ""}
          />
        </div>
        <div className="accordions">
          <Accordion name="Requires" startOpen={false}>
            <div className="requires">
              <RequiresEdit
                requirementType={requirementType}
                value={requires}
                valueChanged={requiredChanged}
                nodeId={id}
              />
            </div>
          </Accordion>
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
          <Accordion name="Global Params" startOpen={false}>
            <StatsPanel
              providedStats={nodeGlobalParams as any}
              providedStatsChanged={nodeGlobalParamsChanged}
              options={getGlobalParamOptions(globalParams)}
              name="Stat"
            ></StatsPanel>
          </Accordion>
        </div>

        <div className="buttons">
          <BigButton
            disabled={!unsavedData}
            type="outline"
            color="success"
            clicked={SavePressed}
          >
            <Save />
            {unsavedData ? "Save Node" : "Node Saved"}
          </BigButton>
          <BigButton type="outline" color="success" clicked={AddButtonPressed}>
            <span>
              <Save />
              <PlusSquare />
            </span>
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
