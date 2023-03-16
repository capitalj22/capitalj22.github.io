import { Tree } from "./trees";

export const MOVEMENT_TREE: Tree = {
  prefix: "Movement",
  colors: {
    unavailable: "#648264",
    inactive: "#3a913b",
    selected: "#51db53",
  },
  nodes: [
    {
      id: "movement-1",
      requires: "basic",
      levels: 8,
      cost: 1,
      name: "Movement",
      description: "Allows you to move one additional hex per turn",
      providedStats: [{ id: "movement", modifier: 1 }],
    },
  ],
};
