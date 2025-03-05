import { find, map } from "lodash-es";
import { preloadImagesNamed } from "../utils";
import { drawFrameAndImage } from "../utils/img-utils";
import {
  drawCardNumber,
  drawCardQuantity,
  drawText,
  drawTitle,
  setFont,
} from "../utils/text-utils";
import { CardFont, Fill, Fonts } from "../utils/card-builder.constants";
import { CardDrawParams } from "./constants";

export const drawAspectCard = async (params: CardDrawParams) => {
  let { card, ctx, imageData, output, lookupData } = params;
  const printOffset = {
    x: output === "print" ? 36 : 0,
    y: output === "print" ? 16 : 0,
  };
  const cardImage = find(imageData, { cardNumber: card["S#"] });
  const factionData = find(lookupData, { FactionNicknames: card["Faction"] });

  const imgs = await preloadImagesNamed({
    art: cardImage?.url,
    frame: "./cards/aspect/aspect_frame.png",
    factionSigil: find(imageData, { name: `${card["Faction"]}_sigil.png` })
      ?.url,
  });

  await drawFrameAndImage(
    ctx,
    { art: imgs.art, frame: imgs.frame },
    { output, frameBorderColor: `#${factionData.FactionColors}` }
  );

  setFont(ctx, {
    fill: Fill.white,
    font: Fonts.Bs,
    weight: 700,
    size: 95,
    strokeSize: 10,
    strokeColor: Fill.darkStroke,
  });

  ctx.drawImage(
    imgs.factionSigil,
    ctx.canvas.width - 160 + printOffset.x,
    20 + printOffset.y,
    140,
    140
  );

  drawTitle(ctx, card.Name, { fill: Fill.white, output });
  let effects = card["Effect"].split("//");

  const effectFont: CardFont = {
    font: Fonts.Ga,
    fill: Fill.white,
    weight: 300,
    lineHeight: "small",
    size: 32,
  };
  drawText(
    ctx,
    [
      ...map(effects, (effect) => ({
        text: effect.trim(),
        font: effectFont as any,
      })),
    ],
    {
      x: 65 + printOffset.x,
      yStart: 620 + printOffset.y,
      maxWidth: 650,
    }
  );

  drawCardNumber(ctx, card);
  drawCardQuantity(ctx, card);
};
