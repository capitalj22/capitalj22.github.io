import React, { useEffect, useState } from "react";
import { runGraphPixi } from "./runPixi";
import styles from "./pixi.module.css";
import { Subject } from "rxjs";
const forceUpdated$ = new Subject();

export function PixiGraph({
  trees,
  buildData,
  force,
  nodeSelectionUpdated,
  tooltipUpdated,
  infoUpdated,
}) {
  const containerRef = React.useRef(null);
  const nodesUpdated$ = new Subject();
  const tooltipUpdated$ = new Subject();
  const infoUpdated$ = new Subject();

  nodesUpdated$.subscribe({
    next: (data) => {
      nodeSelectionUpdated(data);
    },
  });
  tooltipUpdated$.subscribe({
    next: (data) => {
      tooltipUpdated(data);
    },
  });
  infoUpdated$.subscribe({
    next: (data) => {
      infoUpdated(data);
    },
  });

  useEffect(() => {
    forceUpdated$.next(force);
  }, [force]);

  React.useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runGraphPixi(
        containerRef.current,
        trees,
        buildData,
        nodesUpdated$,
        tooltipUpdated$,
        infoUpdated$,
        forceUpdated$
      );
      destroyFn = destroy;
    }

    return destroyFn;
  }, [trees, buildData]);

  return <div ref={containerRef} className={styles.container} />;
}
