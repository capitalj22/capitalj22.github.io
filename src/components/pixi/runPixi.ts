import * as d3 from "d3";
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Subject } from "rxjs";
import { find, map, each, times, isNumber } from "lodash-es";
import { SkillNode } from "../../entities/skilltree/node.entity";
import {
  isNodeAvailable,
  isNodeSelected,
  acquiredselectNodeAndReturnNewMeta,
  updateInfo,
} from "./utils/node.utils";
import { ABILITIES } from "../../entities/abilities/abilities";

export interface GNode<T> extends PIXI.Graphics {
  node: T;
}
export interface INode extends SkillNode {
  gfx: GNode<INode>;
}

export function runGraphPixi(
  container,
  nodesData,
  build = {},
  nodesUpdated$: Subject<any>,
  tooltipUpdated$: Subject<any>,
  infoUpdated$: Subject<any>,
  forceUpdated$: Subject<any>
) {
  let clickingOnNode = false;
  const nodes = map(nodesData, (node) => ({
    ...node,
  }));

  const links: any[] = [];
  let nodeMeta = {
    selected: {},
    acquired: {},
    available: {},
  };

  function newBuild() {
    nodeMeta = {
      selected: {},
      acquired: {},
      available: {},
    };

    each(nodes, (node) => {
      nodeMeta.selected[node.id] = build[node.id] === true;
      nodeMeta.acquired[node.id] = isNumber(build[node.id])
        ? build[node.id]
        : false;
    });

    each(nodes, (node) => {
      if (node.requires) {
        const target = find(nodes, { id: node.requires });
        nodeMeta.available[node.id] =
          !node.requires || isNodeSelected(target, nodeMeta);

        links.push({ source: node.id, target: target.id });
      } else {
        nodeMeta.available[node.id] = true;
      }
    });

    nodesUpdated$.next({
      nodes: map(nodes, (n) => ({
        ...n,
        selected: isNodeSelected(n, nodeMeta),
        acquired: nodeMeta.acquired[n.id],
      })),
    });
  }

  newBuild();
  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  container.innerHTML = "";

  function onPress(e, node: any) {
    const selection = isNodeSelected(node, nodeMeta);

    nodeMeta = acquiredselectNodeAndReturnNewMeta(
      node,
      nodes,
      nodeMeta,
      e.nativeEvent.shiftKey
    );

    nodesUpdated$.next({
      nodes: map(nodes, (n) => ({
        ...n,
        selected: isNodeSelected(n, nodeMeta),
        acquired: nodeMeta.acquired[n.id],
      })),
    });

    updateInfo(node, nodeMeta, nodes, infoUpdated$);

    const selectionChanged = isNodeSelected(node, nodeMeta) !== selection;

    redrawNodes(selectionChanged ? node.id : null);
    redrawLinks();

    setTimeout(() => {
      clickingOnNode = false;
    });
  }

  const app = new PIXI.Application({
    width,
    height,
    antialias: true,
    autoDensity: true,
    resizeTo: window,
    backgroundColor: "#0a0a0f",
    backgroundAlpha: 1,
    // resolution: 1,
  });

  (PIXI.loadWebFont as any).load(
    "https://fonts.googleapis.com/css2?family=Inter:wght@100;400;500;700&display=swap"
  );

  container.appendChild(app.view);

  // create viewport
  const viewport = new Viewport({
    screenWidth: width,
    screenHeight: height,
    worldWidth: width * 4,
    worldHeight: height * 4,
    passiveWheel: false,

    events: app.renderer.plugins.interaction,
  });

  app.stage.addChild(viewport);

  // activate plugins
  viewport
    .drag()
    .pinch()
    .wheel()
    .decelerate()
    .clampZoom({ minWidth: width / 4, minHeight: height / 4 });

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .strength((d) => (isNodeSelected(d.target, nodeMeta) ? 0.8 : 0.7))
        .id((d) => {
          return (d as any).id;
        })
        .distance((d) => (isNodeSelected(d.source, nodeMeta) ? 20 : 30))
    )
    .force("charge", d3.forceManyBody().strength(-600)) // This adds repulsion (if it's negative) between nodes.
    .force("center", d3.forceCenter(width / 4, height / 4))
    .force(
      "collision",
      d3
        .forceCollide()
        .radius((d) => (d as any).radius)
        .iterations(12)
    )
    .velocityDecay(0.6);

  forceUpdated$.subscribe({
    next: (forces) => {
      if (forces) {
        simulation
          .nodes(nodes)
          .force(
            "link",
            d3
              .forceLink(links)
              .strength((d) =>
                isNodeSelected(d.target, nodeMeta)
                  ? forces.f2 * 0.025
                  : forces.f2 * 0.01
              )
              .id((d) => {
                return (d as any).id;
              })
              .distance((d) =>
                isNodeSelected(d.source, nodeMeta)
                  ? forces.f1 + 5
                  : forces.f1 + 10
              )
          )
          .force("charge", d3.forceManyBody().strength(-(forces.f3 * 6))) // This adds repulsion (if it's negative) between nodes.
          .force("center", d3.forceCenter(width / 4, height / 4))
          .force(
            "collision",
            d3
              .forceCollide()
              .radius((d) => forces.f3)
              .iterations(12)
          )
          .velocityDecay(forces.f4 * 0.01);

        simulation.alpha(1).restart();
      }
    },
  });

  let visualLinks = new PIXI.Graphics();
  viewport.addChild(visualLinks);

  nodes.forEach((node) => {
    let initialColor = 0xd3d3d3;

    if (isNodeAvailable(node, nodeMeta)) {
      initialColor = 0xf2f2f2;
    }

    const boundPress = onPress.bind(node);
    let { name, description } = node;
    let relatedAbilities: any[] = [];
    if (node.providedAbilities) {
      const ability1 = find(ABILITIES, { id: node.providedAbilities[0].id });
      relatedAbilities.push(ability1);
    }

    let touching = false;

    node.gfx = new PIXI.Graphics();

    node.gfx
      // events for click
      .on("touchstart", (e) => {
        touching = true;
        updateInfo(node, nodeMeta, nodes, infoUpdated$);

        setTimeout(() => {
          if (touching) {
            onPress(e, node);
          }
        }, 100);
      });

    node.gfx
      // events for click
      .on("touchend", (e) => {
        touching = false;
      });

    node.gfx
      // events for click
      .on("click", (e) => boundPress(e, node));

    viewport.addChild(node.gfx);

    node.gfx.on("mouseover", (mouseData) => {
      tooltipUpdated$.next({
        show: true,
        x: mouseData.data.originalEvent.pageX,
        y: mouseData.data.originalEvent.pageY,
        node,
      });
      updateInfo(node, nodeMeta, nodes, infoUpdated$);
    });

    const text = new PIXI.Text(name, {
      fontFamily: "Inter",
      fontSize: 12,
      fill: "#fff",
      align: "center",
    });
    text.anchor.set(0.5, -0.75);
    text.resolution = 12;
    node.gfx.addChild(text);
  });

  redrawNodes();

  function toPixiColor(color): number {
    if (typeof color === "string") {
      return parseInt(color.replace(`#`, ""), 16);
    } else return 0;
  }

  function getNodeColor(node) {
    if (!isNodeAvailable(node, nodeMeta)) {
      return toPixiColor(node.colors.unavailable);
    } else if (isNodeSelected(node, nodeMeta)) {
      return toPixiColor(node.colors.selected);
    } else {
      return toPixiColor(node.colors.inactive);
    }
  }

  function redrawLinks() {
    for (let i = visualLinks.children.length - 1; i >= 0; i--) {
      visualLinks.children[i].destroy();
    }

    visualLinks.clear();
    visualLinks.removeChildren();
    visualLinks.alpha = 0.8;

    links.forEach((link) => {
      let { source, target, number } = link;
      let lineColor = 0x9b9ea3;
      let lineWidth = 1;

      if (target.id) {
        lineColor = getNodeColor(source);

        lineWidth =
          isNodeSelected(target, nodeMeta) && isNodeSelected(source, nodeMeta)
            ? 2
            : 0.5;
      }
      visualLinks.lineStyle(lineWidth, lineColor);
      visualLinks.moveTo(source.x, source.y);
      visualLinks.lineTo(target.x, target.y);
    });

    visualLinks.endFill();
  }

  function redrawNodes(targetNodeId?: string) {
    nodes.forEach((node: INode) => {
      const selected = isNodeSelected(node, nodeMeta);
      const available = isNodeAvailable(node, nodeMeta);
      node.gfx.clear();
      let cost = node.cost || 1;

      node.gfx.cursor = isNodeAvailable(node, nodeMeta) ? "pointer" : "default";

      if (!targetNodeId || node.id !== targetNodeId || node.levels) {
        if (node.levels) {
          const width = node.levels * 14;
          const levelsAcquired = nodeMeta.acquired[node.id];

          node.gfx.clear();
          node.gfx.beginFill(getNodeColor(node));
          node.gfx.drawShape(new PIXI.RoundedRectangle(-12, -6, width, 16, 4));
          node.gfx.endFill();

          node.gfx.beginFill(0xffffff);

          times(levelsAcquired, (i) => {
            node.gfx.drawCircle(-4 + i * 12, 2, 4);
          });
          node.gfx.endFill();

          node.gfx.hitArea = new PIXI.Rectangle(-10, -6, width, 16);
        } else {
          let size = selected ? cost * 2 + 6 : cost * 2 + 2;
          node.gfx.beginFill(getNodeColor(node));

          node.gfx.drawCircle(0, 0, size);

          node.gfx.hitArea = new PIXI.Circle(0, 0, size + 10);
          node.gfx.endFill();
        }
      } else if (node.id === targetNodeId) {
        const node = find(nodes, { id: targetNodeId });
        let targetSize = selected ? cost * 2 + 6 : cost * 2 + 2;
        let size = !selected ? cost * 2 + 6 : cost * 2 + 2;
        let iteration = 0;
        const animation = setInterval(() => {
          iteration++;
          if (!selected) {
            size -= iteration * 0.4;
          } else {
            size += iteration * 0.4;
          }
          node.gfx.clear();
          node.gfx.beginFill(getNodeColor(node));

          node.gfx.drawCircle(0, 0, size);

          node.gfx.endFill();

          if (selected) {
            if (size >= targetSize) {
              clearInterval(animation);
            }
          } else if (size <= targetSize) {
            clearInterval(animation);
          }
        }, 5);
      }

      node.gfx.interactive = true;
    });
  }

  const ticked = () => {
    nodes.forEach((node) => {
      let { x, y, gfx } = node;
      gfx.position = new PIXI.Point(x, y);
    });

    redrawLinks();
  };

  simulation.on("tick", ticked);

  return {
    destroy: () => {
      simulation.stop();
      nodes.forEach((node) => {
        node.gfx.clear();
      });
      visualLinks.clear();
    },
  };
}
