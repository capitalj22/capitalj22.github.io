import { each } from "lodash-es";

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

export async function preloadImagesNamed<T>(imgs: T): Promise<T> {
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

  return imgsMapped as T;
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
