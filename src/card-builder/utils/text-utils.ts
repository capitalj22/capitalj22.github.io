import { each } from "lodash-es";
import {
  CardFont,
  Fill,
  Fonts,
  FontSize,
  Weight,
} from "./card-builder.constants";
import { scaleText, wrapText } from "../utils";

export const setFont = (ctx, font: CardFont) => {
  ctx.fillStyle = font.fill;

  ctx.font = `${font.italic ? "Italic" : "Normal"} ${font.weight} ${
    font.size
  }px ${font.font}`;

  if (font.strokeColor) {
    ctx.strokeStyle = font.strokeColor;
  }

  if (font.strokeSize) {
    ctx.lineWidth = font.strokeSize;
  }
};

export const drawText = (
  ctx: CanvasRenderingContext2D,
  items: Array<{
    text: string;
    font: CardFont;
    spacingAfter?: "big" | "small";
  }>,
  pos: {
    x: number;
    yStart: number;
    maxWidth: number;
  }
) => {
  let maxWidth = pos.maxWidth || 600;
  let y = pos.yStart;

  each(items, (item) => {
    if (item.text) {
      let lineheight;

      if (item.font.lineHeight === "small") {
        lineheight = item.font.size * 1.25;
      } else if (item.font.lineHeight === "big") {
        lineheight = item.font.size * 1.8;
      } else {
        lineheight = Math.ceil(item.font.size * 1.35);
      }

      ctx.fillStyle = item.font.fill;

      setFont(ctx, item.font);
      let linesAdded = wrapText(ctx, item.text, pos.x, y, maxWidth, lineheight);

      if (item.spacingAfter === "small") {
        y += linesAdded;
      } else if (item.spacingAfter === "big") {
        y += linesAdded + Math.ceil(lineheight);
      } else {
        y += linesAdded + Math.ceil(lineheight / 3);
      }
    }
  });
};

export const drawCardNumber = (ctx: CanvasRenderingContext2D, card) => {
  setFont(ctx, { weight: 300, size: 26, font: Fonts.Bs, fill: Fill.whiteish });

  if (card["S#"]) {
    ctx.fillText(`#${card["S#"]}`, 36 + 36, ctx.canvas.height - 15 - 36);
  }
};

export function drawTitle(
  ctx: CanvasRenderingContext2D,
  title: string,
  options: {
    fill?: Fill;
    yPos?: number;
    output?: "print" | "tts";
  } = {} as any
) {
  const printOffsetY = options.output === "print" ? 36 : 16;
  const printOffsetX = options.output === "print" ? 36 : 0;

  setFont(ctx, {
    fill: options.fill || Fill.white,
    font: Fonts.Bs,
    weight: Weight.bold,
    size: FontSize.title,
  });

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

  ctx.fillText(
    `${title}`,
    80 + printOffsetX,
    (options.yPos || 505) + printOffsetY
  );
}

export const drawCardQuantity = (ctx: CanvasRenderingContext2D, card) => {
  setFont(ctx, {
    weight: 500,
    size: 28,
    font: Fonts.Bs,
    fill: Fill.whiteMuted,
  });

  if (card["QTY"] && parseInt(card["QTY"], 10) > 1) {
    ctx.fillText(
      `x${card["QTY"]}`,
      ctx.canvas.width - 75 - 36,
      ctx.canvas.height - 60 - 36
    );
  }
};
