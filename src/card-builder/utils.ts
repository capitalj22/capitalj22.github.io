import { each } from "lodash-es";
import { regionCoords } from "./region-coordinates";

export const preloadImages = async (urls) => {
  const promises = urls.map((url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.src = url;

      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
    });
  });

  return Promise.all(promises);
};

export async function preloadImagesNamed<T extends string>(
  imgs: Record<T, string>
): Promise<Record<T, ImageBitmap>> {
  const imgsMapped = {};
  const promise = await Promise.all(
    Object.keys(imgs).map(async (key) => {
      return {
        name: key,
        url: await new Promise((resolve, reject) => {
          const image = new Image();

          image.src = imgs[key];

          image.onload = () => resolve(image);
          image.onerror = () => resolve(null);
        }),
      };
    })
  );

  each(promise, (img) => {
    imgsMapped[img.name] = img.url;
  });

  return imgsMapped as Record<T, ImageBitmap>;
}

export async function preloadImage(url: string): Promise<ImageBitmap> {
  const promise = new Promise((resolve, reject) => {
    const image = new Image();

    image.src = url;

    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
  });

  return promise as Promise<ImageBitmap>;
}

export const centerText = (ctx, text, targetWidth) => {
  const measuredText = ctx.measureText(text).width;
  return targetWidth / 2 - measuredText / 2;
};

export const tryWrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
  let words = text.split(" ");
  let line = "";
  let testLine = "";
  let lineArray = [];

  for (var n = 0; n < words.length; n++) {
    testLine += `${words[n]} `;
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      lineArray.push([line, x, y]);

      y += lineHeight;
      line = `${words[n]} `;
      testLine = `${words[n]} `;
    } else {
      line += `${words[n]} `;
    }
    if (n === words.length - 1) {
      lineArray.push([line, x, y]);
    }
  }

  return lineArray;
};

export const wrapText = function (ctx, text, x, y, maxWidth, lineHeight) {
  let lineArray = tryWrapText(ctx, text, x, y, maxWidth, lineHeight);

  lineArray.forEach(function (item) {
    ctx.fillText(item[0], item[1], item[2]);
  });

  return lineArray.length * lineHeight;
};

export const scaleText = function (ctx, text, font, maxWidth) {
  let px = font.px;
  let fits = false;

  const scaleDown = () => {
    px -= 2;

    measureAndAdjust();
  };

  const measureAndAdjust = () => {
    ctx.font = `${font.weight} ${px}px ${font.family}`;
    let projectedWidth = ctx.measureText(text);
    let testWidth = projectedWidth.width;

    fits = testWidth < maxWidth;

    if (!fits) {
      scaleDown();
    }
  };

  measureAndAdjust();

  return font.px - px;
};

export const fillWorldRegion = (ctx, canvas, region, worldImg) => {
  let offScreenCVS = canvas;
  let offScreenCTX = ctx;
  offScreenCTX.drawImage(
    worldImg,
    50,
    50,
    worldImg.width * 0.8,
    worldImg.height * 0.8
  );
  //Set the dimensions of the drawing canvas
  let coords = regionCoords[region];
  let startX = Math.floor(coords.x * 0.8) + 50,
    startY = Math.floor(coords.y * 0.8) + 50;
  //Start with click coords
  let pixelStack = [[startX, startY]];
  let newPos, x, y, pixelPos, reachLeft, reachRight;
  let startPos = (startY * offScreenCVS.width + startX) * 4;
  let colorLayer = offScreenCTX.getImageData(
    0,
    0,
    offScreenCVS.width,
    offScreenCVS.height
  );
  let startR = colorLayer.data[startPos];
  let startG = colorLayer.data[startPos + 1];
  let startB = colorLayer.data[startPos + 2];

  floodFill();

  function floodFill() {
    newPos = pixelStack.pop();
    x = newPos[0];
    y = newPos[1]; //get current pixel position
    pixelPos = (y * offScreenCVS.width + x) * 4;
    // Go up as long as the color matches and are inside the canvas
    while (y >= 0 && matchStartColor(pixelPos)) {
      y--;
      pixelPos -= offScreenCVS.width * 4;
    }
    //Don't overextend
    pixelPos += offScreenCVS.width * 4;
    y++;
    reachLeft = false;
    reachRight = false; // Go down as long as the color matches and in inside the canvas
    while (y < offScreenCVS.height && matchStartColor(pixelPos)) {
      colorPixel(pixelPos);
      if (x > 0) {
        if (matchStartColor(pixelPos - 4)) {
          if (!reachLeft) {
            //Add pixel to stack
            pixelStack.push([x - 1, y]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }
      if (x < offScreenCVS.width - 1) {
        if (matchStartColor(pixelPos + 4)) {
          if (!reachRight) {
            //Add pixel to stack
            pixelStack.push([x + 1, y]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }
      y++;
      pixelPos += offScreenCVS.width * 4;
    } //recursive until no more pixels to change
    if (pixelStack.length) {
      floodFill();
    }
  }

  //render floodFill result
  offScreenCTX.putImageData(colorLayer, 0, 0); //helpers

  function matchStartColor(pixelPos) {
    let r = colorLayer.data[pixelPos];
    let g = colorLayer.data[pixelPos + 1];
    let b = colorLayer.data[pixelPos + 2];
    return r === startR && g === startG && b === startB;
  }
  function colorPixel(pixelPos) {
    colorLayer.data[pixelPos] = 200;
    colorLayer.data[pixelPos + 1] = 1;
    colorLayer.data[pixelPos + 2] = 12;
    colorLayer.data[pixelPos + 3] = 255;
  }
};
