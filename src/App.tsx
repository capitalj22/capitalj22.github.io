import { useState } from "react";
import "./App.scss";
import CharacterSheet from "./components/characterSheet/characterSheet";
import { PixiGraph } from "./components/pixi/pixi";
import { filter, reduce, concat, map } from "lodash-es";
import { newDragonFromNodes } from "./entities/actor/dragon.entity";
import { InfoPanel } from "./components/infoPanel/infoPanel";
import { SidebarRight } from "./components/layout/sidebarRight";
import buildData from "./data/example-builds/build.json";
import { CodePanel } from "./components/codePanel/codePanel";
import { BASIC_TREE } from "./data/trees/basic.tree";
import { MOVEMENT_TREE } from "./data/trees/movement.tree";
import { FLYING_TREE } from "./data/trees/flying.tree";
import { ATTACK_TREE } from "./data/trees/attack.tree";
import { ARMOR_TREE } from "./data/trees/armor.tree";
import { BASIC_MAGIC_TREE } from "./data/trees/magic/basic-magic.tree";
import { HOLY_TREE } from "./data/trees/magic/holy.tree";

const trees = reduce(
  [
    BASIC_TREE,
    MOVEMENT_TREE,
    FLYING_TREE,
    ATTACK_TREE,
    ARMOR_TREE,
    BASIC_MAGIC_TREE,
    HOLY_TREE
  ],
  (nodes, tree) =>
    concat(
      nodes,
      map(tree.nodes, (n) => ({
        ...n,
        colors: tree.colors,
      }))
    ) as any,
  []
);

function App() {
  const [dragon, setDragon] = useState({ armor: 0, hp: 0 });
  const [tooltip, setTooltip] = useState({ show: false });
  const [info, setInfo] = useState({ show: false });
  const [rightPage, setRightPage] = useState("sheet");
  const [build, setBuild] = useState(buildData);

  const tooltipUpdated = (event) => {
    setTooltip(event);
  };

  const nodeSelectionUpdated = (event) => {
    const selectedNodes = filter(
      event.nodes,
      (node) => node.selected || node.committed
    );

    setDragon((dragon) => newDragonFromNodes(selectedNodes));
  };

  const handleItemSelected = (page) => {
    setRightPage(page);
  };
  const handleImportAttempted = (text) => {
    setBuild(JSON.parse(text));
  };
  const infoUpdated = (event) => {
    setInfo(event);
  };

  let rightMenuPage;

  if (rightPage === "sheet") {
    rightMenuPage = <CharacterSheet dragon={dragon}></CharacterSheet>;
  } else if (rightPage === "info") {
    rightMenuPage = <InfoPanel info={info}></InfoPanel>;
  } else if (rightPage === "code") {
    rightMenuPage = (
      <CodePanel
        dragon={dragon}
        importAttempted={handleImportAttempted}
      ></CodePanel>
    );
  }

  return (
    <div className="App">
      {/* <NodeTooltip tooltip={tooltip}></NodeTooltip> */}
      <div className="skill-panel">
        <PixiGraph
          trees={trees}
          buildData={build}
          nodeSelectionUpdated={nodeSelectionUpdated}
          tooltipUpdated={tooltipUpdated}
          infoUpdated={infoUpdated}
        ></PixiGraph>
        <div className="infoPanel"></div>
      </div>

      <SidebarRight itemSelected={handleItemSelected}>
        {rightMenuPage}
      </SidebarRight>
    </div>
  );
}

export default App;
