import { useEffect, useRef, useState } from "react";
import "./App.scss";
import { PixiGraph } from "./components/pixi/pixi";
import { filter } from "lodash-es";
import { newDragonFromNodes } from "./entities/actor/dragon.entity";
import { TREES } from "./data/trees/trees";
import { PointCounter } from "./components/misc/pointCounter";
import { Subject } from "rxjs";
import { LeftPanel } from "./components/panels/left/leftPanel";
import { RightPanel } from "./components/panels/right/rightPanel";
import { ABILITIES } from "./entities/abilities/abilities";

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

function getAbilities() {
  const localAbilities = localStorage.getItem("dragon-abilities");
  let myAbilities;
  if (localAbilities) {
    try {
      myAbilities = JSON.parse(localAbilities);
    } catch (e) {
      console.log(e);
    }
  }

  return myAbilities || {};
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

function saveAbilities(nodes) {
  localStorage.setItem("dragon-abilities", JSON.stringify(nodes));
  // localStorage.removeItem("dragon-nodes");
}

function App() {
  const [dragon, setDragon] = useState({ armor: 0, hp: 0 } as any);
  const [selectedNode, setSelectedNode] = useState({});
  const [nodes, setNodes] = useState(() => getNodes());
  // const [abilities, setAbilities] = useState(ABILITIES);
  const [abilities, setAbilities] = useState(getAbilities());

  const activeAbilities = useRef(abilities);

  const [build, setBuild] = useState(() => getBuild());

  useEffect(() => {
    saveBuild(dragon.exportableBuild);
  }, [dragon]);

  useEffect(() => {
    saveNodes(nodes);
  }, [nodes]);

  useEffect(() => {
    saveAbilities(abilities);
  }, [abilities]);

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
          setAbilities(config.abilities);
        }
      }
    } else if (event.type === "reset") {
      setNodes([{ id: "start here", name: "Start Here", colors: {} }]);
      setAbilities([]);
      setBuild({});
    } else if (event.type === "default") {
      setNodes(TREES);
      setAbilities(ABILITIES);
      setBuild({});
    }
  };

  const infoUpdated = (event) => {
    setSelectedNode(event.node);
  };

  const handleAbilitiesChanged = (event) => {
    console.log(event);
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
          abilities={abilities}
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

export default App;
