import { find } from "lodash-es";
import { preloadImagesNamed } from "../utils";
import { drawText, setFont } from "../utils/text-utils";
import {
  CardFont,
  Fill,
  Fonts,
  FontSize,
} from "../utils/card-builder.constants";
import { factionColors } from "../utils/decoration-utils";

const effectFont: CardFont = {
  fill: Fill.dark,
  font: Fonts.Ns,
  size: 33,
  weight: 300,
};

export const drawLeaderToken = async (
  card,
  ctx: CanvasRenderingContext2D,
  imageData,
  output: "tts" | "print"
) => {
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
      printOffset.x - diff,
      printOffset.x,
      ctx.canvas.width / aspectRatio + diff * 2,
      imgs.art.height
    );
  } else {
    const diff = imgs.art.height - imgs.art.width;

    ctx.drawImage(
      imgs.art,
      printOffset.x,
      printOffset.x - diff / 2,
      ctx.canvas.width,
      imgs.art.height / (imgs.art.height / imgs.art.width) + diff / 2
    );
  }

  // ctx.beginPath();
  // ctx.arc(
  //   ctx.canvas.width - 170,
  //   ctx.canvas.width - 100,
  //   70,
  //   0,
  //   2 * Math.PI,
  //   false
  // );
  // ctx.fillStyle = "#333333a0";

  // ctx.fill();

  setFont(ctx, {
    fill: "#f26a06" as any,
    font: Fonts.Bs,
    weight: 700,
    size: 95,
    strokeSize: 8,
    strokeColor: "#222" as any,
  });

  ctx.strokeText(
    card["Strength"],
    ctx.canvas.width - 140,
    ctx.canvas.width - 100
  );

  ctx.fillText(
    card["Strength"],
    ctx.canvas.width - 140,
    ctx.canvas.width - 100
  );

  setFont(ctx, {
    fill: "#ffcb01" as any,
    font: Fonts.Bs,
    weight: 700,
    size: 95,
    strokeSize: 8,
    strokeColor: "#222" as any,
  });

  ctx.strokeText(card["Leadership"], 100, ctx.canvas.width - 100);

  ctx.fillText(card["Leadership"], 100, ctx.canvas.width - 100);

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
  ctx.strokeStyle = factionColors[card["Faction"]];
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
