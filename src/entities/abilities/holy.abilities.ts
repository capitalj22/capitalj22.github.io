import { Ability } from "./abilities";

export const HOLY_ABILITIES: Ability[] = [
  {
    id: "smite",
    name: "Smite",
    description: `When an attack hits (does damage to HP), you may spend 1 spell slot to make that attack do +%dmg%
      damage`,
    type: "bonus action",
    tags: ["holy"],
    params: {
      dmg: 3,
    },
  },
  {
    id: "guiding-bolt",
    name: "Guiding Bolt",
    description: `You hit an enemy with a blast of light, dealing nonabsorbable damage. Next round, allies have +%roll% on all attacks/cantrip strikes against this target.`,
    type: "action",
    tags: ["holy", "piercing"],
    params: {
      roll: 1,
    },
  },
  {
    id: "death-ward",
    name: "Death Ward",
    description: `Place a ward against death on a unit. If that unit is reduced to 0 HP it instead goes to 2 HP. When this happens the spell is used up and you lose concentration on it.`,
    type: "action",
    tags: ["concentration", "holy"],
  },
  {
    id: "restoration",
    name: "Restoration",
    description: `Heal a unit 3 HP within spell range.`,
    type: "action",
    tags: ["holy"],
  },
  {
    id: "turn-undead",
    name: "Turn Undead",
    description: `Deal %dmg% damage to adjacent undead units and force them on their turn to move at least %range% hex away from you and get no closer for %rounds% round.`,
    type: "action",
    tags: ["holy"],
    params: {
      dmg: 1,
      range: 1,
      rounds: 1,
    },
  },
  {
    id: "bless",
    name: "Bless",
    description: `Buff up an ally within range, granting them +1 on their first attack/cantrip strike of their turn.`,
    type: "action",
    tags: ["holy"],
  },
  {
    id: "spirit-guardians",
    name: "Spirit Guardians",
    description: `Call upon spiritual guardians to protect you. You gain %ac% AC and adjacent enemies take %dmg% unabsorbable damage at the start of your turn.`,
    type: "action",
    tags: ["concentration", "holy", "piercing"],
    params: {
      dmg: 1,
      ac: 1,
    },
  },
];
