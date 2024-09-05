import { each, find } from "lodash-es";
import {
  centerText,
  fillWorldRegion,
  preloadImage,
  preloadImages,
  preloadImagesNamed,
  scaleText,
  wrapText,
} from "./utils";
import { regionCoords } from "./region-coordinates";

const defaultImages = [
  "./cards/generic/construction.png",
  "./cards/battle/weapon_badge.png",
  "./cards/battle/tactic_badge.png",
];
type FactionName =
  | "Goldbeard Clan"
  | "Orcish Confederation"
  | "Order of Moonlight"
  | "Necromantic League"
  | "Mercenary Guild"
  | "The Silent Ones";

type FactionNickname = "GBC" | "OC" | "OOM" | "NL" | "MG" | "TSO";

enum Fonts {
  Bs = "Bahnschrift",
  Ns = "NotoSerif",
  Ga = "Garamond",
}

enum Weight {
  light = 300,
  med = 500,
  bold = 700,
}

enum FontSize {
  title = 55,
}

enum Fill {
  white = "#fff",
  dark = "#0C0A07",
  darkStroke = "#22a2f",
  playWhen = "#f6d2a7",
  choose = "#f9ebda",
  whiteish = "#eee",
  whiteMuted = "#aaa",
  hordeDark = "#1D0808",
}

export interface CardFont {
  font: Fonts;
  size: FontSize | number;
  lineHeight?: "big" | "small";
  fill: Fill;
  italic?: boolean;
  weight: Weight;
  strokeColor?: Fill;
  strokeSize?: number;
}

