import { Tree } from "./trees";

export const ATTACK_TREE: Tree = {
  prefix: "Attack",
  colors: {
    unavailable: 0x292425,
    inactive: 0x612f39,
    selected: 0xbd1939,
  },
  nodes: [
    {
      id: "attack-1",
      requires: 'dragon',
      cost: 1,
      name: "Attack 1",
      description:
        "You make 1 melee attack against an adjacent enemy. Roll 1d6 and do that much damage. Attacks are declared in terms of the hex attacking from. (so you can split multiple attacks)",
      providedAbilities: [{ id: "basic-attack", gain: true }],
    },
    {
      id: "attack-1-dmg",
      cost: 1,
      requires: "attack-1",
      name: "Brutal Attack",
      description:
        "You make 1 melee attack against an adjacent enemy. Roll 1d6 and do that much damage. Attacks are declared in terms of the hex attacking from. (so you can split multiple attacks)",
      providedAbilities: [{ id: "brutal-attack", gain: true }],
    },
    {
      id: "push-1",
      cost: 1,
      name: "Push",
      description: "Gain the 'Push' Ability",
      requires: "attack-1",
    },
  ],
};
