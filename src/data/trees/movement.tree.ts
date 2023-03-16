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
    {
      id: "versatile",
      requires: "movement-1",
      levelsRequired: 4,
      cost: 1,
      name: "Versatile",
      description: "Grants the Versatile ability",
      providedAbilities: [{ id: "versatile", gain: true }],
    },
    {
      id: "extra-versatile",
      requires: "versatile",
      cost: 1,
      name: "Extra Versatile",
      description: "Grants the Extra Versatile ability",
      providedAbilities: [{ id: "extra-versatile", gain: true }],
    },
  ],
};
