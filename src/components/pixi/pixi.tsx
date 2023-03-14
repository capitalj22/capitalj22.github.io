import React from "react";
import { runGraphPixi } from "./runPixi";
import styles from "./pixi.module.css";
import { Subject } from "rxjs";

export function PixiGraph({
  trees,
  buildData,
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
  
  React.useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runGraphPixi(
        containerRef.current,
        trees,
        buildData,
        nodesUpdated$,
        tooltipUpdated$,
        infoUpdated$
      );
      destroyFn = destroy;
    }

    return destroyFn;
  }, [trees, buildData]);

  return <div ref={containerRef} className={styles.container} />;
}
