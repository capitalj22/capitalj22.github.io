import { useContext, useEffect, useRef } from "react";
import { runGraphPixi } from "./runPixi";
import styles from "./pixi.module.css";
import { Subject } from "rxjs";
import { BuildContext } from "../../providers/build/buildProvider";
import { filter, find } from "lodash-es";
import { newDragonFromNodes } from "../../entities/actor/dragon.entity";
import { AbilitiesContext } from "../../providers/abilities/abilitiesProvider";
import { NodesContext } from "../../providers/nodes/nodesProvider";
import { ThemeContext } from "../../providers/theme.provider";
import { stateContext } from "../../providers/state/stateProvider";

export function PixiGraph({ infoUpdated, graphEvents }) {
  const containerRef = useRef(null);
  const { abilities, globalParams } = useContext(AbilitiesContext);
  const { nodes, setNodeMeta } = useContext(NodesContext);
  const nodesUpdated$ = new Subject();
  const infoUpdated$ = new Subject();
  const {
    savedBuild,
    setBuild,
    selectedUnit,
    defaultUnits,
    setDefaultUnits,
    customUnits,
    setCustomUnits,
  } = useContext(BuildContext);
  const { theme } = useContext(ThemeContext);
  const { appMode } = useContext(stateContext);
  const abilitiesRef = useRef(abilities);
  const globalParamsref = useRef(globalParams);

  useEffect(() => {
    graphEvents.next({ event: "modeChanged", data: { mode: appMode } });
  }, [appMode]);

  useEffect(() => {
    abilitiesRef.current = abilities;
  }, [abilities]);

  useEffect(() => {
    globalParamsref.current = globalParams;
  }, [globalParams]);

  useEffect(() => {
    graphEvents.next({ event: "themeChanged", data: theme });
  }, [theme]);

  useEffect(() => {
    graphEvents.next({ event: "buildChanged", data: { build: savedBuild } });
  }, [savedBuild]);

  useEffect(() => {
    let destroyFn;

    graphEvents.subscribe({
      next: (e) => {
        // console.log("graph component", e);
      },
    });

    nodesUpdated$.subscribe({
      next: (data: any) => {
        const selectedNodes = filter(
          data.nodes,
          (node) => node.selected || node.acquired
        );

        const build = newDragonFromNodes(
          selectedNodes,
          abilitiesRef.current,
          globalParamsref.current
        );

        setBuild({
          type: "set",
          build,
        });

        if (selectedUnit) {
          if (selectedUnit.type === "custom") {
            const unit = find(customUnits, { id: selectedUnit.unit.id });

            setCustomUnits({
              type: "update",
              unit: { ...unit, build: build.exportableBuild },
            });
          } else {
            const unit = find(defaultUnits, { id: selectedUnit.unit.id });

            setDefaultUnits({
              type: "update",
              unit: { ...unit, build: build.exportableBuild },
            });
          }
        }

        if (data.nodeMeta) {
          setNodeMeta(data.nodeMeta);
        }
      },
    });

    infoUpdated$.subscribe({
      next: (data) => {
        infoUpdated(data);
      },
    });

    if (containerRef.current) {
      const { destroy } = runGraphPixi(
        containerRef.current,
        nodes,
        savedBuild,
        nodesUpdated$,
        infoUpdated$,
        graphEvents,
        theme
      );
      destroyFn = destroy;
    }

    infoUpdated({});
    return destroyFn;
  }, []);

  return <div ref={containerRef} className={styles.container} />;
}
