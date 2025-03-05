import { find } from "lodash-es";
import { preloadImagesNamed, wrapText } from "../utils";
import { Fill } from "../utils/card-builder.constants";
import { drawFrameAndImage } from "../utils/img-utils";
import { drawCardNumber, drawTitle } from "../utils/text-utils";
import { CardDrawParams } from "./constants";

export const drawSeasonCard = async (params: CardDrawParams) => {
  let { card, ctx, imageData, output, lookupData } = params;
  const printOffsetX = output === "print" ? 36 : 0;
  const printOffsetY = output === "print" ? 16 : 0;

  const cardImage = find(imageData, { cardNumber: card["S#"] });

  const imgs = await preloadImagesNamed({
    art: cardImage?.url,
    frame:"./cards/season/card.png",
  });

  await drawFrameAndImage(
    ctx,
    { art: imgs.art, frame:imgs.frame },
    { output }
  );

  ctx.fillStyle = "#fff";
  ctx.font = "700 55px Bahnschrift";
  const title = `Season of ${card['Title: "Season of"']}`;

  drawTitle(ctx, title, { fill: Fill.white, output });

  let textSize = 36;
  let lineHeight = 40;
  let totalLength =
    card["Level 1 Effect"].length +
    card["Level 2 Effect"].length +
    card["Level 3 Effect"].length;

  if (totalLength > 200) {
    textSize = 32;
    lineHeight = 35;
  }

  if (totalLength > 300) {
    textSize = 26;
    lineHeight = 35;
  }

  if (totalLength > 400) {
    textSize = 24;
    lineHeight = 30;
  }

  ctx.fillStyle = "#10090C";
  ctx.font = `500 ${textSize}px NotoSerif`;
  const line1Height = wrapText(
    ctx,
    `1: ${card["Level 1 Effect"]}`,
    80 + printOffsetX,
    615 + printOffsetY,
    600,
    lineHeight
  );

  const line2Height = wrapText(
    ctx,
    `2: ${card["Level 2 Effect"]}`,
    80 + printOffsetX,
    615 + line1Height + 30 + printOffsetY,
    600,
    lineHeight
  );

  wrapText(
    ctx,
    `3: ${card["Level 3 Effect"]}`,
    80 + printOffsetX,
    615 + line1Height + line2Height + 60 + printOffsetY,
    600,
    lineHeight
  );

  drawCardNumber(ctx, card);
};