const setFont = (ctx, font: CardFont) => {
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

const drawText = (
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

async function getSigil(factionName: FactionName | FactionNickname) {
  switch (factionName) {
    case "Goldbeard Clan":
    case "GBC":
      return await preloadImage("./cards/traitor/GB_sigil.png");
    case "Orcish Confederation":
    case "OC":
      return await preloadImage("./cards/traitor/OC_sigil.png");
    case "Order of Moonlight":
    case "OOM":
      return await preloadImage("./cards/traitor/OOM_sigil.png");
    case "Necromantic League":
    case "NL":
      return await preloadImage("./cards/traitor/NL_sigil.png");
    case "Mercenary Guild":
    case "MG":
      return await preloadImage("./cards/traitor/MG_sigil.png");
    case "The Silent Ones":
    case "TSO":
      return await preloadImage("./cards/traitor/TSO_sigil.png");
  }
}

const addBattleBadges = async (card, ctx) => {
  if (card.Subtype === "Weapon") {
    const img = await preloadImage("./cards/battle/weapon_badge.png");
    ctx.drawImage(img, 12, 12, img.width, img.height);
  } else if (card.Subtype === "Tactic") {
    const img = await preloadImage("./cards/battle/tactic_badge.png");
    ctx.drawImage(img, 12, 12, img.width, img.height);
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

const drawCardAndImageNamed = async (
  ctx: CanvasRenderingContext2D,
  imgs: { art?: ImageBitmap; card: ImageBitmap }
) => {
  if (imgs.art) {
    let aspectRatio = imgs.art.width / imgs.art.height;

    ctx.drawImage(
      imgs.art,
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.width / aspectRatio
    );
  } else {
    const placeholderImgs = await preloadImagesNamed({
      art: "./cards/generic/construction.png",
    });

    ctx.drawImage(
      placeholderImgs.art,
      0,
      0,
      placeholderImgs.art.width,
      placeholderImgs.art.height
    );
  }

  ctx.drawImage(imgs.card, 0, 0, ctx.canvas.width, ctx.canvas.height);
};

const drawCardNumber = (ctx: CanvasRenderingContext2D, card) => {
  setFont(ctx, { weight: 300, size: 26, font: Fonts.Bs, fill: Fill.white });

  if (card["S#"]) {
    ctx.fillText(
      `#${card["S#"]}`,
      ctx.canvas.width - 120,
      ctx.canvas.height - 15
    );
  }
};

export const drawBattleCard = async (card, ctx, canvas, imageData) => {
  const imgs = await preloadImagesNamed({
    art: find(imageData, { cardNumber: card["S#"] })?.url,
    card: "./cards/battle/card.png",
    RPS: "./cards/battle/RPS.png",
  });

  await drawCardAndImageNamed(ctx, { art: imgs.art, card: imgs.card });
  await addBattleBadges(card, ctx);

  if (card.Subtype === "Weapon") {
    ctx.drawImage(imgs.RPS, 540, 880, 160, 160);
  }

  setFont(ctx, {
    fill: Fill.dark,
    weight: 700,
    font: Fonts.Bs,
    size: 55,
  });

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

  const effectFont: CardFont = {
    fill: Fill.dark,
    font: Fonts.Ns,
    size: 34,
    weight: 300,
  };

  drawText(
    ctx,
    [
      {
        text: card["Effect 1"],
        font: effectFont,
      },
      {
        text: card["Effect 2"],
        font: effectFont,
      },
      {
        text: card["Effect 3"],
        font: effectFont,
      },
    ],
    {
      x: 80,
      yStart: 660,
      maxWidth: 600,
    }
  );

  drawCardNumber(ctx, card);
};

function drawTitle(
  ctx: CanvasRenderingContext2D,
  title: string,
  fill: Fill,
  yPos: number = 520
) {
  setFont(ctx, {
    fill: fill,
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

  ctx.fillText(`${title}`, 80, yPos);
}

export const drawSorceryCard = async (
  card,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  imageData
) => {
  const cardImage = find(imageData, { cardNumber: card["S#"] });

  const imgs = await preloadImagesNamed({
    art: cardImage?.url,
    card: "./cards/sorcery/card.png",
  });

  await drawCardAndImageNamed(ctx, { art: imgs.art, card: imgs.card });
  await addBattleBadges(card, ctx);

  setFont(ctx, {
    fill: Fill.white,
    font: Fonts.Bs,
    weight: 700,
    size: 95,
    strokeSize: 10,
    strokeColor: Fill.darkStroke,
  });

  let manaPosX = 600;
  manaPosX = 600 + centerText(ctx, card["Mana Cost"], 135);
  ctx.strokeText(`${card["Mana Cost"]}`, manaPosX, 114);
  ctx.fillText(`${card["Mana Cost"]}`, manaPosX, 114);

  drawTitle(ctx, card.Title, Fill.white);

  let effectFontSize = 32;
  if (card["Effect 2"]) {
    effectFontSize -= 2;
  }
  if (card["Effect 3"]) {
    effectFontSize -= 2;
  }

  const effectFont: CardFont = {
    font: Fonts.Ga,
    fill: Fill.whiteish,
    weight: 300,
    lineHeight: "small",
    size: effectFontSize,
  };
  drawText(
    ctx,
    [
      {
        text: `*${card["When to Play"]}`,
        font: {
          font: Fonts.Ns,
          fill: Fill.playWhen,
          weight: 300,
          italic: true,
          size: 24,
        },
        spacingAfter: card.Choose ? null : "big",
      },
      {
        text: card["Choose"]
          ? `Choose ${card.Choose} of the following:`
          : undefined,
        font: {
          font: Fonts.Bs,
          fill: Fill.choose,
          weight: 500,
          size: 34,
        },
        spacingAfter: "small",
      },
      {
        text: card["Effect"],
        spacingAfter: "big",
        font: effectFont,
      },
      {
        text: card["Effect 2"],
        spacingAfter: "big",
        font: effectFont,
      },
      {
        text: card["Effect 3"],
        spacingAfter: "big",

        font: effectFont,
      },
    ],
    {
      x: 65,
      yStart: 600,
      maxWidth: 650,
    }
  );

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

export const drawWorldCard = async (card, ctx, canvas, imageData) => {
  const cardImage = find(imageData, { cardNumber: card["S#"] });
  const imgs = await preloadImages([
    cardImage?.url,
    "./cards/world/card.png",
    ...defaultImages,
  ]);
  drawCardAndImage(ctx, canvas, [imgs[0], imgs[1], imgs[2]]);

  ctx.fillStyle = "#fff";
  ctx.font = "700 55px Bahnschrift";
  const title = `${card["Title"]}`;

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

  ctx.fillStyle = "#fff";
  ctx.font = `400 36px NotoSerif`;
  wrapText(ctx, `1: ${card["Effect"]}`, 80, 615, 600, 45);

  drawCardNumber(ctx, card);
};

export const drawHordeCard = async (
  card,
  ctx: CanvasRenderingContext2D,
  imageData
) => {
  const imgs = await preloadImagesNamed({
    art: find(imageData, { cardNumber: card["S#"] })?.url,
    card: "./cards/horde/card.png",
  });

  await drawCardAndImageNamed(ctx, { art: imgs.art, card: imgs.card });

  setFont(ctx, {
    fill: Fill.white,
    font: Fonts.Bs,
    size: 290,
    weight: Weight.bold,
  });

  ctx.fillText(`${card.Distance}`, 300, 340);

  drawTitle(ctx, `Move ${card.Distance}`, Fill.hordeDark);

  drawText(
    ctx,
    [
      {
        text: "In Addition:",
        font: {
          fill: Fill.hordeDark,
          font: Fonts.Bs,
          weight: 700,
          size: 50,
        },
        spacingAfter: "small",
      },
      {
        text: card.Effect,
        font: {
          fill: Fill.hordeDark,
          font: Fonts.Ns,
          weight: 300,
          size: 38,
        },
      },
    ],
    {
      x: 80,
      yStart: 700,
      maxWidth: 600,
    }
  );

  drawCardNumber(ctx, card);
};

export const drawTraitorCard = async (card, ctx, canvas, imageData) => {
  const imgs = await preloadImages([
    find(imageData, { cardNumber: card["S#"] }).url,
    "./cards/traitor/card.png",
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
  ctx.drawImage(await getSigil(card.Faction), 540, 60, 160, 160);

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
  ctx.fillText(card.Faction, 80, 720);

  ctx.font = "300 58px NotoSerif";
  ctx.fillText(`Strength: ${card.Strength}`, 80, 850);

  drawCardNumber(ctx, card);
};

export const drawFactionInfo = async (card, ctx, canvas) => {
  canvas.width = 2250;

  const imgs = await preloadImages([
    "./cards/faction/info.png",
    "./cards/shared/battle_back.png",
    "./cards/shared/sorc_back.png",
    "./cards/shared/traitor_back.png",
    ...defaultImages,
  ]);

  const boardImgs = await preloadImages([
    "./cards/faction/info_GBC.png",
    "./cards/faction/info_MG.png",
    "./cards/faction/info_NL.png",
    "./cards/faction/info_OC.png",
    "./cards/faction/info_OOM.png",
    "./cards/faction/info_TSO.png",
  ]);

  const getBoardImg = (faction) => {
    switch (faction) {
      case "GBC":
        return boardImgs[0];
      case "MG":
        return boardImgs[1];
      case "NL":
        return boardImgs[2];
      case "OC":
        return boardImgs[3];
      case "OOM":
        return boardImgs[4];
      case "TSO":
        return boardImgs[5];
    }
  };

  ctx.drawImage(
    getBoardImg(card["Faction"]),
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.fillStyle = "#ddd";
  ctx.font = "300 124px NotoSerif";

  ctx.fillText(card["Faction Name"], 220, 150);
  ctx.drawImage(await getSigil(card.Faction), 40, 40, 130, 130);

  let hsxpos = 60;
  // hand size
  ctx.fillStyle = "#ddd";
  ctx.font = "700 64px Bahnschrift";
  ctx.fillText("Hand Size", 60, 300);

  ctx.font = "500 140px Bahnschrift";
  ctx.drawImage(imgs[1], hsxpos, 360, 84, 120);
  hsxpos += 100;
  ctx.fillText(card["BCH"], hsxpos, 460);
  hsxpos += 140;

  ctx.drawImage(imgs[2], hsxpos, 360, 84, 120);
  hsxpos += 100;
  ctx.fillText(card["SCH"], hsxpos, 470);
  hsxpos += 140;

  ctx.drawImage(imgs[3], hsxpos, 360, 84, 120);
  hsxpos += 100;
  ctx.fillText(card["TCH"], hsxpos, 470);
  hsxpos += 140;

  // troops
  ctx.font = "700 64px Bahnschrift";
  ctx.fillText("Troops", 1000, 300);

  ctx.font = "300 48px NotoSerif";
  ctx.fillText(`${card["T1Q"]} ${card["Troop 1"]}`, 1000, 400);
  ctx.font = "300 36px NotoSerif";
  ctx.fillText(`Cost: ${card["T1RC"]}g each`, 1000, 440);

  if (card["Troop 2"]) {
    ctx.font = "300 44px NotoSerif";
    ctx.fillText(`${card["T2Q"]} ${card["Troop 2"]}`, 1000, 520);
    ctx.font = "300 32px NotoSerif";
    ctx.fillText(`Cost: ${card["T2RC"]}g each`, 1000, 560);
  }

  ctx.font = "700 64px Bahnschrift";
  ctx.fillText("Recruitment Location", 1000, 720);

  ctx.font = "300 36px NotoSerif";
  wrapText(ctx, card["Recruit Loc"], 1000, 780, 1020, 40);
};

export const drawFactionAbilityCard = async (card, ctx, canvas) => {
  const isFactionAlliance = card.Type === "Faction Alliance";

  if (card.Type === "Faction Ability") {
    canvas.height = 1330;
  }

  const imgs = await preloadImages([
    "./cards/faction/ability_card.png",
    "./cards/faction/svc_card.png",
    "./cards/faction/card_alliance.png",
    ...defaultImages,
  ]);

  const factionCardImgs = await preloadImages([
    "./cards/faction/card_alliance_GBC.png",
    "./cards/faction/card_alliance_MG.png",
    "./cards/faction/card_alliance_NL.png",
    "./cards/faction/card_alliance_OC.png",
    "./cards/faction/card_alliance_OOM.png",
    "./cards/faction/card_alliance_TSO.png",
  ]);

  const resourceImgs = await preloadImages([
    "./cards/shared/empower.png",
    "./cards/shared/threshold.png",
  ]);

  const getFACard = (faction) => {
    switch (faction) {
      case "GBC":
        return factionCardImgs[0];
      case "MG":
        return factionCardImgs[1];
      case "NL":
        return factionCardImgs[2];
      case "OC":
        return factionCardImgs[3];
      case "OOM":
        return factionCardImgs[4];
      case "TSO":
        return factionCardImgs[5];
    }
  };

  if (card.Type === "Special Victory Condition") {
    ctx.drawImage(imgs[1], 0, 0, canvas.width, canvas.height);
  } else if (isFactionAlliance) {
    ctx.drawImage(getFACard(card.Faction), 0, 0, canvas.width, canvas.height);
  } else {
    ctx.drawImage(imgs[0], 0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(await getSigil(card.Faction), 600, 50, 100, 100);
  let textPosY = 260;

  if (card.Empower || card.Threshold) {
    const img = card.Empower ? resourceImgs[0] : resourceImgs[1];
    const text = card.Empower || card.Threshold;
    ctx.drawImage(img, 250, 240, 240, 240);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 10;
    ctx.font = "700 155px Bahnschrift";
    const manaPosX = 250 + centerText(ctx, text, 240);
    ctx.strokeText(`${text}`, manaPosX, 415);
    ctx.fillText(`${text}`, manaPosX, 415);
    ctx.font = `700 48px Bahnschrift`;
    ctx.fillStyle = "#333";
    const empowerText = `${card.Empower ? "Empower" : "Threshold"}: ${text}`;
    ctx.fillText(
      empowerText,
      centerText(ctx, empowerText, 750),
      textPosY + 300,
      600
    );

    textPosY += 420;
  }

  ctx.fillStyle = "#ddd";
  ctx.font = "700 55px Bahnschrift";
  scaleText(
    ctx,
    card.Name,
    {
      weight: 700,
      px: 55,
      family: "Bahnschrift",
    },
    500
  );
  ctx.fillText(card.Name, 80, 120);

  ctx.fillStyle = isFactionAlliance ? "#ddd" : "#333";
  let yPos = textPosY;
  let scalingFactor = card.Effect.length / 45;
  if (card.Type === "Faction Ability") {
    scalingFactor = card.Effect.length / 55;
  }
  let baseFontSize = 44;
  let fontSize = Math.floor(baseFontSize - scalingFactor);
  let lineHeight = fontSize * 1.5;

  ctx.font = `700 48px Bahnschrift`;

  if (card.Type === "Special Victory Condition") {
    ctx.fillText("Special Victory Condition", 80, yPos, 600);
    yPos += 100;
  }
  if (card.Type === "Faction Alliance") {
    ctx.fillText("Alliance", 80, yPos, 600);
    yPos += 100;
  }

  ctx.fillStyle = isFactionAlliance ? "#fff" : "#111";
  ctx.font = `300 ${fontSize}px NotoSerif`;

  let effects = card.Effect.split("//");
  let startY = yPos + 20;

  if (
    card.Type === "Faction Alliance" ||
    card.Type === "Special Victory Condition"
  ) {
    startY = yPos + 20;
  } else {
    startY = yPos;
  }

  each(effects, (effect) => {
    let addLine = true;
    if (effect[0] === "-") {
      addLine = false;
    }
    let num = wrapText(
      ctx,
      effect.trim(),
      60,
      addLine ? startY : startY - Math.floor(lineHeight / 2),
      640,
      lineHeight
    );
    startY += num + (addLine ? Math.floor(lineHeight / 2) : 0);
  });

  // drawCardNumber(ctx, card);
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

  drawText(
    ctx,
    [
      {
        text: "LAND",
        font: {
          fill: Fill.whiteMuted,
          font: Fonts.Bs,
          weight: 500,
          size: 28,
        },
        spacingAfter: "small",
      },
      {
        text: `${card.Land}`,
        font: {
          fill: Fill.whiteish,
          font: Fonts.Ns,
          weight: 300,
          size: 32,
        },
      },
      {
        text: "CITY",
        font: {
          fill: Fill.whiteMuted,
          font: Fonts.Bs,
          weight: 500,
          size: 28,
        },
        spacingAfter: "small",
      },
      {
        text: `${card.City}`,
        font: {
          fill: Fill.whiteish,
          font: Fonts.Ns,
          weight: 300,
          size: 32,
        },
      },
    ],
    {
      x: 80,
      yStart: 505,
      maxWidth: 600,
    }
  );

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
    "./cards/manastorm/forest.png",
  ]);

  const sharedImgs = await preloadImages(["./cards/shared/mana.png"]);

  if (card.Title !== "Vortex") {
    if (card["World Change"]) {
      let aspectRatio = imgs[8].width / imgs[8].height;

      ctx.drawImage(imgs[8], 0, 0, canvas.width, canvas.width / aspectRatio);
    } else if (regionCoords[card.Title]) {
      fillWorldRegion(ctx, canvas, card.Title, imgs[0]);
    }

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
    ctx.drawImage(sharedImgs[0], manaxpos - 80, 800, 125, 125);
    ctx.fillText(card["Effect/Mana"], manaxpos + 80, 915);
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
