import { find } from "lodash-es";
import {
  centerText,
  preloadImages,
  scaleText,
  tryWrapText,
  wrapText,
} from "./utils";
import { regionCoords } from "./region-coordinates";

const defaultImages = [
  "./cards/generic/construction.png",
  "./cards/battle/weapon_badge.png",
  "./cards/battle/tactic_badge.png",
];

const addBattleBadges = async (card, ctx, imgs) => {
  if (card.Subtype === "Weapon") {
    ctx.drawImage(imgs[0], 12, 12, imgs[0].width, imgs[0].height);
  } else if (card.Subtype === "Tactic") {
    ctx.drawImage(imgs[1], 12, 12, imgs[1].width, imgs[1].height);
  }
};

const drawCardAndImage = async (ctx, canvas, imgs) => {
  if (imgs[0]) {
    let aspectRatio = imgs[0].width / imgs[0].height;

    ctx.drawImage(imgs[0], 0, 0, canvas.width, canvas.width / aspectRatio);
  } else {
    ctx.drawImage(imgs[2], 0, 0, imgs[2].width, imgs[2].width);
  }

  ctx.drawImage(imgs[1], 0, 0, canvas.width, canvas.height);
};

const drawCardNumber = (ctx, card) => {
  ctx.fillStyle = "#fff";
  ctx.font = "300 26px Bahnschrift";
  wrapText(ctx, `#${card["S#"]}`, 650, 1065, 570, 40);
};

export const drawBattleCard = async (card, ctx, canvas, imageData) => {
  const imgs = await preloadImages([
    find(imageData, { cardNumber: card["S#"] })?.url,
    "./cards/battle/card.png",
    ...defaultImages,
  ]);

  drawCardAndImage(ctx, canvas, [imgs[0], imgs[1], imgs[2]]);

  await addBattleBadges(card, ctx, [imgs[3], imgs[4]]);

  ctx.fillStyle = "#0C0A07";
  ctx.font = "700 55px Bahnschrift";
  const diff = scaleText(
    ctx,
    card.Title,
    {
      weight: 700,
      px: 55,
      family: "Bahnschrift",
    },
    500
  );

  ctx.fillText(`${card.Title}`, 80, 520 + diff);

  ctx.fillStyle = "#10090C";
  ctx.font = "300 34px NotoSerif";

  let line1Height;
  let line2Height;

  line1Height = wrapText(ctx, `${card["Effect 1"]}`, 80, 660, 600, 40);

  if (card["Effect 2"]) {
    line2Height = wrapText(
      ctx,
      `${card["Effect 2"]}`,
      80,
      660 + line1Height + 30,
      600,
      40
    );
  }

  if (card["Effect 3"]) {
    wrapText(
      ctx,
      `${card["Effect 2"]}`,
      80,
      660 + line1Height + line2Height + 60,
      600,
      40
    );
  }

  drawCardNumber(ctx, card);
};

export const drawSorceryCard = async (card, ctx, canvas, imageData) => {
  const cardImage = find(imageData, { cardNumber: card["S#"] });

  const imgs = await preloadImages([
    cardImage?.url,
    "./cards/sorcery/card.png",
    ...defaultImages,
  ]);

  drawCardAndImage(ctx, canvas, [imgs[0], imgs[1], imgs[2]]);

  await addBattleBadges(card, ctx, [imgs[3], imgs[4]]);

  // const manaPosX = 600

  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#22a2f";
  ctx.lineWidth = 10;
  ctx.font = "700 95px Bahnschrift";
  const manaPosX = 600 + centerText(ctx, card["Mana Cost"], 135);
  ctx.strokeText(`${card["Mana Cost"]}`, manaPosX, 114);
  ctx.fillText(`${card["Mana Cost"]}`, manaPosX, 114);

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
  ctx.fillText(`${card.Title}`, 80, 520);

  let line1Height = 0;
  let line1Gap = 0;

  ctx.fillStyle = "#f9ebca";
  ctx.font = "Italic 200 32px NotoSerif";

  if (card["When to Play"]) {
    line1Gap = 40;
    line1Height = wrapText(ctx, `* ${card["When to Play"]}`, 80, 610, 570, 40);
  }

  ctx.fillStyle = "#fff";
  ctx.font = "500 36px Garamond";
  let lineHeight = 50;

  if (card.Effect.length > 150) {
    ctx.font = "500 32px Garamond";
    lineHeight = 45;
  }
  if (card.Effect.length > 300) {
    ctx.font = "500 30px Garamond";
    lineHeight = 35;
  }

  wrapText(ctx, card.Effect, 80, 610 + line1Height + line1Gap, 600, lineHeight);
  drawCardNumber(ctx, card);
};

