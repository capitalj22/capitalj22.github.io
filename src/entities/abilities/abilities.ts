export interface Ability {
  id: string;
  name: string;
  description?: string | ((params: any) => string);
  type: "action" | "bonus action" | "passive";
  damage?: {
    base: "1d6" | "1d8";
    modifiers: number;
  };
  replaces?: string;
  learned?: boolean;
  modifiers?: {
    id: string;
    modifier: number | "points";
  };
}

export const ABILITIES: Ability[] = [
  {
    id: "flying",
    name: "Flying",
    description: "You can fly. Great job!",
    type: "passive",
  },
  {
    id: "basic-attack",
    name: "Basic Attack",
    description:
      "You make 1 melee attack against an adjacent enemy. Roll 1d6 and do that much damage. Attacks are declared in terms of the hex attacking from. (so you can split multiple attacks)",
    type: "action",
    damage: {
      base: "1d6",
      modifiers: 0,
    },
  },
  {
    id: "brutal-attack",
    name: "Brutal Attack",
    description:
      "You make 1 melee attack against an adjacent enemy. Roll 1d6 and do that much damage. Attacks are declared in terms of the hex attacking from. (so you can split multiple attacks)",
    type: "action",
    damage: {
      base: "1d6",
      modifiers: 0,
    },
    replaces: "basic-attack",
  },
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
