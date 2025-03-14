import { compact, find, map } from "lodash-es";
import { preloadImagesNamed } from "../utils";
import { CardFont, Fill, Fonts } from "../utils/card-builder.constants";

import {
  drawCardNumber,
  drawText,
  drawTitle,
  setFont,
} from "../utils/text-utils";
import { CardDrawParams } from "./constants";

export const drawTraitorCard = async (params: CardDrawParams) => {
  let { card, ctx, imageData, output, lookupData } = params;
  const printOffset = {
    x: output === "print" ? 36 : 0,
    y: output === "print" ? 16 : 0,
  };
  const imgs = await preloadImagesNamed({
    art: find(imageData, { cardNumber: `T${card["LeaderID"]}` })?.url,
    frame: "./cards/traitor/card.png",
    leadershipCostBadge: "./cards/battle/badge_Leadership.png",
    factionSigil: find(imageData, { name: `${card["Faction"]}_sigil.png` })
      ?.url,
  });

  let aspectRatio = imgs.art.width / imgs.art.height;
  const factionData = find(lookupData, { FactionNicknames: card["Faction"] });
  const leaderAttrCols = compact(map(lookupData, "LeaderAttrCols"));
  const leaderAttrNames = compact(map(lookupData, "LeaderAttrs"));
  const effectFont: CardFont = {
    fill: Fill.dark,
    font: Fonts.Ns,
    size: 44,
    weight: 300,
    strokeSize: 4,
    strokeColor: "transparent" as any,
  };
  const leaderAttributes = map(leaderAttrCols, (col, index) => ({
    attribute: leaderAttrNames[index],
    value: card[col],
  }));

  if (imgs.art.width === imgs.art.height) {
    ctx.drawImage(
      imgs.art,
      printOffset.x,
      printOffset.x,
      ctx.canvas.width - printOffset.x * 2,
      ctx.canvas.width / aspectRatio
    );
  } else if (imgs.art.width > imgs.art.height) {
    const diff = imgs.art.width - imgs.art.height;

    ctx.drawImage(
      imgs.art,
      printOffset.x - diff / 2,
      printOffset.x,
      ctx.canvas.width + diff,
      ctx.canvas.width / aspectRatio + diff
    );
  } else {
    const diff = imgs.art.height - imgs.art.width;

    ctx.drawImage(
      imgs.art,
      printOffset.x,
      printOffset.x - diff,
      ctx.canvas.width,
      ctx.canvas.width / aspectRatio
    );
  }

  ctx.strokeStyle = `#${factionData.FactionColors}`;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    ctx.canvas.width / 2,
    ctx.canvas.width / 2,
    ctx.canvas.width / 2 - 64,
    0,
    2 * Math.PI,
    false
  );
  ctx.lineWidth = 15;
  ctx.stroke();

  ctx.drawImage(
    imgs.frame,
    printOffset.x,
    printOffset.x,
    ctx.canvas.width - printOffset.x * 2,
    ctx.canvas.height - printOffset.x * 2
  );
  ctx.drawImage(
    imgs.factionSigil,
    540 + printOffset.x,
    60 + printOffset.y,
    160,
    160
  );

  // cost
  ctx.drawImage(imgs.leadershipCostBadge, -10, 520, 130, 130);
  setFont(ctx, {
    ...effectFont,
    fill: Fill.white,
    size: 55,
    strokeColor: "#000000a0" as any,
    strokeSize: 6,
  });

  ctx.strokeText("1", 40, 600);
  ctx.fillText("1", 40, 600);

  drawTitle(ctx, card.Title, {
    fill: Fill.white,
    output,
    yPos: 590,
    xOffset: 50,
  });

  drawText(
    ctx,
    [
      {
        text: factionData.FactionNames,
        font: {
          ...effectFont,
          size: 40,
          font: Fonts.Bs,
          fill: `#${factionData.FactionColors}` as any,
          strokeColor: "#222222a0" as any,
        },
        spacingAfter: "small",
      },
      ...map(leaderAttributes, (attr) => ({
        text: `${attr.attribute}: ${attr.value}`,
        font: { ...effectFont, size: 28 },
        weight: 700,
        spacingAfter: "small" as any,
      })),
      {
        text: ' ',
        font: {...effectFont, size: 20},
        spacingAfter: 'small'
      },
      {
        text: `Take control of ${card["Title"]}`,
        font: {...effectFont, size: 36},
      },
    ],

    {
      x: 80 + printOffset.x,
      yStart: 700 + printOffset.y,
      maxWidth: 600,
    },
    {
      stroke: true,
    }
  );

  drawCardNumber(ctx, card);
};
