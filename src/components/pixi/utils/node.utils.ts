import { each, filter, find } from "lodash-es";
import { INode } from "../runPixi";

export const isNodeSelected = (node: INode, nodeMeta) => {
  if (node.points) {
    return nodeMeta.committed[node.id] > 0;
  } else {
    return nodeMeta.selected[node.id];
  }
};

export const isNodeAvailable = (node: INode, nodeMeta: any) => {
  return nodeMeta.available[node.id];
};

export const selectNodeAndReturnnewMeta = (
  selectedNode: INode,
  allNodes: INode[],
  nodeMeta,
  shiftKey: boolean
) => {
  let newMeta = nodeMeta;

  if (newMeta.available[selectedNode.id]) {
    if (selectedNode.points) {
      if (!newMeta.committed[selectedNode.id]) {
        newMeta.committed[selectedNode.id] = 0;
      }

      if (shiftKey && newMeta.committed[selectedNode.id] > 0) {
        newMeta.committed[selectedNode.id]--;
      } else if (newMeta.committed[selectedNode.id] < selectedNode.points) {
        newMeta.committed[selectedNode.id]++;
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
        nodeMeta.selected[dep.id] = false;
        nodeMeta.committed[dep.id] = 0;
        turnOffDependentNodes(dep);
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
      if (requiredNode.points) {
        nodeMeta.available[node.id] =
          nodeMeta.committed[node.id] === requiredNode.points;
      } else {
        nodeMeta.available[node.id] = nodeMeta.selected[node.requires];
      }
    }
  });

  return nodeMeta;
};
