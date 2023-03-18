import { useEffect, useState } from "react";
import "./App.scss";
import CharacterSheet from "./components/characterSheet/characterSheet";
import { PixiGraph } from "./components/pixi/pixi";
import { filter } from "lodash-es";
import { newDragonFromNodes } from "./entities/actor/dragon.entity";
import { InfoPanel } from "./components/infoPanel/infoPanel";
import { CodePanel } from "./components/codePanel/codePanel";
import { SidebarRight } from "./components/layout/right/sidebarRight";
import { SidebarLeft } from "./components/layout/left/sidebarLeft";
import { SettingsPanel } from "./components/settingsPanel/settingsPanel";
import { TREES } from "./data/trees/trees";
import { PointCounter } from "./components/misc/pointCounter";
import { Subject } from "rxjs";

function getBuild() {
  const localBuild = localStorage.getItem("dragon-build");
  if (localBuild) {
    return JSON.parse(localBuild);
  } else {
    return {};
  }
}

export interface IGraphEvent {
  event: "forcesUpdated" | "modeChanged";
  data: any;
}

const graphEvents$ = new Subject<IGraphEvent>();

function saveBuild(build) {
  localStorage.setItem("dragon-build", JSON.stringify(build));
  // localStorage.removeItem("dragon-build");
}

function App() {
  const [dragon, setDragon] = useState({ armor: 0, hp: 0 } as any);
  const [tooltip, setTooltip] = useState({ show: false });
  const [info, setInfo] = useState({ show: false });
  const [rightMenuTitle, setRightMenuTitle] = useState("");
  const [rightMenuTemplate, setRightMenuTemplate] = useState(
    <CharacterSheet dragon={dragon}></CharacterSheet>
  );
  const [leftPageTemplate, setLeftPageTemplate] = useState(
    <InfoPanel info={info}></InfoPanel>
  );
  const [leftMenuExpanded, setLeftMenuExpanded] = useState(false);
  const [build, setBuild] = useState(() => getBuild());

  useEffect(() => {
    saveBuild(dragon.exportableBuild);
  }, [dragon]);

  const tooltipUpdated = (event) => {
    setTooltip(event);
  };

  const nodeSelectionUpdated = (event) => {
    const selectedNodes = filter(
      event.nodes,
      (node) => node.selected || node.acquired
    );

    setDragon((dragon) => newDragonFromNodes(selectedNodes));
  };

  const handleLeftItemSelected = (page) => {
    switch (page) {
      case "info":
        graphEvents$.next({ event: "modeChanged", data: { mode: "build" } });
        setLeftPageTemplate(<InfoPanel info={info}></InfoPanel>);
        break;
      case "settings":
        graphEvents$.next({ event: "modeChanged", data: { mode: "build" } });
        setLeftPageTemplate(
          <div>
            <SettingsPanel forceUpdated={handleForceUpdated}></SettingsPanel>
          </div>
        );
        break;
      case "edit":
        graphEvents$.next({ event: "modeChanged", data: { mode: "edit" } });
        setLeftPageTemplate(<div>Edit!</div>);
        break;
      default:
        break;
    }
  };

  const handleRightItemSelected = (page) => {
    switch (page) {
      case "sheet":
        setRightMenuTemplate(<CharacterSheet dragon={dragon}></CharacterSheet>);
        setRightMenuTitle("Character Sheet");
        break;
      case "code":
        setRightMenuTemplate(
          <CodePanel
            dragon={dragon}
            importAttempted={handleImportAttempted}
          ></CodePanel>
        );

        setRightMenuTitle("Import/Export");
        break;
      case "help":
        setRightMenuTemplate(
          <div>
            <h2>Mobile Controls</h2>
            <div>Short Tap: View Info</div>
            <div>Long Tap: Select Skill</div>
          </div>
        );
        setRightMenuTitle("Reference");
    }
  };

  const handleImportAttempted = (text) => {
    setBuild(JSON.parse(text));
  };

  const infoUpdated = (event) => {
    setInfo(event);
    setLeftMenuExpanded(true);
    if (!event.node) {
      setLeftMenuExpanded(false);
    }
  };

  const handleForceUpdated = (event) => {
    graphEvents$.next({
      event: "forcesUpdated",
      data: {
        forces: event,
      },
    });
  };

  return (
    <div className="App">
      {/* <NodeTooltip tooltip={tooltip}></NodeTooltip> */}
      <div className="appLeft">
        <SidebarLeft
          itemSelected={handleLeftItemSelected}
          expanded={leftMenuExpanded}
        >
          {leftPageTemplate}
        </SidebarLeft>
        <PointCounter pointsSpent={dragon.pointsInvested}></PointCounter>
      </div>
      <div className="appRight">
        <SidebarRight
          itemSelected={handleRightItemSelected}
          title={rightMenuTitle}
        >
          {rightMenuTemplate}
        </SidebarRight>
      </div>
      <div className="skill-panel">
        <PixiGraph
          trees={TREES}
          buildData={build}
          nodeSelectionUpdated={nodeSelectionUpdated}
          tooltipUpdated={tooltipUpdated}
          infoUpdated={infoUpdated}
          graphEvents={graphEvents$}
        ></PixiGraph>
        <div className="infoPanel"></div>
      </div>
    </div>
  );
}

export default App;
