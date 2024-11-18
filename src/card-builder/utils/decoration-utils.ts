import { preloadImage } from "../utils";
import { FactionName, FactionNickname } from "./card-builder.constants";

export const addBattleBadges = async (card, ctx) => {
  if (card.Subtype === "Weapon") {
    const img = await preloadImage("./cards/battle/weapon_badge.png");
    ctx.drawImage(img, 12 + 36, 12 + 36, img.width, img.height);
  } else if (card.Subtype === "Tactic") {
    const img = await preloadImage("./cards/battle/tactic_badge.png");
    ctx.drawImage(img, 12 + 36, 12 + 36, img.width, img.height);
  }
};

export async function getSigil(factionName: FactionName | FactionNickname) {
  switch (factionName) {
    case "Goldbeard Clan":
    case "GBC":
      return await preloadImage("./cards/traitor/GB_sigil.png");
    case "Orcish Confederation":
    case "OC":
      return await preloadImage("./cards/traitor/OC_sigil.png");
    case "Order of Moonlight":
    case "OOM":
      return await preloadImage("./cards/traitor/OOM_sigil.png");
    case "Necromantic League":
    case "NL":
      return await preloadImage("./cards/traitor/NL_sigil.png");
    case "Mercenary Guild":
    case "MG":
      return await preloadImage("./cards/traitor/MG_sigil.png");
    case "The Silent Ones":
    case "TSO":
      return await preloadImage("./cards/traitor/TSO_sigil.png");
  }
}
