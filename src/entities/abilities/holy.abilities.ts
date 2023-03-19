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
    description: (params) =>
      `You hit an enemy with a blast of light, dealing ${
        params.dmg ? params.dmg + 1 : 1
      } nonabsorbable damage. Next round, allies have +${
        params.hit ? params.hit + 1 : 1
      } on all attacks/cantrip strikes against this target.`,

    type: "action",
    tags: ["holy", "piercing"],
  },
  {
    id: "death-ward",
    name: "Death Ward",
    description: (params) =>
      `Place a ward against death on a unit. If that unit is reduced to 0 HP it instead goes to 2 HP. When this happens the spell is used up and you lose concentration on it.`,
    type: "action",
    tags: ["concentration", "holy"],
  },
  {
    id: "restoration",
    name: "Restoration",
    description: (params) => `Heal a unit 3 HP within spell range.`,
    type: "action",
    tags: ["holy"],
  },
  {
    id: "turn-undead",
    name: "Turn Undead",
    description: (params) =>
      `Deal 1 damage to adjacent undead units and force them on their turn to move at least 1 hex away from you and get no closer for 1 round.`,
    type: "action",
    tags: ["holy"],
  },
  {
    id: "bless",
    name: "Bless",
    description: (params) =>
      `Buff up an ally within range, granting them +1 on their first attack/cantrip strike of their turn. Target must be in spell range when cast.`,
    type: "action",
    tags: ["holy"],
  },
  {
    id: "spirit-guardians",
    name: "Spirit Guardians",
    description: (params) =>
      `Call upon spiritual guardians to protect you. You gain 1 AC and adjacent enemies take 1 unabsorbable damage at the start of your turn.`,
    type: "action",
    tags: ["concentration", "holy", "piercing"],
  },
];
