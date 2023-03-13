import { Tree } from "./trees";

export const BASIC_TREE: Tree = {
  prefix: "Attack",
  colors: {
    unavailable: 0x111111,
    inactive: 0x333333,
    selected: 0xdddddd,
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
