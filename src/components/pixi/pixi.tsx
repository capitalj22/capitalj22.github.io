import { useContext, useEffect, useRef, useState } from "react";
import { runGraphPixi } from "./runPixi";
import styles from "./pixi.module.css";
import { Subject } from "rxjs";
import { BuildContext } from "../../providers/build/buildProvider";
import { filter } from "lodash-es";
import { newDragonFromNodes } from "../../entities/actor/dragon.entity";
import { AbilitiesContext } from "../../providers/abilities/abilitiesProvider";
import { NodesContext } from "../../providers/nodes/nodesProvider";
import { ThemeContext } from "../../providers/theme.provider";

export function PixiGraph({ infoUpdated, graphEvents }) {
  const containerRef = useRef(null);
  const { abilities } = useContext(AbilitiesContext);
  const { nodes, setNodeMeta } = useContext(NodesContext);
  const nodesUpdated$ = new Subject();
  const infoUpdated$ = new Subject();
  const { savedBuild, setBuild } = useContext(BuildContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    graphEvents.next({ event: "themeChanged", data: theme });
  }, [theme]);

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

        setBuild({
          type: "set",
          build: newDragonFromNodes(selectedNodes, abilities),
        });

        setNodeMeta(data.nodeMeta);
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
  }, [savedBuild]);

  return <div ref={containerRef} className={styles.container} />;
}
