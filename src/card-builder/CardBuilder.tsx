import { useEffect, useRef, useState } from "react";
import ExcelFileInput from "./ExcelFileInput";
import { each, times } from "lodash-es";
import "./cardBuilder.scss";
import {
  drawBattleCard,
  drawHordeCard,
  drawSeasonCard,
  drawSorceryCard,
} from "./card-builders";
import ImageFileInput from "./imgFileInput";
import { GenericSelect } from "../components/common/selects/genericSelect";
import { BigButton } from "../components/common/buttons/bigButton";
import { SmolButton } from "../components/common/buttons/smolButton";
import { Download, Edit, Play } from "react-feather";

export function CardBuilder() {
  const CARD_WIDTH = 750,
    CARD_HEIGHT = 1080;

  let canvasRefs = useRef([]);
  const [fileData, setFileData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [cardType, setCardType] = useState(
    "all" as "all" | "H" | "S" | "SC" | "B"
  );
  const [canvases, setCanvases] = useState([]);
  const [cards, setCards] = useState([]);
  const [cardTypeToDraw, setCardTypeToDraw] = useState("all");
  const [cardsLoading, setCardsLoading] = useState(false);

  const options = [
    { value: "all", label: "All" },
    { value: "H", label: "Horde" },
    { value: "S", label: "Season" },
    { value: "SC", label: "Sorcery" },
    { value: "B", label: "Battle" },
  ];

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  useEffect(() => {
    addCanvases(cards);
  }, [cards]);

  const setupCanvas = (i) => {
    canvas = canvasRefs.current[i];
    canvas.width = CARD_WIDTH;
    canvas.height = CARD_HEIGHT;
    ctx = canvas.getContext("2d");
  };

  const addCanvases = (cards) => {
    let newCanvases = [];
    each(cards, (card) => {
      newCanvases.push({ key: card["S#"] });
    });
    setCanvases([...canvases, ...newCanvases]);
  };

  useEffect(() => {
    if (canvasRefs.current?.length) {
      drawCards();
    }
  }, [canvases]);

  const drawCards = async () => {
    each(cards, async (card, i) => {
      setupCanvas(i);
      switch (cardTypeToDraw) {
        case "B":
          await drawBattleCard(card, ctx, canvas, imageData);

          break;
        case "H":
          drawHordeCard(card, ctx, canvas, imageData);

          break;
        case "SC":
          await drawSorceryCard(card, ctx, canvas, imageData);

          break;
        case "S":
          await drawSeasonCard(card, ctx, canvas, imageData);

          break;
      }
    });
  };

  const handleFileChanged = (contents) => {
    setFileData(contents);
  };

  const doTheThing = () => {
    if (imageData?.length && fileData?.length) {
      each(fileData, (sheet) => {
        if (sheet.length) {
          switch (sheet[0].Type) {
            case "Horde":
              if (cardType == "H" || cardType == "all" || !cardType) {
                setCardTypeToDraw("H");
                setCards(sheet);
              }
              break;
            case "Sorcery":
              if (cardType == "SC" || cardType == "all" || !cardType) {
                setCardTypeToDraw("SC");
                setCards(sheet);
              }
              break;
            case "Season":
              if (cardType == "S" || cardType == "all" || !cardType) {
                setCardTypeToDraw("S");
                setCards(sheet);
              }
              break;
            case "Battle":
              if (cardType == "B" || cardType == "all" || !cardType) {
                setCardTypeToDraw("B");
                setCards(sheet);
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
    setCanvases([]);
    setCardType(val);
  };

  const downloadImages = () => {
    each(canvasRefs.current, (canvas, i) => {
      var img = canvas.toDataURL();
      var aDownloadLink = document.createElement("a");
      // Add the name of the file to the link
      aDownloadLink.download = cards[i]["S#"];
      // Attach the data to the link
      aDownloadLink.href = img;
      // Get the code to click the download link
      aDownloadLink.click();
    });

    // Create a link
  };

  return (
    <div>
      <div className="options">
        <div className="card-type-select">
          <GenericSelect
            // styles={selectStyles()}
            label={"Card Type"}
            options={options}
            valueChanged={typeUpdated}
          ></GenericSelect>
        </div>
        <ExcelFileInput label="Sheet" fileChanged={handleFileChanged} />
        <ImageFileInput label="Images" uploaded={handleImgsChanged} />
        {!!fileData && !!imageData && (
          <SmolButton type="info" clicked={doTheThing}>
            <Play />
            Generate Cards
          </SmolButton>
        )}
        {!!cards.length && (
          <SmolButton clicked={downloadImages} type="success">
            <Download />
            Download
          </SmolButton>
        )}
      </div>
      <div className="canvases">
        {canvases.map((el, i) => (
          <canvas
            key={el.key}
            ref={(ref) => (canvasRefs.current[i] = ref)}
          ></canvas>
        ))}
        <canvas id="card-canvas" />
      </div>
    </div>
  );
}
