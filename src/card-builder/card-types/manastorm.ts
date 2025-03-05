import { regionCoords } from "../region-coordinates";
import {
  centerText,
  fillWorldRegion,
  preloadImages,
  scaleText,
  wrapText,
} from "../utils";
import { Fill } from "../utils/card-builder.constants";
import { drawFrameAndImage } from "../utils/img-utils";
import { drawCardNumber, drawTitle } from "../utils/text-utils";
import { CardDrawParams } from "./constants";

export const drawManastormCard = async (params: CardDrawParams) => {
  let { card, ctx, imageData, output, lookupData } = params;
  
  const imgs = await preloadImages([
    "./cards/manastorm/map-manastorm-base.png",
    "./cards/manastorm/vortex.png",
    "./cards/manastorm/card_vortex.png",
    "./cards/manastorm/card_plains.png",
    "./cards/manastorm/card_forest.png",
    "./cards/manastorm/card_mtn.png",
    "./cards/manastorm/card_fortress.png",
    "./cards/manastorm/card_ocean.png",
    "./cards/manastorm/forest.png",
  ]);

  const sharedImgs = await preloadImages(["./cards/shared/mana.png"]);
  const printOffset = {
    x: output === "print" ? 36 : 0,
    y: output === "print" ? 16 : 0,
  };

  if (card.Title !== "Vortex") {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (card["World Change"]) {
      let aspectRatio = imgs[8].width / imgs[8].height;

      ctx.drawImage(
        imgs[8],
        0 + printOffset.x,
        0 + printOffset.x,
        ctx.canvas.width - printOffset.x * 2,
        (ctx.canvas.width - printOffset.x * 2) / aspectRatio
      );
    } else if (regionCoords[card.Title]) {
      fillWorldRegion(ctx, ctx.canvas, card.Title, imgs[0], output);
    }

    switch (card["Region Type"]) {
      case "Plains":
        ctx.drawImage(
          imgs[3],
          0 + printOffset.x,
          0 + printOffset.x,
          ctx.canvas.width - printOffset.x * 2,
          ctx.canvas.height - printOffset.x * 2
        );
        break;
      case "Forest":
        ctx.drawImage(
          imgs[4],
          0 + printOffset.x,
          0 + printOffset.x,
          ctx.canvas.width - printOffset.x * 2,
          ctx.canvas.height - printOffset.x * 2
        );
        break;
      case "Mountain":
        ctx.drawImage(
          imgs[5],
          0 + printOffset.x,
          0 + printOffset.x,
          ctx.canvas.width - printOffset.x * 2,
          ctx.canvas.height - printOffset.x * 2
        );
        break;
      case "Fortress":
        ctx.drawImage(
          imgs[6],
          0 + printOffset.x,
          0 + printOffset.x,
          ctx.canvas.width - printOffset.x * 2,
          ctx.canvas.height - printOffset.x * 2
        );
        break;
      case "Ocean":
        ctx.drawImage(
          imgs[7],
          0 + printOffset.x,
          0 + printOffset.x,
          ctx.canvas.width - printOffset.x * 2,
          ctx.canvas.height - printOffset.x * 2
        );
        break;
      default:
        ctx.drawImage(
          imgs[5],
          0 + printOffset.x,
          0 + printOffset.x,
          ctx.canvas.width - printOffset.x * 2,
          ctx.canvas.height - printOffset.x * 2
        );

        break;
    }

    drawTitle(ctx, card.Title, { fill: Fill.white, output, yPos: 685 });

    ctx.fillStyle = "#111";
    ctx.font = "300 150px NotoSerif";

    let manaxpos = centerText(ctx, card["Effect/Mana"], 725);
    ctx.drawImage(sharedImgs[0], manaxpos - 80, 800, 125, 125);
    ctx.fillText(card["Effect/Mana"], manaxpos + 80, 915);
  } else {
    drawFrameAndImage(ctx, { art: imgs[1], frame: imgs[2] }, { output });

    ctx.fillStyle = "#fff";
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
    drawTitle(ctx, card.Title, { output });

    ctx.fillStyle = "#111";
    ctx.font = "300 36px NotoSerif";
    wrapText(ctx, card["Effect/Mana"].trim(), 80 + printOffset.x, 640, 600, 45);
  }

  drawCardNumber(ctx, card);
};
