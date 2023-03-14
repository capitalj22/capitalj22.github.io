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
      id: "basic",
      cost: 1,
      name: "Basic",
      description: "Congrats! You are a unit.",
      providedStats: [
        { id: "hp", modifier: 5 },
        { id: "armor", modifier: 2 },
      ],
    },
    {
      id: "basic-magic",
      requires: "basic",
      cost: 1,
      name: "Spellcasting",
      description: "Grants your unit the ability to cast spells",
      providedAbilities: [
        { id: "cantrip-barrage", gain: true },
        { id: "spellcasting", gain: true },
      ],
    },
  ],
};
