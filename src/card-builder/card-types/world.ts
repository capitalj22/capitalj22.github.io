import { find } from "lodash-es";
import { preloadImages, scaleText, wrapText } from "../utils";
import { defaultImages } from "../utils/card-builder.constants";
import { drawCardNumber } from "../utils/text-utils";
import { drawFrameAndImage } from "../utils/img-utils";

export const drawWorldCard = async (card, ctx, canvas, imageData) => {
  const cardImage = find(imageData, { cardNumber: card["S#"] });
  const imgs = await preloadImages([
    cardImage?.url,
    "./cards/world/card.png",
    ...defaultImages,
  ]);
  drawFrameAndImage(ctx, { art: imgs[0], frame:imgs[1] });

  ctx.fillStyle = "#fff";
  ctx.font = "700 55px Bahnschrift";
  const title = `${card["Title"]}`;

  scaleText(
    ctx,
    title,
    {
      weight: 700,
      px: 55,
      family: "Bahnschrift",
    },
    500
  );

  ctx.fillText(`${title}`, 80, 520);

  ctx.fillStyle = "#fff";
  ctx.font = `400 36px NotoSerif`;
  wrapText(ctx, `1: ${card["Effect"]}`, 80, 615, 600, 45);

  drawCardNumber(ctx, card);
};
