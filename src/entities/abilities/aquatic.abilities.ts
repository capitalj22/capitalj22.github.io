import { Ability } from "./abilities";

export const AQUAUTIC_ABILITIES: Ability[] = [
  {
    id: "swimming",
    name: "Swimming",
    description: `If this unit can move up to %movement% hexes in the water. If the unit's speed is less than %movement% it can move up to its speed.`,
    type: "movement",
    tags: ["aquatic"],
  },
  {
    id: "aquatic-combat",
    name: "Aquatic Attack",
    description: `Add +1 to any attack made from the water.`,
    type: "passive",
    tags: ["aquatic"],
  },
  {
    id: "ferry",
    name: "Ferry",
    description: `This unit can carry other units on water. It takes 1 action to load an ally (action used during movement). No action required to disembark.`,
    type: "passive",
    tags: ["aquatic", "movement"],
  },
  {
    id: "submarine-transportation",
    name: "Submarine Transportation",
    description: `This unit can carry other units on water and underwater. It takes 1 action to load an ally (action used during movement). No action required to disembark.`,
    type: "passive",
    tags: ["aquatic", "movement"],
    replaces: "ferry",
  },
  {
    id: "diving",
    name: "Diving",
    description: `This unit can swim under water. Gain access to a -1 vertical space in water. Gain +3 to AC from units that are ground or above. You get a -2 dice roll on all attacks on units that are at ground or above.`,
    type: "movement",
    tags: ["aquatic"],
  },
  {
    id: "attack-from-the-deep",
    name: "Attack from the Deeps",
    description: `Gain +2 damage on attacks made against other targets in the water that are at ground level.`,
    type: "passive",
    tags: ["aquatic"],
  },
];
