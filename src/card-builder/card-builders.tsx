import { preloadImages, scaleText, wrapText } from "./utils";

const addBattleBadges = async (card, ctx, imgs) => {
  if (card.Subtype === "Weapon") {
    ctx.drawImage(imgs[0], 12, 12, imgs[0].width, imgs[0].height);
  } else if (card.Subtype === "Tactic") {
    ctx.drawImage(imgs[1], 12, 12, imgs[1].width, imgs[1].height);
  }
};

export const drawBattleCard = async (card, ctx, canvas, download) => {
  const imgs = await preloadImages([
    `./cards/battle/${card["S#"]}.png`,
    "./cards/battle/card.png",
    "./cards/battle/weapon_badge.png",
    "./cards/battle/tactic_badge.png",
  ]);

  ctx.drawImage(imgs[0], 0, 30, canvas.width, 600);
  ctx.drawImage(imgs[1], 0, 0, canvas.width, canvas.height);

  await addBattleBadges(card, ctx, [imgs[2], imgs[3]]);

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
  ctx.font = "300 30px Bahnschrift";

  let line1Height;
  let line2Height;

  line1Height = wrapText(ctx, `${card["Effect 1"]}`, 80, 640, 600, 40);

  if (card["Effect 2"]) {
    line2Height = wrapText(
      ctx,
      `${card["Effect 2"]}`,
      80,
      640 + line1Height + 30,
      600,
      40
    );
  }

  if (card["Effect 3"]) {
    wrapText(
      ctx,
      `${card["Effect 2"]}`,
      80,
      640 + line1Height + line2Height + 60,
      600,
      40
    );
  }

  ctx.fillStyle = "#fff";
  ctx.font = "300 26px Bahnschrift";

  ctx.fillText(`#${card["S#"]}`, 650, 1065);

  if (download) {
    downloadImage(canvas, card);
  }
};

export const drawSorceryCard = async (card, ctx, canvas, download) => {
  const imgs = await preloadImages([
    `./cards/sorcery/${card["S#"]}.png`,
    "./cards/sorcery/card.png",
    "./cards/battle/weapon_badge.png",
    "./cards/battle/tactic_badge.png",
  ]);

  if (imgs[1]) {
    ctx.drawImage(imgs[0], 0, 30, canvas.width, 600);
    ctx.drawImage(imgs[1], 0, 0, canvas.width, canvas.height);

    await addBattleBadges(card, ctx, [imgs[2], imgs[3]]);

    const manaPosX = card["Mana Cost"] === 1 ? 650 : 642;

    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#22a2f";
    ctx.lineWidth = 10;
    ctx.font = "700 100px Bahnschrift";
    ctx.strokeText(`${card["Mana Cost"]}`, manaPosX, 112);
    ctx.fillText(`${card["Mana Cost"]}`, manaPosX, 112);

    ctx.fillStyle = "#fff";
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

    let line1Height = 0;
    let line1Gap = 0;

    ctx.font = "300 36px Bahnschrift";
    if (card["When to Play"]) {
      line1Gap = 30;
      line1Height = wrapText(ctx, card["When to Play"], 80, 610, 570, 40);
    }

    ctx.fillStyle = "#fff";
    wrapText(ctx, card.Effect, 80, 610 + line1Height + line1Gap, 570, 40);

    ctx.fillStyle = "#fff";
    ctx.font = "300 26px Bahnschrift";

    wrapText(ctx, `#${card["S#"]}`, 650, 1065, 570, 40);

    if (download) {
      downloadImage(canvas, card);
    }
  }
};

export const drawSeasonCard = async (card, ctx, canvas, download) => {
  const imgs = await preloadImages([
    `./cards/season/${card["S#"]}.png`,
    "./cards/season/card.png",
  ]);

  if (imgs[1]) {
    ctx.drawImage(imgs[0], 0, 30, canvas.width, 600);
    ctx.drawImage(imgs[1], 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.font = "700 55px Bahnschrift";
    const title = `Season of ${card['Title: "Season of"']}`;

    const diff = scaleText(
      ctx,
      title,
      {
        weight: 700,
        px: 55,
        family: "Bahnschrift",
      },
      500
    );

    ctx.fillText(`${title}`, 80, 520 + diff);

    ctx.fillStyle = "#10090C";
    ctx.font = "300 28px Bahnschrift";
    const line1Height = wrapText(
      ctx,
      `1: ${card["Level 1 Effect"]}`,
      80,
      600,
      600,
      40
    );

    const line2Height = wrapText(
      ctx,
      `2: ${card["Level 2 Effect"]}`,
      80,
      600 + line1Height + 30,
      600,
      40
    );

    wrapText(
      ctx,
      `3: ${card["Level 3 Effect"]}`,
      80,
      600 + line1Height + line2Height + 60,
      600,
      40
    );

    ctx.fillStyle = "#fff";
    ctx.font = "300 26px Bahnschrift";

    ctx.fillText(`#${card["S#"]}`, 650, 1065);

    if (download) {
      downloadImage(canvas, card);
    }
  }
};

export const drawHordeCard = async (card, ctx, canvas, download) => {
  const imgs = await preloadImages([
    `./cards/horde/${card.Distance}.png`,
    "./cards/horde/card.png",
  ]);

  ctx.drawImage(imgs[0], 0, 30, canvas.width, 600);
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

  if (download) {
    downloadImage(canvas, card);
  }
};

export const downloadImage = (canvas, card) => {
  var image = canvas.toDataURL();
  // Create a link
  var aDownloadLink = document.createElement("a");
  // Add the name of the file to the link
  aDownloadLink.download = `${card["S#"]}`;
  // Attach the data to the link
  aDownloadLink.href = image;
  // Get the code to click the download link
  aDownloadLink.click();
};
