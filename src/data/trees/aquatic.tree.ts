import { Tree } from "./trees";

export const AQUATIC_TREE: Tree = {
  prefix: "Aquatic",
  colors: {
    unavailable: "#3f5576",
    inactive: "#235299",
    selected: "#1a72f5",
  },
  nodes: [
    {
      id: "swimming",
      cost: 1,
      requires: "speed",
      levelsRequired: 1,
      name: "Swimming",
      description: "Congrats! You are a unit.",
      providedAbilities: [{ id: "swimming", gain: true }],
    },
    {
      id: "advanced-swimming",
      cost: 1,
      name: "Advanded Swimming",
      requires: "swimming",
      levelsRequired: 1,
      description: "Increases potential water speed by 3.",
      providedAbilities: [{ id: "swimming", modifiers: { movement: 3 } }],
    },
  ],
};
