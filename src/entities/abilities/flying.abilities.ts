import { Ability } from "./abilities";

export const FLYING_ABILITIES: Ability[] = [
  {
    id: "flying",
    name: "Flying",
    description: `This unit can fly. It now can exist on two different battlefield planes. The ground, and the air level 1. It costs 1 hex of movement to move upward but not downward.

    Additionally, you are immune to environmental effects.`,
    type: "passive",
    tags: ["flying"],
  },
  {
    id: "advanced-flying",
    name: "Advanced Flying",
    description: `This unit can fly. It now can exist on three different battlefield planes. The ground, and the air level 1, and air level 2, and air level 3. It costs 1 hex of movement to move upward but not downward.

    Additionally, you are immune to environmental effects.`,
    type: "passive",
    tags: ["flying"],
    replaces: "flying",
  },
  {
    id: "death-bomb",
    name: "Death Bomb",
    type: "action",
    description: (params) =>
      `This unit can dive bomb and forcefully smash itself into enemy units. This kills this unit. It does 2 damage to a target's HP.`,
    tags: ["undead", "flying"],
  },
  {
    id: "swarm",
    name: "Swarm",
    type: "action",
    tags: ["flying"],
    description: (params) =>
      `Swarm around an adjacent enemy unit, co-existing in their hex, and blocking ranged attacks against targets other than itself. This unit can now move 3 hexes as a reaction to stay with its swarmed unit, any more movement breaks the swarm. In addition it can choose to be hit by ranged attacks that would pass through its hex.`,
  },
  {
    id: "strafing-run",
    name: "Strafing Run",
    type: "passive",
    tags: ["flying"],
    description: (params) =>
      `As part of movement can make a breath attack against up to ${
        params.targets ? params.targets : 1
      } target(s) (adjacent to each) that you fly over in a straight line. This costs 1 breath attack use and does half breath damage (but full effect). Costs 1 movement to initiate for each targeted hex.`,
  },
  {
    id: "dive-bomb",
    name: "Dive Bomb",
    type: "passive",
    tags: ["flying"],
    description: (params) =>
      `When this unit moves from a higher elevation to a lower elevation it gains +1 damage for each air level it decends through for its next attack.`,
  },
  {
    id: "aerial-combat",
    name: "Aerial Combat",
    type: "passive",
    description: (params) => `Gains +1 on attacks made against flying units.`,
    tags: ["flying"],
  },
  {
    id: "aerial-evasion",
    name: "Aerial Evasion",
    type: "passive",
    description: (params) => `Gains +1 to AC while in the air.`,
    tags: ["flying", "defense"],
  },
];
