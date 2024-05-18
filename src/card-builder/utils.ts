export const preloadImages = async (urls) => {
  const promises = urls.map((url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.src = url;

      image.onload = () => resolve(image);
      // image.onerror = () => reject(`Image failed to load: ${url}`);
    });
  });

  return Promise.all(promises);
};

export const wrapText = function (ctx, text, x, y, maxWidth, lineHeight) {
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
