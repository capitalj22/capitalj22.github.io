import { Ability } from "./abilities";

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
      `Once per turn, you can replace any one of your attacks with movement up to your speed.`,
    tags: ["movement"],
  },
  {
    id: "charge",
    name: "Charge",
    type: "movement",
    description: (params) =>
      `If this unit moves 4 hexes in a straight line before becoming adjacent to an enemy they automatically do +${
        params.dmg ? params.dmg + 1 : 1
      } damage on first melee attack. The movement for the rest of the turn becomes 0. ${
        params.breakthrough
          ? "\n\nIf after a charge, this unit still has remaining movement, it can use that movement to continue on its charge-line through enemy units."
          : ""
      }`,
  },
];
