import { AQUAUTIC_ABILITIES } from "./aquatic.abilities";
import { DEFENSE_ABILITIES } from "./defense.abilities";
import { FLYING_ABILITIES } from "./flying.abilities";
import { HOLY_ABILITIES } from "./holy.abilities";
import { MOVEMENT_ABILITIES } from "./movement.abilities";
import { NECRO_ABILITIES } from "./necro.abilities";

export interface Ability {
  id: string;
  name: string;
  description?: string | ((params: any) => string);
  type: "action" | "bonus action" | "passive" | "reaction" | "movement";
  damage?: {
    base: "1d6" | "1d8";
    modifiers: number;
  };
  replaces?: string;
  learned?: boolean;
  modifiers?: {
    id: string;
    modifier: number | "levels";
  };
  tags?: string[];
  params?: any;
}

export const ABILITIES: Ability[] = [
  ...HOLY_ABILITIES,
  ...DEFENSE_ABILITIES,
  ...NECRO_ABILITIES,
  ...FLYING_ABILITIES,
  ...MOVEMENT_ABILITIES,
  ...AQUAUTIC_ABILITIES,
  {
    id: "defend",
    name: "Defend",
    description: "Idk, ask Ed",
    type: "action",
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
    tags: ["magic"],
    params: {
      range: 1,
      concentation: 1,
    },
  },
  {
    id: "cantrip-barrage",
    name: "Cantrip Barrage",
    description: "Deal 1d6 damage to an enemy.",
    type: "action",
    tags: ["magic"],
  },
  {
    id: "versatile",
    name: "Versatile",
    description: (params) =>
      `You can choose to take actions prior to movement.`,
    type: "passive",
  },
  {
    id: "extra-versatile",
    name: "Extra Versatile",
    description: (params) =>
      `You can choose to take actions before or after each unit of movement.`,
    type: "passive",
    replaces: "versatile",
  },
];
