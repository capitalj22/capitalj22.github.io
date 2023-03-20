import { Ability } from "./abilities";

export const MOVEMENT_ABILITIES: Ability[] = [
  {
    id: "dash",
    name: "Dash",
    type: "action",
    description: `Move %movement% hexes.`,
  },
  {
    id: "dash-expert",
    name: "Dash Expert",
    type: "passive",
    description: `Once per turn, you can replace any one of your attacks with movement up to your speed.`,
    tags: ["movement"],
  },
  {
    id: "charge",
    name: "Charge",
    type: "movement",
    description: `If this unit moves 4 hexes in a straight line before becoming adjacent to an enemy they automatically do +%dmg% damage on first melee attack. The movement for the rest of the turn becomes 0. 
        {breakthrough}
          If after a charge, this unit still has remaining movement, it can use that movement to continue on its charge-line through enemy units.
        {/breakthrough}`,
    params: {
      dmg: 1,
      breakthrough: 0,
    },
  },
];
