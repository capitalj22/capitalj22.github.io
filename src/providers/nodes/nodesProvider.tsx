import { clone, filter, map } from "lodash-es";
import { createContext, useReducer, useState } from "react";
export const NodesContext = createContext({} as any);

function getNodes() {
  // return exampleJson.nodes;
  const nodes = window.localStorage.getItem("dragon-nodes");

  if (nodes) {
    try {
      return JSON.parse(nodes);
    } catch {
      return [{}];
    }
  } else {
    return getStarterNodes();
  }
}

function getStarterNodes() {
  return [
    {
      id: "initial-node",
      name: "Example Node",
      description:
        "Press the Edit button on the left to edit this node. Press the edit button on the right to add stats and abilities.",
      colors: { selected: "#eee", unavailable: "aaa" },
    },
  ];
}

const savedNodesReducer = (state, action) => {
  const { nodes, type } = action;
  let newState = clone(state);

  if (type === "imported") {
    newState = nodes;
    return newState;
  }

  return state;
};

const nodesReducer = (state, action) => {
  const { targetId, index, node, nodes, type } = action;
  let newState = clone(state);

  if (type === "reset") {
    newState = getStarterNodes();
    window.localStorage.setItem("dragon-nodes", JSON.stringify(newState));
    return newState;
  }

  if (type === "save") {
    try {
      window.localStorage.setItem("dragon-nodes", JSON.stringify(newState));
    } catch (err) {}
  }

  if (type === "add") {
    newState = [...newState, node];
    // window.localStorage.setItem("dragon-nodes", JSON.stringify(newState));

    return newState;
  }

  if (type === "set") {
    newState = nodes;

    window.localStorage.setItem("dragon-nodes", JSON.stringify(newState));
    return newState;
  }

  if (type === "update") {
    newState = map(newState, (ab) => {
      if (ab.id === targetId) {
        return node;
      } else {
        return ab;
      }
    });
    window.localStorage.setItem("dragon-nodes", JSON.stringify(newState));
    return newState;
  }

  if (type === "remove") {
    const nodeIndex = state.findIndex((x) => x.id === node.id);

    if (nodeIndex < 0) return state;

    let stateUpdate = [...state];

    stateUpdate.splice(nodeIndex, 1);
    stateUpdate = map(
      filter(stateUpdate, (n) => n.id !== node.id),
      (n) => {
        let requires = n.requires;
        if (n.requires === node.id) {
          requires = node?.requires;
        }

        return {
          ...n,
          requires,
        };
      }
    );
    window.localStorage.setItem("dragon-nodes", JSON.stringify(newState));

    return stateUpdate;
  }
  return state;
};

export const NodesProvider = ({ children }) => {
  const [nodes, setNodes] = useReducer(nodesReducer, getNodes());
  const [savedNodes, setSavedNodes] = useReducer(savedNodesReducer, {});
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [nodeMeta, setNodeMeta] = useState({
    acquired: {},
    selected: {},
    available: {},
  });

  return (
    <NodesContext.Provider
      value={{
        nodes,
        setNodes,
        selectedNodeId,
        setSelectedNodeId,
        nodeMeta,
        setNodeMeta,
        savedNodes,
        setSavedNodes,
      }}
    >
      {children}
    </NodesContext.Provider>
  );
};
