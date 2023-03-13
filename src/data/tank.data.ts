import { Tree } from "./trees";

export const TANK_TREE: Tree = {
  prefix: "Attack",
  colors: {
    unavailable: 0xb5c8e6,
    inactive: 0x5f7ead,
    selected: 0x0b449c,
  },
  nodes: [
    {
      id: "armor-1",
      requires: "dragon",
      cost: 1,
      name: "Thick Hide",
      description: "Adds 1 Armor",
      providedStats: [{ id: "armor", modifier: 1 }],
    },
    {
      id: "armor-2",
      requires: "armor-1",
      cost: 2,
      name: "Thicker Hide",
      description: "Adds 1 Armor",
      providedStats: [{ id: "armor", modifier: 1 }],
    },
    {
      id: "armor-3",
      requires: "armor-2",
      cost: 3,
      name: "Plated Scales",
      description: "Adds 1 Armor",
      providedStats: [{ id: "armor", modifier: 1 }],
    },
    {
      id: "hp-1",
      requires: "dragon",
      cost: 1,
      name: "Toned",
      description: "Adds 5 Hit Points",
      providedStats: [{ id: "hp", modifier: 5 }],
    },
    {
      id: "hp-2",
      requires: "hp-1",
      cost: 2,
      name: "Bulky",
      description: "Adds 5 Hit Points",
      providedStats: [{ id: "hp", modifier: 5 }],
    },
    {
      id: "hp-3",
      requires: "hp-2",
      cost: 3,
      name: "Jacked and Stacked Mass Monster",
      description: "Adds 5 Hit Points",
      providedStats: [{ id: "hp", modifier: 5 }],
    },
  ],
};