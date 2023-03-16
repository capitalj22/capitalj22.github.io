import { Ability, ABILITY_TYPES } from "./abilities";

export const MOVEMENT_ABILITIES: Ability[] = [
  {
    id: "dash",
    name: "Dash",
    type: "action",
    description: (params) =>
      `Move ${params.movement ? params.movement + 4 : 4} hexes.`,
  },
  {
    id: "dash-expert",
    name: "Dash Expert",
    type: "passive",
    description: (params) =>
      `Once per turn when you would go to attack, you can choose to move instead.`,
  },
];
