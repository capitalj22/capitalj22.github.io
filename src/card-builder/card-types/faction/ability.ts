import { each } from "lodash-es";
import { centerText, preloadImages, scaleText, wrapText } from "../../utils";
import { defaultImages } from "../../utils/card-builder.constants";
import { getSigil } from "../../utils/decoration-utils";

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
  