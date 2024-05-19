import { useEffect, useRef, useState } from "react";
import ExcelFileInput from "./ExcelFileInput";
import { each } from "lodash-es";
import "./cardBuilder.scss";
import {
  drawBattleCard,
  drawHordeCard,
  drawSeasonCard,
  drawSorceryCard,
} from "./card-builders";
import ImageFileInput from "./imgFileInput";
import { GenericSelect } from "../components/common/selects/genericSelect";

export function CardBuilder() {
  const [fileData, setFileData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [cardType, setCardType] = useState(
    "all" as "all" | "H" | "S" | "SC" | "B"
  );

  const options = [
    { value: "all", label: "All" },
    { value: "H", label: "Horde" },
    { value: "S", label: "Season" },
    { value: "SC", label: "Sorcery" },
    { value: "B", label: "Battle" },
  ];

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

  const drawBattleCards = async (cards, imageData) => {
    each(cards, async (card) => {
      setupCanvas();
      drawBattleCard(card, ctx, canvas, imageData, DOWNLOAD);
    });
  };

  const drawSorceryCards = async (cards, imageData) => {
    setupCanvas();

    each(cards, async (card) => {
      drawSorceryCard(card, ctx, canvas, imageData, DOWNLOAD);
    });
  };

  const drawSeasonCards = async (cards, imageData) => {
    setupCanvas();

    each(cards, async (card) => {
      drawSeasonCard(card, ctx, canvas, imageData, DOWNLOAD);
    });
  };

  const drawHordeCards = async (cards, imageData) => {
    setupCanvas();

    each(cards, async (card) => {
      drawHordeCard(card, ctx, canvas, imageData, DOWNLOAD);
    });
  };

  useEffect(() => {
    canvas = canvasRef.current;
    canvas.width = 750;
    canvas.height = 1080;
    ctx = canvas.getContext("2d");
  }, [canvasRef]);

  const doTheThing = () => {
    if (imageData?.length && fileData?.length) {
      each(fileData, (sheet) => {
        if (sheet.length) {
          switch (sheet[0].Type) {
            case "Horde":
              if (cardType == "H" || cardType == "all" || !cardType) {
                drawHordeCards(sheet, imageData);
              }
              break;
            case "Sorcery":
              if (cardType == "SC" || cardType == "all" || !cardType) {
                drawSorceryCards(sheet, imageData);
              }
              break;
            case "Season":
              if (cardType == "S" || cardType == "all" || !cardType) {
                drawSeasonCards(sheet, imageData);
              }
              drawSeasonCards(sheet, imageData);
              break;
            case "Battle":
              if (cardType == "B" || cardType == "all" || !cardType) {
                drawBattleCards(sheet, imageData);
              }
              break;
          }
        }
      });
    }
  };

  const handleImgsChanged = (images) => {
    setImageData(images);
  };

  const typeUpdated = (val) => {
    setCardType(val);
  };

  return (
    <div>
      <GenericSelect
        // styles={selectStyles()}
        options={options}
        valueChanged={typeUpdated}
      ></GenericSelect>

      <ExcelFileInput label="sheets" fileChanged={handleFileChanged} />
      <ImageFileInput label="imgs" uploaded={handleImgsChanged} />
      <button onClick={doTheThing}>Do the Thing</button>
      <canvas id="card-canvas" ref={canvasRef} />
    </div>
  );
}
