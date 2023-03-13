import { useState } from "react";
import "./App.scss";
import CharacterSheet from "./components/characterSheet/characterSheet";
import { NECRO_TREE } from "./data/necromancy.data";
import React from "react";
import { PixiGraph } from "./components/pixi/pixi";
import { filter, reduce, concat, map } from "lodash-es";
import { ATTACK_TREE } from "./data/attack.data";
import { newDragonFromNodes } from "./entities/actor/dragon.entity";
import { BASIC_TREE } from "./data/basic.data";
import { NodeTooltip } from "./components/nodeTooltip/nodeTooltip";
import { InfoPanel } from "./components/infoPanel/infoPanel";
import { TANK_TREE } from "./data/tank.data";

const trees = reduce(
  [BASIC_TREE, NECRO_TREE, ATTACK_TREE, TANK_TREE],
  (nodes, tree) =>
    concat(
      nodes,
      map(tree.nodes, (n) => ({
        ...n,
        colors: tree.colors,
      }))
    ),
  []
);

function App() {
  const [dragon, setDragon] = useState({ armor: 0, hp: 0 });
  const [tooltip, setTooltip] = useState({ show: false });
  const [info, setInfo] = useState({ show: false });
  //
  // const nodeHoverTooltip = React.useCallback((node) => {
  //   return `<div>
  //     <b>${node.name}</b>
  //     <p>${node.description}</p>
  //     <div>
  //       ${node.relatedAbilities[0].description}
  //     </div>
  //   </div>`;
  // }, []);

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

  const infoUpdated = (event) => {
    setInfo(event);
  };
  return (
    <div className="App">
      {/* <NodeTooltip tooltip={tooltip}></NodeTooltip> */}
      <div className="skill-panel">
        <PixiGraph
          trees={trees}
          nodeSelectionUpdated={nodeSelectionUpdated}
          tooltipUpdated={tooltipUpdated}
          infoUpdated={infoUpdated}
        ></PixiGraph>
        <InfoPanel info={info}></InfoPanel>
      </div>

      {/* <SkillTree nodesUpdated={handleSkillsUpdated}></SkillTree> */}
      <div className="card">
        <CharacterSheet dragon={dragon}></CharacterSheet>
      </div>
    </div>
  );
}

export default App;
