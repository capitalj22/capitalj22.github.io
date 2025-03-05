import { preloadImagesNamed } from "../utils";

export const drawFrameAndImage = async (
  ctx: CanvasRenderingContext2D,
  imgs: { art?: ImageBitmap; frame: ImageBitmap },
  options?: {
    output: "tts" | "print";
    frameBorderColor?: string;
  }
) => {
  const printOffset = options?.output === "print" ? 36 : 0;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (imgs.art) {
    let aspectRatio = imgs.art.width / imgs.art.height;

    ctx.drawImage(
      imgs.art,
      printOffset,
      printOffset,
      ctx.canvas.width - printOffset * 2,
      ctx.canvas.width / aspectRatio
    );
  } else {
    const placeholderImgs = await preloadImagesNamed({
      art: "./cards/generic/construction.png",
    });

    ctx.drawImage(
      placeholderImgs.art,
      printOffset,
      printOffset,
      placeholderImgs.art.width,
      placeholderImgs.art.height
    );
  }

  if (options.frameBorderColor) {
    ctx.strokeStyle = options.frameBorderColor;
    ctx.lineWidth = 20;
    ctx.roundRect(65, 65, 620, 410, 20);
    ctx.stroke();
  }

  ctx.drawImage(
    imgs.frame,
    printOffset,
    printOffset,
    ctx.canvas.width - printOffset * 2,
    ctx.canvas.height - printOffset * 2
  );
};
