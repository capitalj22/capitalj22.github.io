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
    description: `You make 1 melee attack against an adjacent enemy. Roll 1d6{dmg}+%dmg%{/dmg} and do that much damage.`,
    type: "action",
    params: {
      dmg: 0,
    },
  },
  {
    id: "multi-attack",
    name: "Multi Attack",
    description: `You make 1 melee attack against an adjacent enemy.
      
      First Attack: 1d6{dmg1}+%dmg1%{/dmg1}  
      Second Attack: 1d6{dmg2}+%dmg2%{/dmg2} `,
    type: "action",
    replaces: "basic-attack",
    params: {
      dmg1: 0,
      dmg2: 0,
    },
  },
  {
    id: "spellcasting",
    name: "Spellcasting",
    description: `You can now cast spells and cantrips. Casting spells and cantrips take action to cast and require 1 spell slot of the coresponding school of magic. 
    Cantrips barrage does not cost a spell slot. 
    
    Range: %range%
    Contentration Bonus: %concentration%`,
    type: "passive",
    tags: ["magic"],
    params: {
      range: 1,
      concentration: 1,
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