export const drawSeasonCard = async (card, ctx, canvas, imageData) => {
  const cardImage = find(imageData, { cardNumber: card["S#"] });
  const imgs = await preloadImages([
    cardImage?.url,
    "./cards/season/card.png",
    ...defaultImages,
  ]);
  drawCardAndImage(ctx, canvas, [imgs[0], imgs[1], imgs[2]]);

  ctx.fillStyle = "#fff";
  ctx.font = "700 55px Bahnschrift";
  const title = `Season of ${card['Title: "Season of"']}`;

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

  ctx.fillText(`${title}`, 80, 520);

  let textSize = 36;
  let lineHeight = 40;
  let totalLength =
    card["Level 1 Effect"].length +
    card["Level 2 Effect"].length +
    card["Level 3 Effect"].length;

  if (totalLength > 200) {
    textSize = 32;
    lineHeight = 35;
  }

  if (totalLength > 300) {
    textSize = 26;
    lineHeight = 35;
  }

  if (totalLength > 400) {
    textSize = 24;
    lineHeight = 30;
  }

  ctx.fillStyle = "#10090C";
  ctx.font = `500 ${textSize}px NotoSerif`;
  const line1Height = wrapText(
    ctx,
    `1: ${card["Level 1 Effect"]}`,
    80,
    615,
    600,
    lineHeight
  );

  const line2Height = wrapText(
    ctx,
    `2: ${card["Level 2 Effect"]}`,
    80,
    615 + line1Height + 30,
    600,
    lineHeight
  );

  wrapText(
    ctx,
    `3: ${card["Level 3 Effect"]}`,
    80,
    615 + line1Height + line2Height + 60,
    600,
    lineHeight
  );

  drawCardNumber(ctx, card);
};

export const drawHordeCard = async (card, ctx, canvas, imageData) => {
  const imgs = await preloadImages([
    find(imageData, { cardNumber: card["S#"] }).url,
    "./cards/horde/card.png",
    ...defaultImages,
  ]);
  drawCardAndImage(ctx, canvas, [imgs[0], imgs[1], imgs[2]]);

  ctx.fillStyle = "#fff";
  ctx.font = "700 290px Bahnschrift";
  ctx.fillText(`${card.Distance}`, 300, 340);

  ctx.fillStyle = "#1D0808";
  ctx.font = "700 55px Bahnschrift";
  ctx.fillText(`Move ${card.Distance}`, 100, 525);

  ctx.fillStyle = "#1D0808";
  ctx.font = "500 40px Bahnschrift";
  ctx.fillText("Effect:", 100, 660);

  ctx.fillStyle = "#1D0808";
  ctx.font = "300 38px Bahnschrift";
  wrapText(ctx, card.Effect, 100, 720, 570, 40);

  drawCardNumber(ctx, card);
};

