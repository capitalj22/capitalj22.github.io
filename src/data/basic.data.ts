import { Tree } from "./trees";

export const BASIC_TREE: Tree = {
  prefix: "Attack",
  colors: {
    unavailable: "#121212",
    inactive: "#232323",
    selected: "#d2d2d2",
  },
  nodes: [
    {
      id: "dragon",
      cost: 1,
      name: "Dragon",
      description: "Congrats! You are a dragon.",
      providedAbilities: [{ id: "flying", gain: true }],
    },
  ],
};
