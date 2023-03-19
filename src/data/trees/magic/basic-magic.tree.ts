import { Tree } from "../trees";

export const BASIC_MAGIC_TREE: Tree = {
  prefix: "Magic",
  colors: {
    unavailable: "#65748f",
    inactive: "#495d82",
    selected: "#7391c9",
  },
  nodes: [
    {
      id: "magic-range-1",
      requires: "basic-magic",
      levels: 3,
      name: "Spell Range",
      description: "Increases the range of your magic.",
      providedAbilities: [
        { id: "spellcasting", modifiers: [{ id: "range", modifier: 1 }] },
      ],
    },
    {
      id: "concentration-1",
      requires: "basic-magic",
      levels: 2,
      name: "Concentration+",
      description: "Add +1 to concentration checks.",
      providedAbilities: [
        {
          id: "spellcasting",
          modifiers: [{ id: "concentration", modifier: 1 }],
        },
      ],
    },
  ],
};
