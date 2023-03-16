import { Ability } from "./abilities";

export const AQUAUTIC_ABILITIES: Ability[] = [
  {
    id: "swimming",
    name: "Swimming",
    description: (params) =>
      `If this unit can move up to ${
        params.movement ? params.movement + 3 : 3
      } hexes in the water. If the unit's speed is less than ${
        params.movement ? params.movement + 3 : 3
      }, it can move up to its speed.`,
    type: "movement",
    tags: ["aquatic"],
  },
  {
    id: "aquatic-combat",
    name: "Aquatic Attack",
    description: (params) => `Add +1 to any attack made from the water.`,
    type: "passive",
    tags: ["aquatic"],
  },
  {
    id: "ferry",
    name: "Ferry",
    description: (params) =>
      `This unit can carry other units on water. It takes 1 action to load an ally (action used during movement). No action required to disembark.`,
    type: "passive",
    tags: ["aquatic", "movement"],
  },
  {
    id: "submarine-transportation",
    name: "Submarine Transportation",
    description: (params) =>
      `This unit can carry other units on water and underwater. It takes 1 action to load an ally (action used during movement). No action required to disembark.`,
    type: "passive",
    tags: ["aquatic", "movement"],
    replaces: "ferry",
  },
  {
    id: "diving",
    name: "Diving",
    description: (params) =>
      `This unit can swim under water. Gain access to a -1 vertical space in water. Gain +3 to AC from units that are ground or above. You get a -2 dice roll on all attacks on units that are at ground or above.`,
    type: "movement",
    tags: ["aquatic"],
  },
  {
    id: "attack-from-the-deep",
    name: "Attack from the Deeps",
    description: (params) =>
      `Gain +2 damage on attacks made against other targets in the water that are at ground level.`,
    type: "passive",
    tags: ["aquatic"],
  },
];
