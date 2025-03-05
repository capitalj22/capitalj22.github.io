import { find } from "lodash-es";
import { preloadImages, preloadImagesNamed, wrapText } from "../../utils";
import { defaultImages } from "../../utils/card-builder.constants";
import { getSigil } from "../../utils/decoration-utils";
import { CardDrawParams } from "../constants";

export const drawFactionInfo = async (params: CardDrawParams) => {
  let { card, ctx, imageData, output, lookupData } = params;
  ctx.canvas.width = 2250;
  const factionData = find(lookupData, { FactionNicknames: card["Faction"] });

  const imgs = await preloadImagesNamed({
    back: find(imageData, { name: `${card["Faction"]}_info.png` })?.url,
    bch: "./cards/shared/battle_back.png",
    sch: "./cards/shared/sorc_back.png",
    tch: "./cards/shared/traitor_back.png",
    factionSigil: find(imageData, { name: `${card["Faction"]}_sigil.png` })
      ?.url,
  });

  ctx.drawImage(imgs.back, 0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "#ddd";
  ctx.font = "300 124px NotoSerif";

  ctx.fillText(factionData.FactionNames, 220, 150);
  ctx.drawImage(imgs.factionSigil, 40, 40, 130, 130);

  let hsxpos = 60;
  // hand size
  ctx.fillStyle = "#ddd";
  ctx.font = "700 64px Bahnschrift";
  ctx.fillText("Hand Size", 60, 300);

  ctx.font = "500 140px Bahnschrift";
  ctx.drawImage(imgs.bch, hsxpos, 360, 84, 120);
  hsxpos += 100;
  ctx.fillText(card["BCH"], hsxpos, 460);
  hsxpos += 140;

  ctx.drawImage(imgs.sch, hsxpos, 360, 84, 120);
  hsxpos += 100;
  ctx.fillText(card["SCH"], hsxpos, 470);
  hsxpos += 140;

  ctx.drawImage(imgs.tch, hsxpos, 360, 84, 120);
  hsxpos += 100;
  ctx.fillText(card["TCH"], hsxpos, 470);
  hsxpos += 140;

  // troops
  ctx.font = "700 64px Bahnschrift";
  ctx.fillText("Troops", 1000, 300);

  ctx.font = "300 48px NotoSerif";
  ctx.fillText(`${card["T1Q"]} ${card["Troop 1"]}`, 1000, 400);
  ctx.font = "300 36px NotoSerif";
  ctx.fillText(`Cost: ${card["T1RC"]}g each`, 1000, 440);

  if (card["Troop 2"]) {
    ctx.font = "300 44px NotoSerif";
    ctx.fillText(`${card["T2Q"]} ${card["Troop 2"]}`, 1000, 520);
    ctx.font = "300 32px NotoSerif";
    ctx.fillText(`Cost: ${card["T2RC"]}g each`, 1000, 560);
  }

  ctx.font = "700 64px Bahnschrift";
  ctx.fillText("Recruitment Location", 1000, 720);

  ctx.font = "300 36px NotoSerif";
  wrapText(ctx, card["Recruit Loc"], 1000, 780, 1020, 40);
};
