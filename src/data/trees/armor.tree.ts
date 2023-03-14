import { Tree } from "./trees";

export const ARMOR_TREE: Tree = {
  prefix: "Armor",
  colors: {
    unavailable: "#403c3a",
    inactive: "#5e3c2b",
    selected: "#6e3a21",
  },
  nodes: [
    {
      id: "armor-1",
      requires: "basic",
      cost: 1,
      name: "Armor+",
      description: "Adds 1 Armor",
      providedStats: [{ id: "armor", modifier: 1 }],
    },
    {
      id: "armor-2",
      requires: "armor-1",
      cost: 1,
      name: "Armor++",
      description: "Adds 1 Armor",
      providedStats: [{ id: "armor", modifier: 1 }],
    },
    {
      id: "armor-3",
      requires: "armor-2",
      cost: 2,
      name: "Armor+++",
      description: "Adds 1 Armor",
      providedStats: [{ id: "armor", modifier: 1 }],
    },
    {
      id: "armor-4",
      requires: "armor-3",
      cost: 2,
      name: "Armor++++",
      description: "Adds 1 Armor",
      providedStats: [{ id: "armor", modifier: 1 }],
    },
    {
      id: "armor-5",
      requires: "armor-4",
      cost: 3,
      name: "Armor+++++",
      description: "Adds 1 Armor",
      providedStats: [{ id: "armor", modifier: 1 }],
    },
  ],
};
