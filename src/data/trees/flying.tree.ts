import { Tree } from "./trees";

export const FLYING_TREE: Tree = {
  prefix: "Flying",
  colors: {
    unavailable: "#506b73",
    inactive: "#6894a1",
    selected: "#4dd2f7",
  },
  nodes: [
    {
      id: "flying",
      requires: "movement-4",
      cost: 1,
      name: "Flying",
      description: "Grants you the ability to fly",
      providedAbilities: [{ id: "flying", gain: true }],
    },
  ],
};
