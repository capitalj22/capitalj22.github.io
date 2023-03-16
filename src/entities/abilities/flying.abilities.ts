import { Ability } from "./abilities";

export const FLYING_ABILITIES: Ability[] = [
  {
    id: "flying",
    name: "Flying",
    description: "You can fly. Great job!",
    type: "passive",
  },
  {
    id: "death-bomb",
    name: "Death Bomb",
    type: "action",
    description: (params) =>
      `This unit can dive bomb and forcefully smash itself into enemy units. This kills this unit. It does 2 damage to a target's HP.`,
    tags: ["undead"],
  },
  {
    id: "swarm",
    name: "Swarm",
    type: "action",
    description: (params) =>
      `Swarm around an adjacent enemy unit, co-existing in their hex, and blocking ranged attacks against targets other than itself. This unit can now move 3 hexes as a reaction to stay with its swarmed unit, any more movement breaks the swarm. In addition it can choose to be hit by ranged attacks that would pass through its hex.`,
  },
];
