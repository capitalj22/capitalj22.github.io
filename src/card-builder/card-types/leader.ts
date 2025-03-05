import { compact, find, indexOf, map } from "lodash-es";
import { preloadImagesNamed, wrapText } from "../utils";
import { drawText, setFont } from "../utils/text-utils";
import { Fonts } from "../utils/card-builder.constants";
import { factionColors } from "../utils/decoration-utils";
import { CardDrawParams } from "./constants";

//TODO - cleanup
export const drawLeaderToken = async (params: CardDrawParams) => {
  let { card, ctx, imageData, output, lookupData } = params;

  const printOffset = {
    x: output === "print" ? 36 : 0,
    y: output === "print" ? 16 : 0,
  };
  ctx.canvas.height = ctx.canvas.width = 500;

  const imgs = await preloadImagesNamed({
    art: find(imageData, { cardNumber: `T${card["LeaderID"]}` })?.url,
  });

  let aspectRatio = imgs.art.width / imgs.art.height;

  ctx.beginPath();
  ctx.arc(
    ctx.canvas.width / 2,
    ctx.canvas.width / 2,
    ctx.canvas.width / 2,
    0,
    2 * Math.PI,
    false
  );
  ctx.clip();

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
      printOffset.x - diff / 2,
      ctx.canvas.width,
      ctx.canvas.width / aspectRatio
    );
  }

  drawText(
    ctx,
    [
      {
        text: card["Title"],
        font: {
          fill: "#fafafaee" as any,
          font: Fonts.Bs,
          weight: 700,
          size: Math.ceil(65 - card["Title"].length * 1),
          lineHeight: 'small',
          strokeSize: 8,
          strokeColor: "#111111d0" as any,
        },
      },
    ],
    {
      x: 70,
      yStart: 280,
      maxWidth: 240,
    },
    { stroke: true }
  );

  setFont(ctx, {
    fill: "#f26a06" as any,
    font: Fonts.Bs,
    weight: 700,
    size: 125,
    strokeSize: 8,
    strokeColor: "#222" as any,
  });

  const leaderAttrCols = compact(map(lookupData, "LeaderAttrCols"));

  ctx.strokeText(
    card[leaderAttrCols[0]],
    ctx.canvas.width - 110,
    ctx.canvas.width - 150
  );

  ctx.fillText(
    card[leaderAttrCols[0]],
    ctx.canvas.width - 110,
    ctx.canvas.width - 150
  );

  setFont(ctx, {
    fill: "#ffcb01" as any,
    font: Fonts.Bs,
    weight: 700,
    size: 70 - Math.ceil(card[leaderAttrCols[1]].length * 4),
    strokeSize: 8,
    strokeColor: "#222" as any,
  });

  ctx.strokeText(
    card[leaderAttrCols[1]],
    ctx.canvas.width - 180,
    ctx.canvas.width - 95
  );

  ctx.fillText(
    card[leaderAttrCols[1]],
    ctx.canvas.width - 180,
    ctx.canvas.width - 95
  );

  ctx.beginPath();
  ctx.arc(
    ctx.canvas.width / 2,
    ctx.canvas.width / 2,
    ctx.canvas.width / 2 - 6,
    0,
    2 * Math.PI,
    false
  );
  ctx.lineWidth = 20;
  const factionData = find(lookupData, { FactionNicknames: card["Faction"] });

  ctx.strokeStyle = `#${factionData.FactionColors}`;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    ctx.canvas.width / 2,
    ctx.canvas.width / 2,
    ctx.canvas.width / 2 - 20,
    0,
    2 * Math.PI,
    false
  );
  ctx.lineWidth = 15;
  ctx.strokeStyle = "#22222222";
  ctx.stroke();
};
