import * as d3 from "d3";
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Subject } from "rxjs";
import { find, map, each, times, isNumber, filter, some } from "lodash-es";
import { SkillNode } from "../../entities/skilltree/node.entity";
import {
  isNodeAvailable,
  isNodeSelected,
  acquiredselectNodeAndReturnNewMeta,
  updateInfo,
  getNodeColor,
  updateNodes,
  toPixiColor,
} from "./utils/node.utils";
import { SimulationNodeDatum } from "d3";
import { IGraphEvent } from "../main/main";

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

export function runGraphPixi(
  container,
  nodesData,
  build = {},
  nodesUpdated$: Subject<any>,
  infoUpdated$: Subject<any>,
  graphEvents: Subject<IGraphEvent>,
  theme
) {
  let graphSub = graphEvents.subscribe({
    next: (e) => {
      switch (e.event) {
        case "forcesUpdated":
          forces = e.data.forces;
          updateForces();
          break;
        case "modeChanged":
          changeMode(e.data.mode);
          break;
        case "nodeAdded":
          addNode(e.data.node);
          break;
        case "nodeDeleted":
          deleteNode(e.data.id);
          break;
        case "nodeEdited":
          editNode(e.data.id, e.data.node);
          break;
        case "themeChanged":
          setTheme(e.data);
      }
    },
  });

  let bgColor = "#1d1b21";
  let textColor = "#ddd";
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
  let viewport: Viewport;
  let mode = "build";
  let currentlyEditing;

  let forces = {
    f1: 10,
    f2: 44,
    f3: 40,
    f4: 10,
  };

  function setTheme(theme: string) {
    if (theme === "light") {
      bgColor = "#ffffff";
      textColor = "#666666";
    } else {
      bgColor = "#1d1b21";
      textColor = "#dddddd";
    }
    (app.renderer as any).backgroundColor = toPixiColor(bgColor);
    redrawNodes();
  }
  function addNodeLabel(gfx, name) {
    if (gfx.children.length > 0) {
      gfx.children[0].destroy();
    }
    const text = new PIXI.Text(name, {
      fontFamily: "Inter",
      fontSize: 14,
      fill: textColor,
      align: "center",
    });
    text.anchor.set(0.5, -0.75);
    text.resolution = 12;
    gfx.addChild(text);
  }

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

    recreateLinks();

    nodesUpdated$.next({
      nodes: map(nodes, (n) => ({
        ...n,
        selected: isNodeSelected(n, nodeMeta),
        acquired: nodeMeta.acquired[n.id],
      })),
    });
  }

  function deleteNode(id: string) {
    if (id === "basic") {
      return;
    }
    const node = find(nodes, { id });

    if (node) {
      node?.gfx.removeChildren();
      node?.gfx.clear();
      nodes = map(
        filter(nodes, (n) => n.id !== id),
        (n) => {
          let requires = n.requires;

          if (some(n.requires, { id: node?.id })) {
            requires = node?.requires;
          }

          return {
            ...n,
            requires: requires,
          };
        }
      );

      const newNode = find(nodes, {
        id: node?.requires && node?.requires[0].id,
      });

      recreateLinks();

      currentlyEditing = newNode?.id;
      updateInfo(newNode, nodeMeta, nodes, infoUpdated$);
      redrawNodes();
      updateForces();
      redrawLinks();
      updateNodes(nodes, graphEvents);
    }
  }

  function recreateLinks() {
    links = [];
    each(nodes, (n) => {
      if (n?.requires?.length) {
        let available = true;

        each(n.requires, (requires) => {
          const target = find(nodes, { id: requires?.id });
          available = available && isNodeSelected(target as INode, nodeMeta);

          links.push({ source: n, target: target as INode });
        });

        nodeMeta.available[n.id] = available;
      } else {
        nodeMeta.available[n.id] = true;
      }
    });
  }

  function editNode(nodeId, newNode) {
    let node = find(nodes, { id: nodeId }) as INode;
    let oldRequires = node.requires;

    node.name = newNode.name;
    node.id = newNode.id;
    node.description = newNode.description;
    node.levels = newNode.levels;
    node.cost = newNode.cost;
    node.levelCost = newNode.levelCost;
    node.providedStats = newNode.providedStats;
    node.providedAbilities = newNode.providedAbilities;
    node.colors = newNode.colors;
    node.requires = newNode.requires;

    if (oldRequires !== newNode.requires) {
      recreateLinks();
    }

    if (
      nodeMeta.acquired[nodeId] &&
      nodeMeta.acquired[nodeId] > newNode.levels
    ) {
      nodeMeta.acquired[nodeId] = newNode.levels;
    }

    node?.gfx.removeChildren();
    const text = new PIXI.Text(newNode.name, {
      fontFamily: "Inter",
      fontSize: 12,
      fontWeight: "500",
      fill: "#fff",
      align: "center",
    });
    text.anchor.set(0.5, -0.75);
    text.resolution = 12;
    node?.gfx.addChild(text);

    nodes = map(nodes, (n) => {
      if (n.id === nodeId) {
        return node;
      } else {
        let fixedNode = n;

        if (n.requires === nodeId) {
          fixedNode.requires = [{ id: node.id, levels: 1 }];
        }

        return fixedNode;
      }
    });

    redrawNodes();
    redrawLinks();
    updateForces();
    updateInfo(node, nodeMeta, nodes, infoUpdated$);
    nodesUpdated$.next({
      nodes: map(nodes, (n) => ({
        ...n,
        selected: isNodeSelected(n, nodeMeta),
        acquired: nodeMeta.acquired[n.id],
      })),
      nodeMeta,
    });

    updateNodes(nodes, graphEvents);
  }

  function addNode(newNode: INode) {
    let node = { ...newNode };

    if (!node.colors) {
      node.colors = {};
    }
    addNodeGfx(node);

    currentlyEditing = node.id;
    nodes = [...nodes, node];
    each(node.requires, (requires) => {
      links.push({ source: node, target: find(nodes, { id: requires.id }) });
    });
    redrawNodes();
    redrawLinks();
    updateForces();
    updateNodes(nodes, graphEvents);
    updateInfo(node, nodeMeta, nodes, infoUpdated$);
  }

  function changeMode(newMode: string) {
    let oldMode = mode;

    mode = newMode;

    if (oldMode !== newMode) {
      if (mode === "build") {
        // currentlyEditing = null;
      }
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
        nodeMeta,
      });

      updateInfo(node, nodeMeta, nodes, infoUpdated$);

      const selectionChanged = isNodeSelected(node, nodeMeta) !== selection;
      nudge();
      redrawNodes(selectionChanged ? node.id : null);
      redrawLinks();
    } else if (mode === "edit") {
      currentlyEditing = node.id;
      updateInfo(node, nodeMeta, nodes, infoUpdated$);
      redrawNodes();
    }
  }

  function nudge() {
    simulation.velocityDecay(0.8).alpha(0.05).restart();
  }

  function updateForces() {
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
            .distance((d: any) => {
              if (d.source.levels || d.target.levels) {
                return isNodeSelected(d.source as INode, nodeMeta)
                  ? forces.f1 + 12
                  : forces.f1 + 17;
              } else {
                return isNodeSelected(d.source as INode, nodeMeta)
                  ? forces.f1 + 5
                  : forces.f1 + 10;
              }
            })
        )
        .force("charge", d3.forceManyBody().strength(-(forces.f3 * 6))) // This adds repulsion (if it's negative) between nodes.
        .force("center", d3.forceCenter(width / 4, height / 4))
        .force(
          "collision",
          d3
            .forceCollide()
            .radius((d) => forces.f3)
            .iterations(4)
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
      let lineColor = 0x444444;
      let lineWidth = 2;
      let selected = source && isNodeSelected(source, nodeMeta);

      if (target.id && source) {
        if (selected || mode === "edit") {
          lineColor = getNodeColor(source, nodeMeta, "selected");
        } else {
          lineColor = 0x9b9ea3;
        }

        lineWidth =
          isNodeSelected(target, nodeMeta) && isNodeSelected(source, nodeMeta)
            ? 2
            : 1;
      }
      visualLinks.lineStyle(lineWidth, lineColor, selected ? 1 : 0.2);
      visualLinks.moveTo(source.x, source.y);
      visualLinks.lineTo(target.x, target.y);
    });

    visualLinks.endFill();
  }

  function redrawNodes(targetNodeId?: string) {
    nodes.forEach((node: INode) => {
      const isEditing = currentlyEditing === node.id;

      const selected = isNodeSelected(node, nodeMeta);
      const available = isNodeAvailable(node, nodeMeta);
      node.gfx.clear();
      let cost = node.cost || 1;

      if (mode === "build") {
        node.gfx.cursor = available ? "pointer" : "default";
      } else {
        node.gfx.cursor = "pointer";
      }

      if (
        !targetNodeId ||
        node.id !== targetNodeId ||
        node.levels ||
        !selected
      ) {
        if (node.levels && node.levels > 1) {
          const width = 4 + node.levels * 15;
          const levelsAcquired = nodeMeta.acquired[node.id];

          if (isEditing && mode === "edit") {
            node.gfx.beginFill(toPixiColor(textColor));
            node.gfx.drawShape(
              new PIXI.RoundedRectangle(-14, -8, width + 4, 20, 6)
            );
            node.gfx.endFill();
          }

          // node.gfx.beginFill(
          //   getNodeColor(node, nodeMeta, mode === "edit" ? "selected" : null)
          // );
          let lowerBound = -(width / 2);
          node.gfx.lineStyle(2, getNodeColor(node, nodeMeta));
          node.gfx.beginFill(toPixiColor(bgColor));
          node.gfx.drawShape(
            new PIXI.RoundedRectangle(lowerBound, -6, width, 16, 4)
          );
          node.gfx.endFill();

          node.gfx.beginFill(toPixiColor(textColor));
          node.gfx.lineStyle();

          times(levelsAcquired, (i) => {
            node.gfx.drawCircle(lowerBound + 11 + i * 14, 2, 4);
          });
          node.gfx.endFill();

          node.gfx.hitArea = new PIXI.RoundedRectangle(
            lowerBound,
            -6,
            width,
            16,
            4
          );
        } else {
          let size;
          if (mode === "edit") {
            size = 8;
          } else {
            size = selected ? cost * 2 + 6 : cost * 2 + 2;
          }

          if (isEditing && mode === "edit") {
            node.gfx.beginFill(0xffffff);
            node.gfx.drawCircle(0, 0, size + 2);
            node.gfx.endFill();

            node.gfx.beginFill(getNodeColor(node, nodeMeta, "selected"));

            node.gfx.drawCircle(0, 0, size);

            node.gfx.endFill();
          } else if (selected) {
            node.gfx.beginFill(getNodeColor(node, nodeMeta));

            node.gfx.drawCircle(0, 0, size);

            node.gfx.endFill();
          } else if (available) {
            node.gfx.lineStyle(1, getNodeColor(node, nodeMeta), 1);

            node.gfx.drawCircle(0, 0, size + 4);

            node.gfx.endFill();
            node.gfx.beginFill(0xdddddd);
            node.gfx.lineStyle();
            node.gfx.drawCircle(0, 0, size);
            node.gfx.endFill();
          } else {
            node.gfx.beginFill(getNodeColor(node, nodeMeta));

            node.gfx.drawCircle(0, 0, size);

            node.gfx.endFill();
          }
          node.gfx.hitArea = new PIXI.Circle(0, 0, size + 10);
        }
      } else if (node.id === targetNodeId && selected) {
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

          node?.gfx.beginFill(getNodeColor(node, nodeMeta));

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
      addNodeLabel(node.gfx, node.name);
      node.gfx.interactive = true;
    });
  }

  function initializeSim() {
    if (nodesData.length) {
      nodes = map(nodesData, (node) => ({
        ...node,
      }));
    } else {
      nodes = [
        {
          id: "start-here",
          name: "Start here",
          colors: { selected: "#fff", unavailable: "#fff" },
        } as any,
      ];
    }

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
      backgroundColor: bgColor,
      backgroundAlpha: 1,
      resolution: 4,
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
      .force("charge", d3.forceManyBody().strength(-200)) // This adds repulsion (if it's negative) between nodes.
      .force("center", d3.forceCenter(width / 4, height / 2))
      .force(
        "collision",
        d3
          .forceCollide()
          .radius((d) => (d as any).radius)
          .iterations(2)
      )
      .velocityDecay(0.8);

    visualLinks = new PIXI.Graphics();

    viewport.addChild(visualLinks);

    nodes.forEach((node) => {
      addNodeGfx(node);
    });

    redrawNodes();
    updateForces();

    const ticked = () => {
      nodes.forEach((node) => {
        let { x, y, gfx } = node;
        gfx.position = new PIXI.Point(x, y);
      });

      redrawLinks();
    };

    simulation.on("tick", ticked);

    setTheme(theme);

  }

  function addNodeGfx(node) {
    let gfx = new PIXI.Graphics();
    const boundPress = onPress.bind(node);

    let touching = false;

    gfx
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

    gfx
      // events for click
      .on("touchend", (e) => {
        touching = false;
      });

    gfx
      // events for click
      .on("click", (e) => boundPress(e, node));

    gfx.on("mouseover", (mouseData) => {
      console.log("mouseover");
      if (mode === "build") {
        console.log("update");
        updateInfo(node, nodeMeta, nodes, infoUpdated$);
      }
    });
    node.gfx = gfx;
    viewport.addChild(gfx);

    addNodeLabel(node.gfx, node.name);
  }

  const fonts = {
    Inter:
      "https://fonts.googleapis.com/css2?family=Inter:wght@100;400;500;700&display=swap",
  };

  PIXI.Assets.add("font-Inter", fonts.Inter);
  PIXI.Assets.load(fonts.Inter).then(() => {
    initializeSim();
  });

  return {
    destroy: () => {
      simulation.stop();
      nodes.forEach((node) => {
        node.gfx.clear();
        node.gfx.removeChildren();
        node.gfx.destroy();
      });
      visualLinks.clear();
      graphSub.unsubscribe();
    },
  };
}
