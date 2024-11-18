import { find } from "lodash-es";
import { preloadImages, scaleText } from "../utils";
import { defaultImages, Fill, Fonts } from "../utils/card-builder.constants";
import { drawCardNumber, drawText } from "../utils/text-utils";

export const drawFortressCard = async (card, ctx, canvas, imageData) => {
  canvas.height = canvas.width;

  const imgs = await preloadImages([
    find(imageData, { cardNumber: card["S#"] })?.url,
    "./cards/fortress/card.png",
    ...defaultImages,
  ]);

  if (imgs[0]) {
    let aspectRatio = imgs[0].width / imgs[0].height;

    ctx.drawImage(
      imgs[0],
      40,
      40,
      canvas.width - 80,
      (canvas.width - 80) / aspectRatio
    );
  } else {
    ctx.drawImage(imgs[2], 0, 0, imgs[2].width, imgs[2].width);
  }

  ctx.drawImage(imgs[1], 0, 0, canvas.width, canvas.height);

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

  drawCardNumber(ctx, card);
};
