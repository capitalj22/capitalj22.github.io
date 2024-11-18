import { find } from "lodash-es";
import { centerText, preloadImagesNamed } from "../utils";
import { drawFrameAndImage } from "../utils/img-utils";
import { addBattleBadges } from "../utils/decoration-utils";
import {
  drawCardNumber,
  drawCardQuantity,
  drawText,
  drawTitle,
  setFont,
} from "../utils/text-utils";
import { CardFont, Fill, Fonts } from "../utils/card-builder.constants";

export const drawSorceryCard = async (
  card,
  ctx: CanvasRenderingContext2D,
  imageData,
  output: "tts" | "print"
) => {
  const printOffset = output === "print" ? 36 : 0;
  const cardImage = find(imageData, { cardNumber: card["S#"] });

  const imgs = await preloadImagesNamed({
    art: cardImage?.url,
    frame:"./cards/sorcery/card.png",
  });

  await drawFrameAndImage(
    ctx,
    { art: imgs.art, frame:imgs.frame },
    { output }
  );
  await addBattleBadges(card, ctx);

  setFont(ctx, {
    fill: Fill.white,
    font: Fonts.Bs,
    weight: 700,
    size: 95,
    strokeSize: 10,
    strokeColor: Fill.darkStroke,
  });

  let manaPosX = 600 + printOffset;
  manaPosX = 600 + printOffset + centerText(ctx, card["Mana Cost"], 135);
  ctx.strokeText(`${card["Mana Cost"]}`, manaPosX, 114 + printOffset);
  ctx.fillText(`${card["Mana Cost"]}`, manaPosX, 114 + printOffset);

  drawTitle(ctx, card.Title, { fill: Fill.white, output });

  let effectFontSize = 32;
  if (card["Effect 2"]) {
    effectFontSize -= 2;
  }
  if (card["Effect 3"]) {
    effectFontSize -= 2;
  }

  const effectFont: CardFont = {
    font: Fonts.Ga,
    fill: Fill.whiteish,
    weight: 300,
    lineHeight: "small",
    size: effectFontSize,
  };
  drawText(
    ctx,
    [
      {
        text: `*${card["When to Play"]}`,
        font: {
          font: Fonts.Ns,
          fill: Fill.playWhen,
          weight: 300,
          italic: true,
          size: 24,
        },
        spacingAfter: card.Choose ? null : "big",
      },
      {
        text: card["Choose"]
          ? `Choose ${card.Choose} of the following:`
          : undefined,
        font: {
          font: Fonts.Bs,
          fill: Fill.choose,
          weight: 500,
          size: 34,
        },
        spacingAfter: "small",
      },
      {
        text: card["Effect"],
        spacingAfter: "big",
        font: effectFont,
      },
      {
        text: card["Effect 2"],
        spacingAfter: "big",
        font: effectFont,
      },
      {
        text: card["Effect 3"],
        spacingAfter: "big",

        font: effectFont,
      },
    ],
    {
      x: 65 + printOffset,
      yStart: 580 + printOffset,
      maxWidth: 650,
    }
  );

  drawCardNumber(ctx, card);
  drawCardQuantity(ctx, card);
};
