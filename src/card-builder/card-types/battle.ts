import { find } from "lodash-es";
import { preloadImagesNamed, scaleText } from "../utils";
import { drawFrameAndImage } from "../utils/img-utils";
import {
  drawCardNumber,
  drawCardQuantity,
  drawText,
  drawTitle,
  setFont,
} from "../utils/text-utils";
import { CardFont, Fill, Fonts } from "../utils/card-builder.constants";
import { addBattleBadges, getSigil } from "../utils/decoration-utils";
import { CardDrawParams } from "./constants";

const effectFont: CardFont = {
  fill: Fill.dark,
  font: Fonts.Ns,
  size: 33,
  weight: 300,
};

export const drawBattleCard = async (params: CardDrawParams) => {
  let { card, ctx, imageData, output, lookupData } = params;

  const offset = output === "print" ? 36 : 0;
  const printOffset = {
    x: output === "print" ? 36 : 0,
    y: output === "print" ? 16 : 0,
  };

  const factionData = find(lookupData, { FactionNicknames: card["Faction"] });

  const imgs = await preloadImagesNamed({
    art: find(imageData, { cardNumber: card["S#"] })?.url,
    diagram: find(imageData, { name: `${card["S#"]}_diagram.png` })?.url,
    frame: "./cards/battle/card.png",
    RPS: "./cards/battle/RPS.png",
    roundBadge: "./cards/battle/badge_R.png",
    battleBadge: "./cards/battle/badge_1.png",
    costbadge: "./cards/battle/badge_Leadership.png",
    factionSigil: find(imageData, { name: `${card["Faction"]}_sigil.png` })
      ?.url,
  });

  await drawFrameAndImage(
    ctx,
    { art: imgs.art, frame: imgs.frame },
    { output }
  );
  await addBattleBadges(card, ctx, output);

  if (card.Faction) {
    ctx.beginPath();
    ctx.arc(680, 70, 70, 0, 2 * Math.PI, false);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#black";
    ctx.stroke();

    ctx.drawImage(
      imgs.factionSigil,
      620 + printOffset.x,
      10 + printOffset.y,
      120,
      120
    );
  }

  // if (card.Subtype === "Weapon") {
  //   ctx.drawImage(imgs.RPS, 540 + offset, 880, 160, 160);
  // }
  ctx.drawImage(imgs.costbadge, 65, 440, 130, 130);

  if (imgs.diagram) {
    ctx.drawImage(imgs.diagram, 200, 675, 350 , 360);
  }

  setFont(ctx, {
    ...effectFont,
    fill: Fill.white,
    size: 55,
    strokeColor: "#000000a0" as any,
    strokeSize: 6,
  });

  ctx.strokeText(card["Leadership Cost"], 115, 520);
  ctx.fillText(card["Leadership Cost"], 115, 520);
  if (card["Once Per"] === "Round") {
    ctx.drawImage(imgs.roundBadge, -15, 440, 130, 130);
  }
  if (card["Once Per"] === "Battle") {
    ctx.drawImage(imgs.battleBadge, -15, 440, 130, 130);
  }
  drawTitle(ctx, card.Title, { fill: Fill.dark, output, xOffset: 115 });

  drawText(
    ctx,
    [
      {
        text: card["Choose"]
          ? `Choose ${card.Choose} of the following:`
          : undefined,
        font: {
          font: Fonts.Bs,
          fill: Fill.hordeDark,
          weight: 500,
          size: 34,
        },
      },
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
      x: 80 + 36,
      yStart: 650,
      maxWidth: 600,
    }
  );

  drawCardNumber(ctx, card, output);
  drawCardQuantity(ctx, card, output);
};
