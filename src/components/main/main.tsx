import { useContext } from "react";
import { Subject } from "rxjs";

import { BuildContext } from "../../providers/build/buildProvider";
import { LeftPanel } from "../panels/left/leftPanel";
import { RightPanel } from "../panels/right/rightPanel";
import { PointCounter } from "../misc/pointCounter";
import { PixiGraph } from "../pixi/pixi";
import { NodesContext } from "../../providers/nodes/nodesProvider";
import classNames from "classnames";
import { ThemeContext } from "../../providers/theme.provider";

export interface IGraphEvent {
  event:
    | "forcesUpdated"
    | "modeChanged"
    | "nodeAdded"
    | "nodeDeleted"
    | "nodeEdited"
    | "themeChanged"
    | "nodeSelectionChanged"
    | "nodesChanged";
  data: any;
}

const graphEvents$ = new Subject<IGraphEvent>();

export function Main() {
  const { setSelectedNodeId } = useContext(NodesContext);
  const { build } = useContext(BuildContext);
  const { theme } = useContext(ThemeContext);

  const infoUpdated = (event) => {
    setSelectedNodeId(event.node?.id);
  };

  return (
    <div
      className={classNames({
        App: true,
        light: theme === "light",
      })}
    >
      <div className="appLeft">
        <LeftPanel graphEvents$={graphEvents$}></LeftPanel>
        <PointCounter pointsSpent={build.pointsInvested}></PointCounter>
      </div>
      <div className="appRight">
        <RightPanel></RightPanel>
      </div>
      <div className="skill-panel">
        <PixiGraph
          infoUpdated={infoUpdated}
          graphEvents={graphEvents$}
        ></PixiGraph>
      </div>
    </div>
  );
}
