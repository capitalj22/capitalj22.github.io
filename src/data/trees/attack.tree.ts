import { Tree } from "./trees";

export const ATTACK_TREE: Tree = {
  prefix: "Flying",
  colors: {
    unavailable: "#52465e",
    inactive: "#7d6299",
    selected: "#ac5cff",
  },
  nodes: [
    {
      id: "attack-1",
      requires: "basic",
      cost: 1,
      name: "Attack",
      description: "Grants your unit the ability to attack",
      providedAbilities: [{ id: "basic-attack", gain: true }],
    },
    {
      id: "attack-1-dmg",
      requires: "attack-1",
      cost: 1,
      name: "Attack+",
      description: "Increases the damage of your first attack by 1",
      providedAbilities: [
        { id: "basic-attack", modifiers: { dmg: 1 } },
        { id: "multi-attack", modifiers: { dmg1: 1 } },
      ],
    },
    {
      id: "attack-2",
      requires: "attack-1-dmg",
      cost: 1,
      name: "MultiAttack",
      description: "Grants your unit the ability to attack twice",
      providedAbilities: [{ id: "multi-attack", gain: true }],
    },
    {
      id: "attack-2-dmg",
      requires: "attack-2",
      cost: 1,
      name: "MultiAttack+",
      description: "Increases the damage of your second attack by 1",
      providedAbilities: [{ id: "multi-attack", modifiers: { dmg2: 1 } }],
    },
  ],
};
