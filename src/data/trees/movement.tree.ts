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
      id: "speed",
      requires: "basic",
      levels: 8,
      cost: 1,
      name: "Speed",
      description: "Allows you to move one additional hex per turn",
      providedStats: [{ id: "movement", modifier: 1 }],
    },
    {
      id: "versatile",
      requires: "speed",
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
    {
      id: "dash",
      requires: "speed",
      levelsRequired: 2,
      cost: 1,
      name: "Dash",
      description: "Grants the Dash ability",
      providedAbilities: [{ id: "dash", gain: true }],
    },
    {
      id: "advanced-dash",
      requires: "dash",
      cost: 1,
      levels: 2,
      name: "Dash+",
      description: "Increases the movement of Dash by 2",
      providedAbilities: [{ id: "dash", modifiers: 2 }],
    },
    {
      id: "dash-expert",
      requires: "advanced-dash",
      cost: 1,
      name: "Dash Expert",
      description: "Grants the Dash Expert ability",
      providedAbilities: [{ id: "dash-expert", gain: true }],
    },
  ],
};
