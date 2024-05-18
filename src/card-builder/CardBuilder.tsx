import { useEffect, useRef, useState } from "react";
import FileInput from "./FileInput";
import { each } from "lodash-es";
import { scaleText, wrapText } from "./utils";
import "./cardBuilder.scss";
import {
  drawBattleCard,
  drawHordeCard,
  drawSeasonCard,
  drawSorceryCard,
} from "./card-builders";

export function CardBuilder() {
  const [fileData, setFileData] = useState(null);

  const DOWNLOAD = true;

  const canvasRef = useRef(null);
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  const setupCanvas = () => {
    canvas = canvasRef.current;
    canvas.width = 750;
    canvas.height = 1080;
    ctx = canvas.getContext("2d");
  };

  const handleFileChanged = (contents) => {
    setFileData(contents);
  };

  const drawBattleCards = async (cards) => {
    each(cards, async (card) => {
      setupCanvas();
      drawBattleCard(card, ctx, canvas, DOWNLOAD);
    });
  };

  const drawSorceryCards = async (cards) => {
    setupCanvas();

    each(cards, async (card) => {
      drawSorceryCard(card, ctx, canvas, DOWNLOAD);
    });
  };

  const drawSeasonCards = async (cards) => {
    setupCanvas();

    each(cards, async (card) => {
      drawSeasonCard(card, ctx, canvas, DOWNLOAD);
    });
  };

  const drawHordeCards = async (cards) => {
    setupCanvas();

    each(cards, async (card) => {
      drawHordeCard(card, ctx, canvas, DOWNLOAD);
    });
  };

  useEffect(() => {
    canvas = canvasRef.current;
    canvas.width = 750;
    canvas.height = 1080;
    ctx = canvas.getContext("2d");
  }, [canvasRef]);

  useEffect(() => {
    if (fileData?.length) {
      each(fileData, (sheet) => {
        if (sheet.length) {
          switch (sheet[0].Type) {
            case "Horde":
              // drawHordeCards(sheet);
              break;
            case "Sorcery":
              // drawSorceryCards(sheet);
              break;
            case "Season":
              drawSeasonCards(sheet);
              break;
            case "Battle":
              // drawBattleCards(sheet);
              break;
          }
        }
      });
    }
  }, [fileData]);

  return (
    <div>
      <FileInput fileChanged={handleFileChanged} />
      <canvas id="card-canvas" ref={canvasRef} />
    </div>
  );
}
