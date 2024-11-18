import { find } from "lodash-es";
import { preloadImages } from "../utils";
import { defaultImages, Fill } from "../utils/card-builder.constants";
import { getSigil } from "../utils/decoration-utils";
import { drawFrameAndImage } from "../utils/img-utils";
import { drawCardNumber, drawTitle } from "../utils/text-utils";

export const drawTraitorCard = async (
    card,
    ctx: CanvasRenderingContext2D,
    imageData,
    output
  ) => {
    const printOffset = {
      x: output === "print" ? 36 : 0,
      y: output === "print" ? 16 : 0,
    };
    const imgs = await preloadImages([
      find(imageData, { cardNumber: card["S#"] }).url,
      "./cards/traitor/card.png",
      ...defaultImages,
    ]);
  
    drawFrameAndImage(ctx, { art: imgs[0], frame:imgs[1] }, { output });
    ctx.drawImage(
      await getSigil(card.Faction),
      540 + printOffset.x,
      60 + printOffset.y,
      160,
      160
    );
  
    drawTitle(ctx, card.Title, {
      fill: Fill.white,
      output,
      yPos: 590,
    });
  
    ctx.font = "300 42px NotoSerif";
    ctx.fillStyle = "#16151A";
    ctx.fillText(card.Faction, 80 + printOffset.x, 720 + printOffset.y);
  
    ctx.font = "300 58px NotoSerif";
    ctx.fillText(
      `Strength: ${card.Strength}`,
      80 + printOffset.x,
      850 + printOffset.y
    );
  
    drawCardNumber(ctx, card);
  };