import { Ability } from "./abilities";

export const HOLY_ABILITIES: Ability[] = [
  {
    id: "smite",
    name: "Smite",
    description: (params) =>
      `when an attack hits (does damage to HP), you may spend 1 spell slot to make that attack do +${
        params.dmg ? params.dmg + 3 : 3
      } damage`,
    type: "bonus action",
  },
  {
    id: "guiding-bolt",
    name: "Guiding Bolt",
    description: (params) =>
      `As an action you hit an enemy with a blast of light, dealing 1 nonabsorbable damage. Next round, allies have +${
        params.hit ? params.hit + 1 : 1
      } on all attacks/cantrip strikes against this target. Target must be within spell range.`,

    type: "action",
  },
  {
    id: "death-ward",
    name: "Death Ward",
    description: (params) =>
      `As an action, place a ward against death on a unit. If that unit is reduced to 0 HP it instead goes to 2 HP. When this happens the spell is used up and you lose concentration on it. Target must be within spell range.`,
    type: "action",
    tags: ["concentration"],
  },
  {
    id: "restoration",
    name: "Restoration",
    description: (params) =>
      `As an action, you heal a unit 3 HP within spell range.`,
    type: "action",
  },
  {
    id: "turn-undead",
    name: "Turn Undead",
    description: (params) =>
      `As an action, you deal 1 damage to adjacent undead units and force them on their turn to move at least 1 hex away from you and get no closer for 1 round.`,
    type: "action",
  },
  {
    id: "bless",
    name: "Bless",
    description: (params) =>
      `As an action, buff up an ally within range, granting them +1 on their first attack/cantrip strike of their turn. Does not require concentraion. Target must be in spell range when cast.`,
    type: "action",
  },
  {
    id: "spirit-guardians",
    name: "Spirit Guardians",
    description: (params) =>
      `As an action, call upon spirtual guardians to protect you. You gain 1 AC and adjacent enemies take 1 unabsorbable damage at the start of your turn.`,
    type: "action",
    tags: ["concentration"],
  },
];
