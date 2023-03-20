import { Ability } from "./abilities";

export const DEFENSE_ABILITIES: Ability[] = [
  {
    id: "guardian",
    name: "Guardian",
    type: "reaction",
    description: `As a reaction, can intercept %attacks% attack(s) going towards an adjacent ally. You now take that attack - also take 1 damage.`,

    tags: ["defense"],
  },
  {
    id: "deflect",
    name: "Deflect",
    type: "reaction",
    description: `Block 1 ranged attack that is made at you. Declare before the attack is rolled. For magic attacks, deflect on a roll of %lowerRange% or higher.`,
    tags: ["defense"],
  },
  {
    id: "reactive-armor",
    name: "Reactive Armor",
    description: `When an enemy attacks you, gain 1 AC. Lose 1 AC at the start of each turn.`,

    type: "passive",
    tags: ["defense"],
  },
  {
    id: "attentive",
    name: "Attentive",
    type: "movement",
    description: "This unit always musters",
    tags: ["defense"],
  },
  {
    id: "alert",
    name: "Alert",
    type: "movement",
    description:
      "This unit always musters and can muster 1 adjacent unit (during movement).",
    replaces: "attentive",
    tags: ["defense"],
  },
];
