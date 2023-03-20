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
      requires: "charge",
      cost: 1,
      levels: 2,
      name: "Dash+",
      description: "Increases the movement of Dash by 2",
      providedAbilities: [
        { id: "dash", modifiers: [{ id: "movement", modifier: 2 }] },
      ],
    },
    {
      id: "dash-expert",
      requires: "advanced-dash",
      levelsRequired: 2,
      cost: 1,
      name: "Dash Expert",
      description: "Grants the Dash Expert ability",
      providedAbilities: [{ id: "dash-expert", gain: true }],
    },
    {
      id: "charge",
      requires: "dash",
      cost: 1,
      name: "Charge",
      description: "Grants the Charge ability",
      providedAbilities: [{ id: "charge", gain: true }],
    },
    {
      id: "breakthrough",
      requires: "charge",
      cost: 1,
      name: "Breakthrough",
      description:
        "Grants you the ability to continue moving through units after a charge.",
      providedAbilities: [
        { id: "charge", modifiers: [{ id: "breakthrough", modifer: 1 }] },
      ],
    },
    {
      id: "advanced-charge",
      requires: "charge",
      cost: 1,
      name: "Charge+",
      description: "Increases the movement of Charge by 2",
      providedAbilities: [
        { id: "charge", modifiers: [{ id: "dmg", modifer: 1 }] },
      ],
    },
  ],
};
