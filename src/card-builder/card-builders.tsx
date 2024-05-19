import { find } from "lodash-es";
import {
  centerText,
  preloadImages,
  scaleText,
  tryWrapText,
  wrapText,
} from "./utils";

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

export const drawBattleCard = async (card, ctx, canvas, imageData) => {
  const imgs = await preloadImages([
    find(imageData, { cardNumber: card["S#"] })?.url,
    "./cards/battle/card.png",
    ...defaultImages,
  ]);

  if (imgs[0]) {
    ctx.drawImage(imgs[0], 0, 0, imgs[0].width, imgs[0].height);
  } else {
    ctx.drawImage(imgs[2], 0, 0, imgs[2].width, imgs[2].width);
  }

  ctx.drawImage(imgs[1], 0, 0, canvas.width, canvas.height);

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

  ctx.fillStyle = "#fff";
  ctx.font = "300 26px Bahnschrift";

  ctx.fillText(`#${card["S#"]}`, 650, 1065);
};

export const drawSorceryCard = async (card, ctx, canvas, imageData) => {
  const cardImage = find(imageData, { cardNumber: card["S#"] });

  const imgs = await preloadImages([
    cardImage?.url,
    "./cards/sorcery/card.png",
    ...defaultImages,
  ]);

  if (imgs[0]) {
    ctx.drawImage(imgs[0], 0, 0, imgs[0].width, imgs[0].height);
  } else {
    ctx.drawImage(imgs[2], 0, 0, imgs[2].width, imgs[2].width);
  }

  ctx.drawImage(imgs[1], 0, 0, canvas.width, canvas.height);

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

  wrapText(ctx, card.Effect, 80, 610 + line1Height + line1Gap, 570, lineHeight);
  ctx.fillStyle = "#fff";
  ctx.font = "300 26px Bahnschrift";

  wrapText(ctx, `#${card["S#"]}`, 650, 1065, 570, 40);
};

export const drawSeasonCard = async (card, ctx, canvas, imageData) => {
  const cardImage = find(imageData, { cardNumber: card["S#"] });
  const imgs = await preloadImages([
    cardImage?.url,
    "./cards/season/card.png",
    ...defaultImages,
  ]);
  if (imgs[0]) {
    ctx.drawImage(imgs[0], 0, 0, imgs[0].width, imgs[0].height);
  } else {
    ctx.drawImage(imgs[2], 0, 0, imgs[2].width, imgs[2].width);
  }

  ctx.drawImage(imgs[1], 0, 0, canvas.width, canvas.height);

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

  ctx.fillStyle = "#fff";
  ctx.font = "300 26px Bahnschrift";

  ctx.fillText(`#${card["S#"]}`, 650, 1065);
};

export const drawHordeCard = async (card, ctx, canvas, imageData) => {
  const imgs = await preloadImages([
    find(imageData, { cardNumber: card["S#"] }).url,
    "./cards/horde/card.png",
    ...defaultImages,
  ]);

  if (imgs[0]) {
    ctx.drawImage(imgs[0], 0, 0, imgs[0].width, imgs[0].height);
  } else {
    ctx.drawImage(imgs[2], 0, 0, imgs[2].width, imgs[2].width);
  }

  ctx.drawImage(imgs[1], 0, 0, canvas.width, canvas.height);

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

  ctx.fillStyle = "#fff";
  ctx.font = "300 26px Bahnschrift";
  wrapText(ctx, `#${card["S#"]}`, 650, 1065, 570, 40);
};
