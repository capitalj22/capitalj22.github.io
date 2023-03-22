import { Tree } from "./trees/trees";

export const BASIC_TREE: Tree = {
  prefix: "Attack",
  colors: {
    unavailable: "#121212",
    inactive: "#232323",
    selected: "#d2d2d2",
  },
  nodes: [
    {
      id: "basic",
      cost: 1,
      name: "Basic",
      description: "Congrats! You are a unit.",
      providedStats: [
        { id: "hp", modifier: 5 },
        { id: "armor", modifier: 2 },
        { id: "movement", modifier: 2 },
      ],
    },
  ],
};