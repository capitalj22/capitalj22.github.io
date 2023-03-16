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
    {
      id: "ferry",
      cost: 1,
      requires: "advanced-swimming",
      name: "Ferry",
      description: "Grants the Ferry ability",
      providedAbilities: [{ id: "ferry", gain: true }],
    },
    {
      id: "diving",
      cost: 2,
      requires: "advanced-swimming",
      name: "Diving",
      description: "Grants the Diving ability",
      providedAbilities: [{ id: "diving", gain: true }],
    },
    {
      id: "submarine-transportation",
      cost: 1,
      requires: "diving",
      name: "Submarine Transportation",
      description: "Grants the Submarine Transportation ability",
      providedAbilities: [{ id: "submarine-transportation", gain: true }],
    },
    {
      id: "attack-from-the-deep",
      cost: 2,
      requires: "diving",
      name: "Attack From The Deep",
      description: "Grants the Attack From The Deep ability",
      providedAbilities: [{ id: "attack-from-the-deep", gain: true }],
    }
  ],
};
