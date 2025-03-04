import { preloadImages, wrapText } from "../../utils";
import { defaultImages } from "../../utils/card-builder.constants";
import { getSigil } from "../../utils/decoration-utils";

export const drawFactionInfo = async (card, ctx, imageData = {}, output) => {
  ctx.canvas.width = 2250;

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
    ctx.canvas.width,
    ctx.canvas.height
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
