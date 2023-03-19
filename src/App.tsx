import { useEffect, useState } from "react";
import "./App.scss";
import { PixiGraph } from "./components/pixi/pixi";
import { filter } from "lodash-es";
import { newDragonFromNodes } from "./entities/actor/dragon.entity";
import { TREES } from "./data/trees/trees";
import { PointCounter } from "./components/misc/pointCounter";
import { Subject } from "rxjs";
import { LeftPanel } from "./components/panels/left/leftPanel";
import { RightPanel } from "./components/panels/right/rightPanel";

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

export interface IGraphEvent {
  event:
    | "forcesUpdated"
    | "modeChanged"
    | "nodeAdded"
    | "nodeEdited"
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

function App() {
  const [dragon, setDragon] = useState({ armor: 0, hp: 0 } as any);
  const [selectedNode, setSelectedNode] = useState({});
  const [nodes, setNodes] = useState(() => getNodes());

  const [build, setBuild] = useState(() => getBuild());

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

    setDragon((dragon) => newDragonFromNodes(selectedNodes));
  };

  const handleImportAttempted = (text) => {
    setBuild(JSON.parse(text));
  };

  const infoUpdated = (event) => {
    setSelectedNode(event.node);
  };

  return (
    <div className="App">
      <div className="appLeft">
        <LeftPanel
          build={dragon}
          selectedNode={selectedNode}
          graphEvents$={graphEvents$}
        ></LeftPanel>
        <PointCounter pointsSpent={dragon.pointsInvested}></PointCounter>
      </div>
      <div className="appRight">
        <RightPanel
          build={dragon}
          importAttempted={handleImportAttempted}
        ></RightPanel>
      </div>
      <div className="skill-panel">
        <PixiGraph
          trees={nodes}
          buildData={build}
          nodeSelectionUpdated={nodeSelectionUpdated}
          infoUpdated={infoUpdated}
          graphEvents={graphEvents$}
        ></PixiGraph>
      </div>
    </div>
  );
}

export default App;
