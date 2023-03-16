import { each, filter, find } from "lodash-es";
import { INode } from "../runPixi";

export const isNodeSelected = (node: INode, nodeMeta) => {
  if (node.levels) {
    return nodeMeta.acquired[node.id] > 0;
  } else {
    return nodeMeta.selected[node.id];
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
    const deps = filter(nodes, { requires: n.id });

    if (deps) {
      each(deps, (dep) => {
        if (selectedNode.levels) {
          const levelsRequired = dep.levelsRequired || selectedNode.levels;
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
      const requiredNode = find(nodes, { id: node.requires });
      if (requiredNode.levels) {
        const levelsRequired = node.levelsRequired || node.levels;
        const levelsAcquired = nodeMeta.acquired[requiredNode.id];

        nodeMeta.available[node.id] = levelsAcquired >= levelsRequired;
      } else {
        nodeMeta.available[node.id] = nodeMeta.selected[node.requires];
      }
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
