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
  const { appMode, setAppMode, buildMode, setBuildMode } =
    useContext(stateContext);
  const appModeRef = useRef(appMode);
  const buildModeRef = useRef(buildMode);

  useEffect(() => {
    appModeRef.current = appMode;
  }, [appMode]);

  useEffect(() => {
    buildModeRef.current = buildMode;
  }, [buildMode]);

  const handleKeyPress = useCallback((event) => {
    const forbiddenTags = ["INPUT", "SELECT", "TEXTAREA"];
    if (
      event.shiftKey &&
      !includes(forbiddenTags, document.activeElement?.tagName)
    ) {
      if (event.key === "E") {
        setAppMode(appModeRef.current === "edit" ? buildMode : "edit");
      } else if (event.key === "F") {
        if (buildModeRef.current === "build-slow") {
          setAppMode("build-fast");
          setBuildMode("build-fast");
        } else {
          setAppMode("build-slow");
          setBuildMode("build-slow");
        }
      }
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
