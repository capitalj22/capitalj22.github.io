import { useContext, useEffect, useRef, useState } from "react";
import { PixiGraph } from "../pixi/pixi";
import { filter } from "lodash-es";
import { newDragonFromNodes } from "../../entities/actor/dragon.entity";
import { PointCounter } from "../misc/pointCounter";
import { Subject } from "rxjs";
import { LeftPanel } from "../panels/left/leftPanel";
import { RightPanel } from "../panels/right/rightPanel";
import { StatsContext } from "../../providers/stats/statsProvider";
import { TagsContext } from "../../providers/tags/tagsProvider";
import { AbilitiesContext } from "../../providers/abilities/abilitiesProvider";
import exampleJson from "../../data/example-config.json";

function getBuild() {
  const localBuild = localStorage.getItem("dragon-build");
  let myBuild;
  if (localBuild) {
    try {
      myBuild = JSON.parse(localBuild);
    } catch (e) {
      console.log(e);
    }
  }

  return myBuild || {};
}

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

function saveBuild(build) {
  localStorage.setItem("dragon-build", JSON.stringify(build));
  // localStorage.removeItem("dragon-build");
}

function saveNodes(nodes) {
  localStorage.setItem("dragon-nodes", JSON.stringify(nodes));
  // localStorage.removeItem("dragon-nodes");
}

export function Main() {
  const { setTagColors } = useContext(TagsContext);
  const { setStats } = useContext(StatsContext);
  const { setAbilityTypes, abilities, setAbilities } =
    useContext(AbilitiesContext);
  const [selectedNode, setSelectedNode] = useState({});
  const [nodes, setNodes] = useState(() => getNodes());

  const activeAbilities = useRef(abilities);

  const [build, setBuild] = useState(() => getBuild());
  const [dragon, setDragon] = useState(newDragonFromNodes(nodes, abilities));

  useEffect(() => {
    saveBuild(dragon.exportableBuild);
  }, [dragon]);

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

  const nodeSelectionUpdated = (event) => {
    const selectedNodes = filter(
      event.nodes,
      (node) => node.selected || node.acquired
    );
    setDragon((dragon) =>
      newDragonFromNodes(selectedNodes, activeAbilities.current)
    );
  };

  const handleImportAttempted = (event) => {
    if (event.type === "build") {
      const build = JSON.parse(event.data);

      if (build) {
        setBuild(JSON.parse(event.data));
      }
    } else if (event.type === "trees") {
      const config = JSON.parse(event.data);
      setBuild({});
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
      setBuild({});
    } else if (event.type === "default") {
      const defaults = exampleJson;
      setNodes(defaults.nodes);
      setAbilityTypes({ type: "set", abilityTypes: defaults.abilityTypes });
      setAbilities({ type: "set", abilities: defaults.abilities });
      setBuild({});
    }
  };

  const infoUpdated = (event) => {
    setSelectedNode(event.node);
  };

  const handleAbilitiesChanged = (event) => {
    setAbilities(() => [...event]);
    activeAbilities.current = [...event];
  };

  return (
    <div className="App">
      <div className="appLeft">
        <LeftPanel
          abilities={abilities}
          build={dragon}
          selectedNode={selectedNode}
          graphEvents$={graphEvents$}
        ></LeftPanel>
        <PointCounter pointsSpent={dragon.pointsInvested}></PointCounter>
      </div>
      <div className="appRight">
        <RightPanel
          build={dragon}
          nodes={nodes}
          importAttempted={handleImportAttempted}
          abilitiesChanged={handleAbilitiesChanged}
        ></RightPanel>
      </div>
      <div className="skill-panel">
        <PixiGraph
          trees={nodes}
          buildData={build}
          nodeSelectionUpdated={(e) => nodeSelectionUpdated(e)}
          infoUpdated={infoUpdated}
          graphEvents={graphEvents$}
        ></PixiGraph>
      </div>
    </div>
  );
}
