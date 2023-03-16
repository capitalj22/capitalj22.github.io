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
      requires: "movement-1",
      levelsRequired: 4,
      cost: 1,
      name: "Flying",
      description: "Grants you the ability to fly",
      providedAbilities: [{ id: "flying", gain: true }],
    },

    {
      id: "death-bomb",
      requires: "flying",
      cost: 1,
      name: "Death Bomb",
      description: "Grants you the Death Bomb ability. Must be undead to use.",
      providedAbilities: [{ id: "death-bomb", gain: true }],
    },
    {
      id: "swarm",
      requires: "flying",
      cost: 1,
      name: "Swarm",
      description: "Grants you the Swarm ability.",
      providedAbilities: [{ id: "swarm", gain: true }],
    },
    {
      id: "strafing-run",
      requires: "flying",
      cost: 1,
      name: "Strafing Run",
      description: "Grants you the Strafing Run ability.",
      providedAbilities: [{ id: "strafing-run", gain: true }],
    },
    {
      id: "advanced-strafing-run",
      requires: "strafing-run",
      levels: 2,
      name: "Strafing Run+",
      description: "Increases the number of targets by 3.",
      providedAbilities: [{ id: "strafing-run", modifiers: { targets: 3 } }],
    },
    {
      id: "advanced-flying",
      requires: "flying",
      cost: 1,
      name: "Advanced Flying",
      description: "Increases the number of targets by 3.",
      providedAbilities: [{ id: "advanced-flying", gain: true }],
    },
    {
      id: "dive-bomb",
      requires: "advanced-flying",
      cost: 1,
      name: "Dive Bomb",
      description: "Grants you the Dive Bomb ability.",
      providedAbilities: [{ id: "dive-bomb", gain: true }],
    },
    {
      id: "aerial-combat",
      requires: "advanced-flying",
      cost: 1,
      name: "Aerial Combat",
      description: "Grants you the Aerial Combat ability.",
      providedAbilities: [{ id: "aerial-combat", gain: true }],
    },
    {
      id: "aerial-evasion",
      requires: "aerial-combat",
      cost: 1,
      name: "Aerial Evasion",
      description: "Grants you the Aerial Evasion ability.",
      providedAbilities: [{ id: "aerial-evasion", gain: true }],
    }
  ],
};
