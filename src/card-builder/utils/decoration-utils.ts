import { preloadImage } from "../utils";
import { FactionName, FactionNickname, Factions } from "./card-builder.constants";

export const addBattleBadges = async (card, ctx, output: "tts" | "print") => {
  const offset = output === "print" ? 36 : 0;

  if (card.Subtype === "Weapon") {
    const img = await preloadImage("./cards/battle/weapon_badge.png");
    ctx.drawImage(img, 12 + offset, 12 + offset, img.width, img.height);
  } else if (card.Subtype === "Tactic") {
    const img = await preloadImage("./cards/battle/tactic_badge.png");
    ctx.drawImage(img, 12 + offset, 12 + offset, img.width, img.height);
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

export const factionColors = {
  [Factions.OC]: '#d74624',
  [Factions.GBC]: '#dfae39',
  [Factions.OOM]: '#926aff',
  [Factions.MG]: '#46454d',
  [Factions.TSO]: '#7b5944',
  [Factions.NL]: '#15b580',
}
