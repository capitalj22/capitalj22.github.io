import { HOLY_ABILITIES } from "./holy.abilities";

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
  tags?: string[]
}

export const ABILITIES: Ability[] = [
  ...HOLY_ABILITIES,
  {
    id: "flying",
    name: "Flying",
    description: "You can fly. Great job!",
    type: "passive",
  },
  {
    id: "basic-attack",
    name: "Basic Attack",
    description: (params) =>
      `You make 1 melee attack against an adjacent enemy. Roll 1d6${
        params.dmg ? `+${params.dmg}` : " "
      }and do that much damage.`,
    type: "action",
  },
  {
    id: "multi-attack",
    name: "Multi Attack",
    description: (params) =>
      `You make 1 melee attack against an adjacent enemy.\n\nFirst Attack: 1d6${
        params.dmg1 ? `+${params.dmg1}` : " "
      }.\nSecond Attack: 1d6${params.dmg2 ? `+${params.dmg2}` : " "} `,
    type: "action",
    replaces: "basic-attack",
  },
  {
    id: "spellcasting",
    name: "Spellcasting",
    description: (
      params
    ) => `You can now cast spells and cantrips. Casting spells and cantrips take action to cast and require 1 spell slot of the coresponding school of magic. 
    Cantrips barrage does not cost a spell slot. 
    
    Range: ${params.range ? params.range + 1 : 1}
    Contentration Bonus: ${params.concentration || 0}`,
    type: "passive",
  },
  {
    id: "cantrip-barrage",
    name: "Cantrip Barrage",
    description:
      "As an action deal 1d6 damage to an enemy within spell range (spell range is adjacent unless you have Magic Range(s)).",
    type: "action",
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
