import { Ability } from "./abilities";

export const HOLY_ABILITIES: Ability[] = [
  {
    id: "smite",
    name: "Smite",
    description: (params) =>
      `when an attack hits (does damage to HP), you may spend 1 spell slot to make that attack do +${
        params.dmg ? params.dmg + 3 : 3
      } damage`,
    type: "bonus action",
  },
];
