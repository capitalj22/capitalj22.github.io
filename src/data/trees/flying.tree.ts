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
      levelsRequired: 6,
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
  ],
};
