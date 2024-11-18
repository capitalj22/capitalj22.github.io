import { find } from "lodash-es";
import {
  drawCardNumber,
  drawText,
  drawTitle,
  setFont,
} from "../utils/text-utils";
import { Fill, Fonts, Weight } from "../utils/card-builder.constants";
import { preloadImagesNamed } from "../utils";
import { drawFrameAndImage } from "../utils/img-utils";

export const drawHordeCard = async (
  card,
  ctx: CanvasRenderingContext2D,
  imageData,
  output: "print" | "tts"
) => {
  const printOffsetX = output === "print" ? 36 : 0;
  const imgs = await preloadImagesNamed({
    art: find(imageData, { cardNumber: card["S#"] })?.url,
    frame:"./cards/horde/card.png",
  });

  await drawFrameAndImage(
    ctx,
    { art: imgs.art, frame:imgs.frame },
    { output }
  );

  setFont(ctx, {
    fill: Fill.white,
    font: Fonts.Bs,
    size: 290,
    weight: Weight.bold,
  });

  ctx.fillText(`${card.Distance}`, 300 + printOffsetX, 340 + printOffsetX);

  drawTitle(ctx, `Move ${card.Distance}`, { fill: Fill.hordeDark, output });

  drawText(
    ctx,
    [
      {
        text: "In Addition:",
        font: {
          fill: Fill.hordeDark,
          font: Fonts.Bs,
          weight: 700,
          size: 50,
        },
        spacingAfter: "small",
      },
      {
        text: card.Effect,
        font: {
          fill: Fill.hordeDark,
          font: Fonts.Ns,
          weight: 300,
          size: 38,
        },
      },
    ],
    {
      x: 80 + printOffsetX,
      yStart: 700,
      maxWidth: 600,
    }
  );

  drawCardNumber(ctx, card, output);
};