export const drawTraitorCard = async (card, ctx, canvas, imageData) => {
  const imgs = await preloadImages([
    find(imageData, { cardNumber: card["S#"] }).url,
    "./cards/traitor/card.png",
    "./cards/traitor/GB_sigil.png",
    "./cards/traitor/MG_sigil.png",
    "./cards/traitor/NL_sigil.png",
    "./cards/traitor/OC_sigil.png",
    "./cards/traitor/OOM_sigil.png",
    "./cards/traitor/TSO_sigil.png",
    ...defaultImages,
  ]);
  const getSigil = (faction) => {
    switch (faction) {
      case "Goldbeard Clan":
        return imgs[2];
      case "Orcish Confederation":
        return imgs[5];
      case "Order of Moonlight":
        return imgs[6];
      case "Necromantic League":
        return imgs[4];
      case "Mercenary Guild":
        return imgs[3];
      case "The Silent Ones":
        return imgs[7];
    }
    return imgs[2];
  };

  if (imgs[0]) {
    let aspectRatio = imgs[0].width / imgs[0].height;

    ctx.drawImage(
      imgs[0],
      40,
      40,
      canvas.width - 80,
      (canvas.width - 80) / aspectRatio
    );
  } else {
    ctx.drawImage(imgs[2], 0, 0, imgs[2].width, imgs[2].width);
  }

  ctx.drawImage(imgs[1], 0, 0, canvas.width, canvas.height);
  ctx.drawImage(getSigil(card.Notes), 540, 60, 160, 160);

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

  ctx.fillText(card.Title, 80, 605);

  ctx.font = "300 42px NotoSerif";
  ctx.fillStyle = "#16151A";
  ctx.fillText(card.Notes, 80, 720);

  ctx.font = "300 58px NotoSerif";
  ctx.fillText(`Strength: ${card.Strength}`, 80, 850);

  drawCardNumber(ctx, card);
};

export const drawFortressCard = async (card, ctx, canvas, imageData) => {
  canvas.height = canvas.width;

  const imgs = await preloadImages([
    find(imageData, { cardNumber: card["S#"] })?.url,
    "./cards/fortress/card.png",
    ...defaultImages,
  ]);

  if (imgs[0]) {
    let aspectRatio = imgs[0].width / imgs[0].height;

    ctx.drawImage(
      imgs[0],
      40,
      40,
      canvas.width - 80,
      (canvas.width - 80) / aspectRatio
    );
  } else {
    ctx.drawImage(imgs[2], 0, 0, imgs[2].width, imgs[2].width);
  }

  ctx.drawImage(imgs[1], 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#111";
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
  ctx.fillText(card.Title, 80, 430);

  ctx.fillStyle = "#eee";
  ctx.font = "300 36px NotoSerif";
  wrapText(ctx, `Reward: ${card.Reward}`, 80, 540, 600, 45);

  drawCardNumber(ctx, card);
};

export const drawManastormCard = async (
  card,
  ctx,
  canvas: HTMLCanvasElement
) => {
  const imgs = await preloadImages([
    "./cards/manastorm/map-manastorm-base.png",
    "./cards/manastorm/vortex.png",
    "./cards/manastorm/card_vortex.png",
    "./cards/manastorm/card_plains.png",
    "./cards/manastorm/card_forest.png",
    "./cards/manastorm/card_mtn.png",
    "./cards/manastorm/card_fortress.png",
    "./cards/manastorm/card_ocean.png",
  ]);

  if (card.Title !== "Vortex") {
    fillWorldRegion(ctx, canvas, card.Title, imgs[0]);
    console.log(card.Type);
    switch (card["Region Type"]) {
      case "Plains":
        ctx.drawImage(imgs[3], 0, 0, canvas.width, canvas.height);
        break;
      case "Forest":
        ctx.drawImage(imgs[4], 0, 0, canvas.width, canvas.height);
        break;
      case "Mountain":
        ctx.drawImage(imgs[5], 0, 0, canvas.width, canvas.height);
        break;
      case "Fortress":
        ctx.drawImage(imgs[6], 0, 0, canvas.width, canvas.height);
        break;
      case "Ocean":
        ctx.drawImage(imgs[7], 0, 0, canvas.width, canvas.height);
        break;
      default:
        ctx.drawImage(imgs[5], 0, 0, canvas.width, canvas.height);

        break;
    }

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
    ctx.fillText(card.Title, 80, 700);

    ctx.fillStyle = "#111";
    ctx.font = "300 150px NotoSerif";

    let manaxpos = centerText(ctx, card["Effect/Mana"], 725);
    ctx.fillText(card["Effect/Mana"], manaxpos, 910);
  } else {
    drawCardAndImage(ctx, canvas, [imgs[1], imgs[2]]);

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
    ctx.fillText(card.Title, 80, 520);

    ctx.fillStyle = "#111";
    ctx.font = "300 36px NotoSerif";
    wrapText(ctx, card["Effect/Mana"].trim(), 80, 640, 600, 45);
  }

  drawCardNumber(ctx, card);
};

const fillWorldRegion = (ctx, canvas, region, worldImg) => {
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
