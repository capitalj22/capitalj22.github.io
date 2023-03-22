import React, { useContext, useEffect, useState } from "react";
import { runGraphPixi } from "./runPixi";
import styles from "./pixi.module.css";
import { Subject } from "rxjs";
import { BuildContext } from "../../providers/build/buildProvider";
import { filter } from "lodash-es";
import { newDragonFromNodes } from "../../entities/actor/dragon.entity";
import { AbilitiesContext } from "../../providers/abilities/abilitiesProvider";

export function PixiGraph({ trees, infoUpdated, graphEvents }) {
  const containerRef = React.useRef(null);
  const { abilities } = useContext(AbilitiesContext);
  const nodesUpdated$ = new Subject();
  const infoUpdated$ = new Subject();
  const { build, setBuild } = useContext(BuildContext);

  useEffect(() => {}, []);

  React.useEffect(() => {
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

        console.log(selectedNodes);

        setBuild({
          type: "set",
          build: newDragonFromNodes(selectedNodes, abilities),
        });

        console.log("build");
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
        trees,
        build,
        nodesUpdated$,
        infoUpdated$,
        graphEvents
      );
      destroyFn = destroy;
    }

    // nodeSelectionUpdated({})
    infoUpdated({});
    return destroyFn;
  }, []);

  return <div ref={containerRef} className={styles.container} />;
}
