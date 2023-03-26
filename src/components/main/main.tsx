import { useCallback, useContext, useEffect, useRef } from "react";
import { Subject } from "rxjs";

import { BuildContext } from "../../providers/build/buildProvider";
import { LeftPanel } from "../panels/left/leftPanel";
import { RightPanel } from "../panels/right/rightPanel";
import { PointCounter } from "../misc/pointCounter";
import { PixiGraph } from "../pixi/pixi";
import { NodesContext } from "../../providers/nodes/nodesProvider";
import classNames from "classnames";
import { ThemeContext } from "../../providers/theme.provider";
import { stateContext } from "../../providers/state/stateProvider";
import { includes } from "lodash-es";

export interface IGraphEvent {
  event:
    | "nodeAcquisitionChanged"
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
  const { appMode, setAppMode, buildMode } = useContext(stateContext);
  const appModeRef = useRef(appMode);

  useEffect(() => {
    appModeRef.current = appMode;
  }, [appMode]);

  const handleKeyPress = useCallback((event) => {
    const forbiddenTags = ["INPUT", "SELECT", "TEXTAREA"];
    if (
      event.shiftKey &&
      event.key === "E" &&
      !includes(forbiddenTags, document.activeElement?.tagName)
    ) {
      setAppMode(appModeRef.current === "edit" ? buildMode : "edit");
    }
  }, []);

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

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
