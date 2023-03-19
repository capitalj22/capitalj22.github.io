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
      providedAbilities: [
        { id: "smite", gain: true },
        { id: "guiding-bolt", gain: true },
        { id: "death-ward", gain: true },
        { id: "restoration", gain: true },
        { id: "turn-undead", gain: true },
        { id: "bless", gain: true },
        { id: "spirit-guardians", gain: true },
      ],
    },
    {
      id: "holy-power",
      requires: "holy-casting",
      cost: 1,
      name: "Holy Power",
      description: "Increases the damage of Smite and Guiding Bolt by 1",
      providedAbilities: [
        { id: "smite", modifiers: [{ id: "dmg", modifier: 1 }] },
        { id: "guiding-bolt", modifiers: [{ id: "dmg", modifier: 1 }] },
      ],
    },
    {
      id: "advanced-guiding-bolt",
      requires: "holy-power",
      cost: 1,
      name: "Advanced Guiding Bolt",
      description:
        "Guiding bolt now gives allies +2 to hit the target next round.",
      providedAbilities: [{ id: "guiding-bolt", modifiers: { hit: 1 } }],
    },
  ],
};
