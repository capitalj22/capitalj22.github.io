import { useState } from "react";
import "./App.scss";
import CharacterSheet from "./components/characterSheet/characterSheet";
import { NECRO_TREE } from "./data/necromancy.data";
import { PixiGraph } from "./components/pixi/pixi";
import { filter, reduce, concat, map } from "lodash-es";
import { ATTACK_TREE } from "./data/attack.data";
import { newDragonFromNodes } from "./entities/actor/dragon.entity";
import { BASIC_TREE } from "./data/basic.data";
import { InfoPanel } from "./components/infoPanel/infoPanel";
import { TANK_TREE } from "./data/tank.data";
import { SidebarRight } from "./components/layout/sidebarRight";
import build from "./data/example-builds/build.json";

const trees = reduce(
  [BASIC_TREE, NECRO_TREE, ATTACK_TREE, TANK_TREE],
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
  const infoUpdated = (event) => {
    setInfo(event);
  };

  let rightMenuPage;

  if (rightPage === "sheet") {
    rightMenuPage = <CharacterSheet dragon={dragon}></CharacterSheet>;
  } else if (rightPage === "info") {
    rightMenuPage = <InfoPanel info={info}></InfoPanel>;
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
