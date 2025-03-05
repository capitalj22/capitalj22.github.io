import { find } from "lodash-es";
import { preloadImages, preloadImagesNamed, scaleText } from "../utils";
import { defaultImages, Fill, Fonts } from "../utils/card-builder.constants";
import { drawCardNumber, drawText } from "../utils/text-utils";
import { CardDrawParams } from "./constants";

export const drawFortressCard = async (params: CardDrawParams) => {
  let { card, ctx, imageData, output, lookupData } = params;
  ctx.canvas.height = ctx.canvas.width;

  const imgs = await preloadImagesNamed({
    art: find(imageData, { cardNumber: card["S#"] })?.url,
    frame: "./cards/fortress/card.png",
    placeholder: defaultImages[0],
  });

  if (imgs.art) {
    let aspectRatio = imgs.art.width / imgs.art.height;

    ctx.drawImage(
      imgs.art,
      40,
      40,
      ctx.canvas.width - 80,
      (ctx.canvas.width - 80) / aspectRatio
    );
  } else {
    ctx.drawImage(
      imgs.placeholder,
      0,
      0,
      imgs.placeholder.width,
      imgs.placeholder.width
    );
  }

  ctx.drawImage(imgs.frame, 0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "#111";
  ctx.font = "700 55px Bahnschrift";
  scaleText(
    ctx,
    card.Title,
    {
      weight: 700,
      px: 55,
      family: "Bahnschrift",
    },
    500
  );
  ctx.fillText(card.Title, 80, 430);

  drawText(
    ctx,
    [
      {
        text: "LAND",
        font: {
          fill: Fill.whiteMuted,
          font: Fonts.Bs,
          weight: 500,
          size: 28,
        },
        spacingAfter: "small",
      },
      {
        text: `${card.Land}`,
        font: {
          fill: Fill.whiteish,
          font: Fonts.Ns,
          weight: 300,
          size: 32,
        },
      },
      {
        text: "CITY",
        font: {
          fill: Fill.whiteMuted,
          font: Fonts.Bs,
          weight: 500,
          size: 28,
        },
        spacingAfter: "small",
      },
      {
        text: `${card.City}`,
        font: {
          fill: Fill.whiteish,
          font: Fonts.Ns,
          weight: 300,
          size: 32,
        },
      },
    ],
    {
      x: 80,
      yStart: 505,
      maxWidth: 600,
    }
  );

  drawCardNumber(ctx, card, output);
};
