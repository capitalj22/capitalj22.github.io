import * as d3 from "d3";
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Subject } from "rxjs";
import { find, map, each, times } from "lodash-es";
import { SkillNode } from "../../entities/skilltree/node.entity";
import {
  isNodeAvailable,
  isNodeSelected,
  selectNodeAndReturnnewMeta,
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
  infoUpdated$: Subject<any>
) {
  // const links = linksData.map((d) => Object.assign({}, d));
  const nodes = map(nodesData, (node) => ({
    ...node,
  }));
  const links: any[] = [];
  let nodeMeta = {
    selected: {},
    committed: {},
    available: {},
  };

  function newBuild() {
    nodeMeta = {
      selected: {},
      committed: {},
      available: {},
    };

    each(nodes, (node) => {
      nodeMeta.selected[node.id] = build[node.id] === true;
      nodeMeta.committed[node.id] = isFinite(build[node.id])
        ? build[node.id]
        : null;
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
        committed: nodeMeta.committed[n.id],
      })),
    });
  }

  newBuild();
  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  container.innerHTML = "";

  function onPress(e, node: any) {
    nodeMeta = selectNodeAndReturnnewMeta(
      node,
      nodes,
      nodeMeta,
      e.nativeEvent.shiftKey
    );

    nodesUpdated$.next({
      nodes: map(nodes, (n) => ({
        ...n,
        selected: isNodeSelected(n, nodeMeta),
        committed: nodeMeta.committed[n.id],
      })),
    });

    infoUpdated$.next({
      node: { ...node, committed: nodeMeta.committed[node.id] },
    });
    redrawNodes();
    redrawLinks();
  }

  const app = new PIXI.Application({
    width,
    height,
    antialias: true,
    autoDensity: true,
    resizeTo: window,
    backgroundColor: "#141416",
    backgroundAlpha: 1,
    // resolution: 1,
  });

  container.appendChild(app.view);

  // create viewport
  const viewport = new Viewport({
    screenWidth: width,
    screenHeight: height,
    worldWidth: width * 4,
    worldHeight: height * 4,
    passiveWheel: false,

    events: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
  });

  app.stage.addChild(viewport);
  // const sprite = viewport.addChild(PIXI.Sprite.from("./dragonbg.jpg"));
  // const sprite = viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
  // sprite.width = width * 4;
  // sprite.height = height * 4;
  // sprite.tint = 0x12121f;
  // sprite.alpha = 0.7;
  // // sprite.scale = new PIXI.Point(4, 4);
  // sprite.position.set(-1000, -1000);

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
        .forceLink(links) // This force provides links between nodes
        .id((d) => d.id) // This sets the node id accessor to the specified function. If not specified, will default to the index of a node.
        .distance(70)
    )
    .force("charge", d3.forceManyBody().strength(-200)) // This adds repulsion (if it's negative) between nodes.
    .force("center", d3.forceCenter(width, height))
    .force(
      "collision",
      d3
        .forceCollide()
        .radius((d) => d.radius)
        .iterations(2)
    )
    .velocityDecay(0.4);

  /*
   Implementation
   */

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
        infoUpdated$.next({
          node: { ...node, committed: nodeMeta.committed[node.id] },
        });

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

    // show tooltip when mouse is over node
    node.gfx.on("mouseover", (mouseData) => {
      tooltipUpdated$.next({
        show: true,
        x: mouseData.data.originalEvent.pageX,
        y: mouseData.data.originalEvent.pageY,
        node,
      });
      infoUpdated$.next({
        node: { ...node, committed: nodeMeta.committed[node.id] },
      });
    });

    // make circle half-transparent when mouse leaves
    node.gfx.on("mouseout", () => {
      tooltipUpdated$.next({
        show: false,
      });
    });

    const text = new PIXI.Text(name, {
      fontFamily: "Arial",
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
        lineColor =
          isNodeSelected(target, nodeMeta) && isNodeSelected(source, nodeMeta)
            ? toPixiColor(source.colors?.selected)
            : toPixiColor(source.colors?.inactive);

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

  function redrawNodes() {
    nodes.forEach((node: INode) => {
      let cost = node.cost || 1;
      let size = 6 + cost * 2;

      node.gfx.cursor = isNodeAvailable(node, nodeMeta) ? "pointer" : "default";

      if (node.points) {
        let committed = nodeMeta.committed[node.id] || 0;
        const width = node.points * 14;

        node.gfx.clear();
        node.gfx.beginFill(getNodeColor(node));
        node.gfx.drawShape(new PIXI.RoundedRectangle(-12, -6, width, 16, 4));
        node.gfx.endFill();

        node.gfx.beginFill(0xffffff);

        times(committed, (i) => {
          node.gfx.drawCircle(-4 + i * 12, 2, 4);
        });
        node.gfx.endFill();

        node.gfx.hitArea = new PIXI.Rectangle(-10, -6, width, 16);
      } else {
        node.gfx.beginFill(getNodeColor(node));

        node.gfx.drawCircle(0, 0, size);

        node.gfx.hitArea = new PIXI.Circle(0, 0, size);
        node.gfx.endFill();
      }

      node.gfx.interactive = true;
      // node.gfx.buttonMode = isNodeAvailable(node, nodeMeta);
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
