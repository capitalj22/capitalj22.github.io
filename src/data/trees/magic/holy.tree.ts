import { Tree } from "../trees";

export const HOLY_TREE: Tree = {
  prefix: "Magic",
  colors: {
    unavailable: "#7a7354",
    inactive: "#4a4118",
    selected: "#c7ab2e",
  },
  nodes: [
    {
      id: "holy-casting",
      requires: "basic-magic",
      cost: 1,
      name: "Holy-Divine Casting",
      description: "Grants you the ability to cast Holy/Divine Spells.",
      providedAbilities: [{ id: "smite", gain: true }],
    },
  ],
};
