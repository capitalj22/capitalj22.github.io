import { useContext, useEffect, useRef, useState } from "react";
import { Subject } from "rxjs";
import { StatsContext } from "../../providers/stats/statsProvider";
import { TagsContext } from "../../providers/tags/tagsProvider";
import { AbilitiesContext } from "../../providers/abilities/abilitiesProvider";
import exampleJson from "../../data/example-config.json";
import { BuildContext } from "../../providers/build/buildProvider";
import { LeftPanel } from "../panels/left/leftPanel";
import { RightPanel } from "../panels/right/rightPanel";
import { PointCounter } from "../misc/pointCounter";
import { PixiGraph } from "../pixi/pixi";

function getNodes() {
  const localBuild = localStorage.getItem("dragon-nodes");
  let myNodes;
  if (localBuild) {
    try {
      myNodes = JSON.parse(localBuild);
    } catch (e) {
      console.log(e);
    }
  }

  return myNodes || {};
}

export interface IGraphEvent {
  event:
    | "forcesUpdated"
    | "modeChanged"
    | "nodeAdded"
    | "nodeDeleted"
    | "nodeEdited"
    | "nodeSelectionChanged"
    | "nodesChanged";
  data: any;
}

const graphEvents$ = new Subject<IGraphEvent>();

function saveNodes(nodes) {
  localStorage.setItem("dragon-nodes", JSON.stringify(nodes));
}

export function Main() {
  const { build, setSavedBuild } = useContext(BuildContext);
  const { setTagColors } = useContext(TagsContext);
  const { setStats } = useContext(StatsContext);
  const { setAbilityTypes, setAbilities } = useContext(AbilitiesContext);
  const [selectedNode, setSelectedNode] = useState({});
  const [nodes, setNodes] = useState(() => getNodes());

  useEffect(() => {
    saveNodes(nodes);
  }, [nodes]);

  useEffect(() => {
    graphEvents$.subscribe({
      next: (event) => {
        if (event.event === "nodesChanged") {
          setNodes(event.data.nodes);
        }
      },
    });
  }, []);

  const handleImportAttempted = (event) => {
    if (event.type === "build") {
      const build = JSON.parse(event.data);

      if (build) {
        setSavedBuild({ type: "imported", build: JSON.parse(event.data) });
      }
    } else if (event.type === "trees") {
      const config = JSON.parse(event.data);
      setSavedBuild({ type: "imported", build: {} });
      if (config) {
        if (config.nodes) {
          setNodes(config.nodes);
        }
        if (config.abilities) {
          setAbilities({ type: "set", abilities: config.abilities });
        }
        if (config.tagColors) {
          setTagColors({ type: "set", colors: config.tagColors });
        }
        if (config.stats) {
          setStats({ type: "set", stats: config.stats });
        }

        if (config.abilityTypes) {
          setAbilityTypes({ type: "set", abilityTypes: config.abilityTypes });
        }
      }
    } else if (event.type === "reset") {
      setNodes([{ id: "start here", name: "Start Here", colors: {} }]);
      setAbilities({ type: "set", abilities: [] });
      setAbilityTypes({ type: "set", abilityTypes: [] });
      setTagColors({ type: "set", tagColors: [] });
      setStats({ type: "set", stats: [] });

      setSavedBuild({ type: "imported", build: {} });
    } else if (event.type === "default") {
      const defaults = exampleJson;
      setNodes(defaults.nodes);
      setStats({ type: "set", stats: defaults.stats });
      setAbilityTypes({ type: "set", abilityTypes: defaults.abilityTypes });
      setAbilities({ type: "set", abilities: defaults.abilities });
      setTagColors({ type: "set", colors: defaults.tagColors });
      setSavedBuild({ type: "imported", build: {} });
    }
  };

  const infoUpdated = (event) => {
    setSelectedNode(event.node);
  };

  return (
    <div className="App">
      <div className="appLeft">
        <LeftPanel
          selectedNode={selectedNode}
          graphEvents$={graphEvents$}
        ></LeftPanel>
        <PointCounter pointsSpent={build.pointsInvested}></PointCounter>
      </div>
      <div className="appRight">
        <RightPanel
          nodes={nodes}
          importAttempted={handleImportAttempted}
        ></RightPanel>
      </div>
      <div className="skill-panel">
        <PixiGraph
          trees={nodes}
          infoUpdated={infoUpdated}
          graphEvents={graphEvents$}
        ></PixiGraph>
      </div>
    </div>
  );
}
