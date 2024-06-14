import { each, find } from "lodash-es";
import {
  centerText,
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

const preloadDefaultImages = async () => {
  return await preloadImagesNamed({
    wip: "./cards/generic/construction.png",
    badge_weapon: "./cards/battle/weapon_badge.png",
    badge_tactic: "./cards/battle/tactic_badge.png",
  });
};

enum Fonts {
  Bs = "Bahnschrift",
  Ns = "NotoSerif",
  Ga = "Garamond",
}

enum Fill {
  white = "#fff",
  dark = "#0C0A07",
  darkStroke = "#22a2f",
  playWhen = "#f6d2a7",
  choose = "#f9ebda",
  whiteish = "#eee",
}

export interface CardFont {
  font: Fonts;
  size: number;
  lineHeight?: "big" | "small";
  fill: Fill;
  italic?: boolean;
  weight: 300 | 500 | 700;
  strokeColor?: Fill;
  strokeSize?: number;
}

const drawText = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
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
        lineheight = item.font.size * 1.5;
      }

      ctx.fillStyle = item.font.fill;
      ctx.font = `${item.font.italic ? "Italic" : "Normal"} ${
        item.font.weight
      } ${item.font.size}px ${item.font.font}`;

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
  const imgs = await preloadImagesNamed({
    art: find(imageData, { cardNumber: card["S#"] })?.url,
    back: "./cards/battle/card.png",
    RPS: "./cards/battle/RPS.png",
  });

  const defaultImages = await preloadDefaultImages();

  drawCardAndImage(ctx, canvas, [imgs.art, imgs.back, imgs.RPS]);

  await addBattleBadges(card, ctx, [
    defaultImages.badge_tactic,
    defaultImages.badge_weapon,
  ]);

  if (card.Subtype === "Weapon") {
    ctx.drawImage([2], 540, 880, 160, 160);
  }

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
      `${card["Effect 3"]}`,
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

  let manaPosX = 600;

  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#22a2f";
  ctx.lineWidth = 10;
  ctx.font = "700 95px Bahnschrift";
  manaPosX = 600 + centerText(ctx, card["Mana Cost"], 135);
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

  let effectFontSize = 32;
  if (card["Effect 2"]) {
    effectFontSize -= 2;
  }
  if (card["Effect 3"]) {
    effectFontSize -= 2;
  }

  drawText(
    ctx,
    canvas,
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
        font: {
          font: Fonts.Ga,
          fill: Fill.whiteish,
          weight: 300,
          lineHeight: "small",
          size: effectFontSize,
        },
      },
      {
        text: card["Effect 2"],
        spacingAfter: "big",
        font: {
          font: Fonts.Ga,
          fill: Fill.whiteish,
          weight: 300,
          lineHeight: "small",
          size: effectFontSize,
        },
      },
      {
        text: card["Effect 3"],
        spacingAfter: "big",

        font: {
          font: Fonts.Ga,
          fill: Fill.whiteish,
          weight: 300,
          lineHeight: "small",
          size: effectFontSize,
        },
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

export const drawSorceryCard2 = async (card, ctx, canvas, imageData) => {
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
  ctx.drawImage(getSigil(card.Faction), 540, 60, 160, 160);

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

  const sigilImgs = await preloadImages([
    "./cards/traitor/GB_sigil.png",
    "./cards/traitor/MG_sigil.png",
    "./cards/traitor/NL_sigil.png",
    "./cards/traitor/OC_sigil.png",
    "./cards/traitor/OOM_sigil.png",
    "./cards/traitor/TSO_sigil.png",
  ]);

  const getSigil = (faction) => {
    switch (faction) {
      case "GBC":
        return sigilImgs[0];
      case "MG":
        return sigilImgs[1];
      case "NL":
        return sigilImgs[2];
      case "OC":
        return sigilImgs[3];
      case "OOM":
        return sigilImgs[4];
      case "TSO":
        return sigilImgs[5];
    }
  };

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
  // scaleText(
  //   ctx,
  //   card["Faction Name"],
  //   {
  //     weight: 700,
  //     px: 55,
  //     family: "Bahnschrift",
  //   },
  //   480
  // );
  ctx.fillText(card["Faction Name"], 220, 150);
  ctx.drawImage(getSigil(card.Faction), 40, 40, 130, 130);

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
  const sigilImgs = await preloadImages([
    "./cards/traitor/GB_sigil.png",
    "./cards/traitor/MG_sigil.png",
    "./cards/traitor/NL_sigil.png",
    "./cards/traitor/OC_sigil.png",
    "./cards/traitor/OOM_sigil.png",
    "./cards/traitor/TSO_sigil.png",
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

  const getSigil = (faction) => {
    switch (faction) {
      case "GBC":
        return sigilImgs[0];
      case "MG":
        return sigilImgs[1];
      case "NL":
        return sigilImgs[2];
      case "OC":
        return sigilImgs[3];
      case "OOM":
        return sigilImgs[4];
      case "TSO":
        return sigilImgs[5];
    }
  };

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

  ctx.drawImage(getSigil(card.Faction), 600, 50, 100, 100);
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
