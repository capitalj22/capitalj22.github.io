import { useEffect, useState } from "react";
import "./App.scss";
import CharacterSheet from "./components/characterSheet/characterSheet";
import { PixiGraph } from "./components/pixi/pixi";
import { filter, reduce, concat, map, isUndefined } from "lodash-es";
import { newDragonFromNodes } from "./entities/actor/dragon.entity";
import { InfoPanel } from "./components/infoPanel/infoPanel";
import buildData from "./data/example-builds/build.json";
import { CodePanel } from "./components/codePanel/codePanel";
import { SidebarRight } from "./components/layout/right/sidebarRight";
import { SidebarLeft } from "./components/layout/left/sidebarLeft";
import { SettingsPanel } from "./components/settingsPanel/settingsPanel";
import { TREES } from "./data/trees/trees";

function getBuild() {
  const localBuild = localStorage.getItem("dragon-build");
  if (localBuild) {
    return JSON.parse(localBuild);
  } else {
    return {};
  }
}

function saveBuild(build) {
  localStorage.setItem("dragon-build", JSON.stringify(build));
  // localStorage.removeItem("dragon-build");
}

function App() {
  const [dragon, setDragon] = useState({ armor: 0, hp: 0 } as any);
  const [tooltip, setTooltip] = useState({ show: false });
  const [info, setInfo] = useState({ show: false });
  const [rightPage, setRightPage] = useState("sheet");
  const [rightMenuTitle, setRightMenuTitle] = useState("");
  const [leftPage, setLeftPage] = useState("info");
  const [leftMenuExpanded, setLeftMenuExpanded] = useState(false);
  const [build, setBuild] = useState(() => getBuild());
  const [force, setForce] = useState(null);

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
    setLeftPage(page);
  };

  const handleRightItemSelected = (page) => {
    setRightPage(page);
    switch (page) {
      case "sheet":
        setRightMenuTitle("Character Sheet");
        break;
      case "code":
        setRightMenuTitle("Import/Export");
        break;
      case "help":
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
    setForce(event);
  };

  let rightMenuPage;
  let leftMenuPage;

  if (rightPage === "sheet") {
    rightMenuPage = <CharacterSheet dragon={dragon}></CharacterSheet>;
  } else if (rightPage === "code") {
    rightMenuPage = (
      <CodePanel
        dragon={dragon}
        importAttempted={handleImportAttempted}
      ></CodePanel>
    );
  } else if (rightPage === "help") {
    rightMenuPage = (
      <div>
        <h2>Mobile Controls</h2>
        <div>Short Tap: View Info</div>
        <div>Long Tap: Select Skill</div>
      </div>
    );
  }

  if (leftPage === "info") {
    leftMenuPage = <InfoPanel info={info}></InfoPanel>;
  } else if (leftPage === "settings") {
    leftMenuPage = (
      <div>
        <SettingsPanel forceUpdated={handleForceUpdated}></SettingsPanel>
      </div>
    );
  }

  return (
    <div className="App">
      {/* <NodeTooltip tooltip={tooltip}></NodeTooltip> */}
      <div className="skill-panel">
        <PixiGraph
          trees={TREES}
          buildData={build}
          force={force}
          nodeSelectionUpdated={nodeSelectionUpdated}
          tooltipUpdated={tooltipUpdated}
          infoUpdated={infoUpdated}
        ></PixiGraph>
        <div className="infoPanel"></div>
      </div>
      <SidebarLeft
        itemSelected={handleLeftItemSelected}
        expanded={leftMenuExpanded}
      >
        {leftMenuPage}
      </SidebarLeft>
      <SidebarRight
        itemSelected={handleRightItemSelected}
        title={rightMenuTitle}
      >
        {rightMenuPage}
      </SidebarRight>
    </div>
  );
}

export default App;
