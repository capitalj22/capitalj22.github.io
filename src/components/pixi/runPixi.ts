import * as d3 from "d3";
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Subject } from "rxjs";
import { find, map, each, times, isNumber, update } from "lodash-es";
import { SkillNode } from "../../entities/skilltree/node.entity";
import {
  isNodeAvailable,
  isNodeSelected,
  acquiredselectNodeAndReturnNewMeta,
  updateInfo,
  getNodeColor,
} from "./utils/node.utils";
import { ABILITIES } from "../../entities/abilities/abilities";
import { IGraphEvent } from "../../App";
import { SimulationLinkDatum, SimulationNodeDatum } from "d3";

export interface GNode<T> extends PIXI.Graphics {
  node?: T;
}
export interface INode extends SkillNode {
  gfx: GNode<INode>;
  x: number;
  y: number;
  target: GNode<INode>;
  source: GNode<INode>;
}

export type d3Node = INode & SimulationNodeDatum;

(PIXI.loadWebFont as any).load(
  "https://fonts.googleapis.com/css2?family=Inter:wght@100;400;500;700&display=swap"
);

export function runGraphPixi(
  container,
  nodesData,
  build = {},
  nodesUpdated$: Subject<any>,
  tooltipUpdated$: Subject<any>,
  infoUpdated$: Subject<any>,
  graphEvents: Subject<IGraphEvent>
) {
  graphEvents.subscribe({
    next: (e) => {
      switch (e.event) {
        case "forcesUpdated":
          updateForces(e.data.forces);
          break;
        case "modeChanged":
          changeMode(e.data.mode);
          break;
        case "nodeAdded":
          addNode(e.data.node);
          break;
      }
    },
  });

  let app: PIXI.Application;
  let nodes: INode[];
  let nodeMeta = {
    selected: {},
    acquired: {},
    available: {},
  };
  let simulation = d3.forceSimulation();
  let visualLinks;
  let links;
  let width, height;
  let viewport;
  let mode = "build";

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
          !node.requires || isNodeSelected(target as INode, nodeMeta);

        links.push({ source: node.id, target: (target as INode).id });
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

  function addNode(newNode: INode) {
    let node = {
      ...newNode,
      name: "test",
      colors: find(nodes, { id: newNode.requires })?.colors,
    };

    let initialColor = 0xd3d3d3;

    if (isNodeAvailable(node, nodeMeta)) {
      initialColor = 0xf2f2f2;
    }

    const boundPress = onPress.bind(node);
    let { name } = node;
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
      if (mode === "build") {
        updateInfo(node, nodeMeta, nodes, infoUpdated$);
      }
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

    nodes = [...nodes, node];
    links.push({ source: node, target: find(nodes, { id: node.requires }) });
    redrawNodes();
    redrawLinks();
    updateForces({ f1: 25, f2: 25, f3: 25, f4: 25 });
  }

  function changeMode(newMode: string) {
    let oldMode = mode;

    mode = newMode;
    if (oldMode !== newMode) {
      redrawNodes();
      redrawLinks();
    }
  }

  function onPress(e, node: any) {
    if (mode === "build") {
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
    } else if (mode === "edit") {
      updateInfo(node, nodeMeta, nodes, infoUpdated$);
    }
  }

  function updateForces(forces) {
    if (forces) {
      simulation
        .nodes(nodes as d3Node[])
        .force(
          "link",
          d3
            .forceLink(links)
            .strength((d) =>
              isNodeSelected(d.target as INode, nodeMeta)
                ? forces.f2 * 0.025
                : forces.f2 * 0.01
            )
            .id((d) => {
              return (d as any).id;
            })
            .distance((d) =>
              isNodeSelected(d.source as INode, nodeMeta)
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
    redrawLinks();
    redrawNodes();
  }

  function redrawLinks() {
    for (let i = visualLinks.children.length - 1; i >= 0; i--) {
      visualLinks.children[i].destroy();
    }

    visualLinks.clear();
    visualLinks.removeChildren();
    visualLinks.alpha = 0.8;

    links.forEach((link) => {
      let { source, target } = link;
      let lineColor = 0x9b9ea3;
      let lineWidth = 1;

      if (target.id) {
        lineColor = getNodeColor(
          source,
          nodeMeta,
          mode === "edit" ? "selected" : null
        );

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

      if (mode === "build") {
        node.gfx.cursor = isNodeAvailable(node, nodeMeta)
          ? "pointer"
          : "default";
      } else {
        node.gfx.cursor = "pointer";
      }

      if (!targetNodeId || node.id !== targetNodeId || node.levels) {
        if (node.levels) {
          const width = node.levels * 14;
          const levelsAcquired = nodeMeta.acquired[node.id];

          node.gfx.clear();
          node.gfx.beginFill(
            getNodeColor(node, nodeMeta, mode === "edit" ? "selected" : null)
          );
          node.gfx.drawShape(new PIXI.RoundedRectangle(-12, -6, width, 16, 4));
          node.gfx.endFill();

          node.gfx.beginFill(0xffffff);

          times(levelsAcquired, (i) => {
            node.gfx.drawCircle(-4 + i * 12, 2, 4);
          });
          node.gfx.endFill();

          node.gfx.hitArea = new PIXI.Rectangle(-10, -6, width, 16);
        } else {
          let size;
          if (mode === "edit") {
            size = 8;
          } else {
            size = selected ? cost * 2 + 6 : cost * 2 + 2;
          }

          node.gfx.beginFill(
            getNodeColor(node, nodeMeta, mode === "edit" ? "selected" : null)
          );

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

          node?.gfx.clear();
          node?.gfx.beginFill(
            getNodeColor(node, nodeMeta, mode === "edit" ? "selected" : null)
          );

          node?.gfx.drawCircle(0, 0, size);

          node?.gfx.endFill();

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

  function initializeSim() {
    nodes = map(nodesData, (node) => ({
      ...node,
    }));

    links = [];

    newBuild();
    const containerRect = container.getBoundingClientRect();
    height = containerRect.height;
    width = containerRect.width;

    container.innerHTML = "";

    app = new PIXI.Application({
      width,
      height,
      antialias: true,
      autoDensity: true,
      resizeTo: window,
      backgroundColor: "#0a0a0f",
      backgroundAlpha: 1,
      // resolution: 1,
    });

    container.appendChild(app.view);

    // create viewport
    viewport = new Viewport({
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

    console.log(links);

    simulation = d3
      .forceSimulation(nodes as SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(links)
          .strength((d) =>
            isNodeSelected(d.target as INode, nodeMeta) ? 0.8 : 0.7
          )
          .id((d) => {
            return (d as any).id;
          })
          .distance((d) =>
            isNodeSelected(d.source as INode, nodeMeta) ? 20 : 30
          )
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

    visualLinks = new PIXI.Graphics();

    viewport.addChild(visualLinks);

    nodes.forEach((node) => {
      let initialColor = 0xd3d3d3;

      if (isNodeAvailable(node, nodeMeta)) {
        initialColor = 0xf2f2f2;
      }

      const boundPress = onPress.bind(node);
      let { name } = node;
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
        if (mode === "build") {
          updateInfo(node, nodeMeta, nodes, infoUpdated$);
        }
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

    const ticked = () => {
      nodes.forEach((node) => {
        let { x, y, gfx } = node;
        gfx.position = new PIXI.Point(x, y);
      });

      redrawLinks();
    };

    simulation.on("tick", ticked);
  }

  initializeSim();

  return {
    destroy: () => {
      simulation.stop();
      nodes.forEach((node) => {
        node.gfx.clear();
      });
      visualLinks.clear();
      // graphEvents.unsubscribe();
    },
  };
}
