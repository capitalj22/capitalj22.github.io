import { Ability } from "./abilities";

export const DEFENSE_ABILITIES: Ability[] = [
  {
    id: "guardian",
    name: "Guardian",
    type: "reaction",
    description: (params) => {
      const attacks = params.attacks || 1;
      return `As a reaction, can intercept ${attacks} attack(s) going towards an adjacent ally. You now take that attack - also take 1 damage.`;
    },
    tags: ["defense"],
  },
  {
    id: "deflect",
    name: "Deflect",
    type: "reaction",
    description: (params) => {
      const lowerRange = 4 + params.lowerRange || 4;
      return `Block 1 ranged attack that is made at you. Declare before the attack is rolled. For magic attacks, deflect on a roll of ${lowerRange} or higher.`;
    },
    tags: ["defense"],
  },
];
