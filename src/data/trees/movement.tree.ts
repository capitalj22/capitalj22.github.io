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
      cost: 1,
      name: "Movement+",
      description: "Allows you to move one additional hex per turn",
      providedStats: [{ id: "movement", modifier: 1 }],
    },
    {
      id: "movement-2",
      requires: "movement-1",
      cost: 1,
      name: "Movement++",
      description: "Allows you to move one additional hex per turn",
      providedStats: [{ id: "movement", modifier: 1 }],
    },
    {
      id: "movement-3",
      requires: "movement-2",
      cost: 1,
      name: "Movement+++",
      description: "Allows you to move one additional hex per turn",
      providedStats: [{ id: "movement", modifier: 1 }],
    },
    {
      id: "movement-4",
      requires: "movement-3",
      cost: 1,
      name: "Movement++++",
      description: "Allows you to move one additional hex per turn",
      providedStats: [{ id: "movement", modifier: 1 }],
    },
  ],
};
