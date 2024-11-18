import { find } from "lodash-es";
import { preloadImagesNamed, scaleText } from "../utils";
import { drawFrameAndImage } from "../utils/img-utils";
import {
  drawCardNumber,
  drawCardQuantity,
  drawText,
  drawTitle,
} from "../utils/text-utils";
import { CardFont, Fill, Fonts } from "../utils/card-builder.constants";
import { addBattleBadges } from "../utils/decoration-utils";

const effectFont: CardFont = {
  fill: Fill.dark,
  font: Fonts.Ns,
  size: 33,
  weight: 300,
};

export const drawBattleCard = async (
  card,
  ctx: CanvasRenderingContext2D,
  imageData,
  output: "tts" | "print"
) => {
  const offset = output === "print" ? 36 : 0;

  const imgs = await preloadImagesNamed({
    art: find(imageData, { cardNumber: card["S#"] })?.url,
    frame: "./cards/battle/card.png",
    RPS: "./cards/battle/RPS.png",
  });

  await drawFrameAndImage(
    ctx,
    { art: imgs.art, frame: imgs.frame },
    { output }
  );
  await addBattleBadges(card, ctx, output);

  if (card.Subtype === "Weapon") {
    ctx.drawImage(imgs.RPS, 540 + offset, 880, 160, 160);
  }

  drawTitle(ctx, card.Title, { fill: Fill.dark, output });

  drawText(
    ctx,
    [
      {
        text: card["Effect 1"],
        font: effectFont,
      },
      {
        text: card["Effect 2"],
        font: effectFont,
      },
      {
        text: card["Effect 3"],
        font: effectFont,
      },
    ],
    {
      x: 80 + 36,
      yStart: 650,
      maxWidth: 600,
    }
  );

  drawCardNumber(ctx, card, output);
  drawCardQuantity(ctx, card, output);
};
