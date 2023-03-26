import { each, filter, find, map, some } from "lodash-es";
import { d3Node, INode } from "../runPixi";

export const isNodeSelected = (node: d3Node, nodeMeta) => {
  if (node?.levels) {
    return nodeMeta.acquired[node?.id] > 0;
  } else {
    return nodeMeta.selected[node?.id];
  }
};

export const isNodeAvailable = (node: INode, nodeMeta: any) => {
  return nodeMeta.available[node.id];
};

export const acquiredselectNodeAndReturnNewMeta = (
  selectedNode: INode,
  allNodes: INode[],
  nodeMeta,
  acquired: number = 1
) => {
  let newMeta = nodeMeta;
  if (newMeta.available[selectedNode.id]) {
    if (selectedNode.levels) {
      if (!newMeta.acquired[selectedNode.id]) {
        newMeta.acquired[selectedNode.id] = 0;
      }

      if (
        acquired >= 0 &&
        acquired <= selectedNode.levels
      ) {
        newMeta.acquired[selectedNode.id] = acquired;
      }
    } else {
      newMeta.selected[selectedNode.id] = !newMeta.selected[selectedNode.id];
    }
  }

  newMeta = updateNodesAfterDeselection(allNodes, selectedNode, newMeta);
  newMeta = updateAvailability(allNodes, nodeMeta);
  return newMeta;
};

export const updateNodesAfterDeselection = (nodes, selectedNode, nodeMeta) => {
  let newMeta = { ...nodeMeta };
  const turnOffDependentNodes = (n) => {
    const nodesThatRequireOnThisNode = filter(nodes, (node) => {
      return some(node.requires, { id: n.id });
    });

    newMeta = updateAvailability(nodes, nodeMeta);

    if (nodesThatRequireOnThisNode) {
      each(nodesThatRequireOnThisNode, (dep) => {
        if (!nodeMeta.available[dep.id]) {
          nodeMeta.selected[dep.id] = false;
          nodeMeta.acquired[dep.id] = 0;
          newMeta = updateAvailability(nodes, nodeMeta);
          turnOffDependentNodes(dep);
        }
      });
    }
  };

  turnOffDependentNodes(selectedNode);

  return newMeta;
};

export const updateAvailability = (nodes, nodeMeta) => {
  each(nodes, (node) => {
    if (node.requires) {
      let requirementType = node.requirementType || "and";
      let available = requirementType === "and";

      each(node.requires, (requirement) => {
        const requiredNode = find(nodes, { id: requirement.id });

        if (requiredNode.levels) {
          const levelsRequired = requirement.levels || requiredNode.levels;
          const levelsAcquired = nodeMeta.acquired[requiredNode.id];

          if (requirementType === "and") {
            available = available && levelsAcquired >= levelsRequired;
          } else if (requirementType === "or") {
            available = available || levelsAcquired >= levelsRequired;
          }
        } else {
          if (requirementType === "and") {
            available = available && nodeMeta.selected[requirement.id];
          } else if (requirementType === "or") {
            available = available || nodeMeta.selected[requirement.id];
          }
        }
      });

      nodeMeta.available[node.id] = available;
    }

    if (node.exclusiveWith?.length) {
      let passes = true;
      each(node.exclusiveWith, (id) => {
        passes = !nodeMeta.selected[id] && !nodeMeta.acquired[id];
      });
      nodeMeta.available[node.id] = passes && nodeMeta.available[node.id];
    }
  });

  return nodeMeta;
};

export const updateInfo = (node, nodeMeta, nodes, infoUpdated$) => {
  infoUpdated$.next({
    node: {
      ...node,
      acquired: nodeMeta.acquired[node.id],
      selected: nodeMeta.selected[node.id],
      available: nodeMeta.available[node.id],
      requiredName: find(nodes, { id: node.requires })?.name,
    },
  });
};
export const toPixiColor = (color): number => {
  if (typeof color === "string") {
    return parseInt(color.replace(`#`, ""), 16);
  } else return 0;
};

export const getNodeColor = (node, nodeMeta, override?) => {
  if (override) {
    return toPixiColor(node.colors[override]);
  }

  if (!isNodeAvailable(node, nodeMeta)) {
    return toPixiColor(node.colors.unavailable);
  } else {
    return toPixiColor(node.colors.selected);
  }
};

export const updateNodes = (nodes, graphEvents) => {
  graphEvents.next({
    event: "nodesChanged",
    data: {
      nodes: map(nodes, (n) => ({
        colors: n.colors,
        id: n.id,
        requires: n.requires,
        name: n.name,
        description: n.description,
        cost: n.cost,
        levels: n.levels,
        levelCost: n.levelCost,
        providedStats: n.providedStats,
        providedAbilities: n.providedAbilities,
      })),
    },
  });
};
