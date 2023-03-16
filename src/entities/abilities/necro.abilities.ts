import { Ability } from "./abilities";

export const NECRO_ABILITIES: Ability[] = [
  {
    id: "knit-flesh",
    name: "Knit Flesh",
    description: (params) =>
      `Restore ${1 + (params.hp || 0)} HP to an adjacent undead unit`,
    type: "action",
  },
  {
    id: "greater-knitting",
    name: "Greater Knitting",
    description: (params) =>
      `Restore ${1 + (params.hp || 0)} HP to all adjacent undead units`,
    type: "action",
    replaces: "knit-flesh",
  },
  {
    id: "mass-knitting",
    name: "Mass Knitting",
    description: (params) =>
      `Restore ${
        1 + (params.hp || 0)
      } HP to all undead units within 2 hexes (100m area)`,
    type: "action",
    replaces: "greater-knitting",
  },
];
