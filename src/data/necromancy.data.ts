import { Tree } from "./trees/trees";

export const NECRO_TREE: Tree = {
  prefix: "Necromancy",
  colors: {
    unavailable: "0x6f4a78",
    inactive: "#715580",
    selected: "#900fd4",
  },
  nodes: [
    // {
    //   name: "Necromancy",
    //   id: "necromancy",
    //   requires: "dragon",
    //   description: "Allows Necromancy Spellcasting",
    //   cost: 1,
    // },
    // {
    //   name: "Necrotic Armor",
    //   id: "necrotic-armor",
    //   cost: 3,
    //   requires: "necromancy",
    //   providedStats: [{ id: "armor", modifier: 1 }],
    // },
    // {
    //   name: "Knit Flesh",
    //   id: "knit-flesh",
    //   cost: 2,
    //   requires: "necromancy",
    //   description: "provides the Knit Flesh Ability",
    //   providedAbilities: [{ id: "knit-flesh", gain: true }],
    // },
    // {
    //   name: "Greater Knitting",
    //   id: "greater-knitting",
    //   cost: 1,
    //   requires: "knit-flesh",
    //   providedAbilities: [{ id: "greater-knitting", gain: true }],
    // },
    // {
    //   name: "Mass Knitting",
    //   id: "mass-knitting",
    //   cost: 1,
    //   requires: "greater-knitting",
    //   providedAbilities: [{ id: "mass-knitting", gain: true }],
    // },
    // {
    //   name: "Knitting Power",
    //   id: "knitting-power",
    //   description: "Increases the HP healed by fleshknitting abilities by 1",
    //   levels: 3,
    //   requires: "knit-flesh",
    //   providedAbilities: [
    //     { id: "knit-flesh", modifiers: { hp: "levels" } },
    //     { id: "greater-knitting", modifiers: { hp: "levels" } },
    //     { id: "mass-knitting", modifiers: { hp: "levels" } },
    //   ],
    // },
    // {
    //   name: "Necromancy Casting",
    //   id: "necromancy-casting",
    //   cost: 1,
    //   requires: "necromancy",
    // },
    // {
    //   name: "Necro Spells +",
    //   id: "necromancy-spells-1",
    //   cost: 1,
    //   levels: 4,
    //   requires: "necromancy-casting",
    // },
  ],
};
