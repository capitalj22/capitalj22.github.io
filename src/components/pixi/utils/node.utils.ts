import { each, filter, find, includes, map } from "lodash-es";
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
  shiftKey: boolean
) => {
  let newMeta = nodeMeta;
  if (newMeta.available[selectedNode.id]) {
    if (selectedNode.levels) {
      if (!newMeta.acquired[selectedNode.id]) {
        newMeta.acquired[selectedNode.id] = 0;
      }

      if (shiftKey && newMeta.acquired[selectedNode.id] > 0) {
        newMeta.acquired[selectedNode.id]--;
      } else if (newMeta.acquired[selectedNode.id] < selectedNode.levels) {
        newMeta.acquired[selectedNode.id]++;
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
  const turnOffDependentNodes = (n) => {
    const deps = filter(nodes, (node) => {
      return node.requires === n.id || includes(node.requires, n.id);
    });

    if (deps) {
      each(deps, (dep) => {
        if (selectedNode.levels) {
          const levelsRequired =
            find(dep.required, { id: selectedNode.id })?.levels ||
            selectedNode.levels;

          if (levelsRequired > nodeMeta.acquired[selectedNode.id]) {
            nodeMeta.selected[dep.id] = false;
            nodeMeta.acquired[dep.id] = 0;
            turnOffDependentNodes(dep);
          }
        } else {
          nodeMeta.selected[dep.id] = false;
          nodeMeta.acquired[dep.id] = 0;
          turnOffDependentNodes(dep);
        }
      });
    }
  };

  turnOffDependentNodes(selectedNode);

  return nodeMeta;
};

export const updateAvailability = (nodes, nodeMeta) => {
  each(nodes, (node) => {
    if (node.requires) {
      let available = true;

      each(node.requires, (requirement) => {
        const requiredNode = find(nodes, { id: requirement.id });
        if (requiredNode.levels) {
          const levelsRequired = requirement.levels || requiredNode.levels;
          const levelsAcquired = nodeMeta.acquired[requiredNode.id];

          available = available && levelsAcquired >= levelsRequired;
        } else {
          available = available && nodeMeta.selected[requirement.id];
        }
      });

      nodeMeta.available[node.id] = available;
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
  } else if (isNodeSelected(node, nodeMeta)) {
    return toPixiColor(node.colors.selected);
  } else {
    return toPixiColor(node.colors.inactive);
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
