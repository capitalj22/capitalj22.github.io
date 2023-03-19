import React, { useEffect, useState } from "react";
import { runGraphPixi } from "./runPixi";
import styles from "./pixi.module.css";
import { Subject } from "rxjs";

export function PixiGraph({
  trees,
  buildData,
  nodeSelectionUpdated,
  infoUpdated,
  graphEvents,
}) {
  const containerRef = React.useRef(null);
  const nodesUpdated$ = new Subject();
  const infoUpdated$ = new Subject();

  useEffect(() => {
    graphEvents.subscribe({
      next: (e) => {
        // console.log("graph component", e);
      },
    });

    nodesUpdated$.subscribe({
      next: (data) => {
        nodeSelectionUpdated(data);
      },
    });

    infoUpdated$.subscribe({
      next: (data) => {
        infoUpdated(data);
      },
    });
  }, []);

  React.useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runGraphPixi(
        containerRef.current,
        trees,
        buildData,
        nodesUpdated$,
        infoUpdated$,
        graphEvents
      );
      destroyFn = destroy;
    }

    return destroyFn;
  }, [buildData]);

  return <div ref={containerRef} className={styles.container} />;
}
