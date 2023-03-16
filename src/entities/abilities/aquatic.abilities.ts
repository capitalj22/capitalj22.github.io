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
];
