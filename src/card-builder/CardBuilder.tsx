import { useEffect, useRef, useState } from "react";
import ExcelFileInput from "./ExcelFileInput";
import { each, omit, reject } from "lodash-es";
import "./cardBuilder.scss";
import {
  drawBattleCard,
  drawFortressCard,
  drawHordeCard,
  drawManastormCard,
  drawSeasonCard,
  drawSorceryCard,
  drawTraitorCard,
  drawWorldCard,
} from "./card-builders";
import ImageFileInput from "./imgFileInput";
import { GenericSelect } from "../components/common/selects/genericSelect";
import { SmolButton } from "../components/common/buttons/smolButton";
import { Download, Play, RefreshCcw } from "react-feather";

export function CardBuilder() {
  const CARD_WIDTH = 750,
    CARD_HEIGHT = 1080;

  let canvasRefs = useRef([]);
  const [fileData, setFileData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [cardType, setCardType] = useState(
    "all" as "all" | "H" | "S" | "SC" | "B" | "T" | "F" | "MS" | "W"
  );
  const [canvases, setCanvases] = useState([]);
  const [cards, setCards] = useState([]);
  const [cardTypeToDraw, setCardTypeToDraw] = useState("all");
  const [cardsDrawn, setCardsDrawn] = useState(false);

  const options = [
    // { value: "all", label: "All" },
    { value: "H", label: "Horde" },
    { value: "S", label: "Season" },
    { value: "SC", label: "Sorcery" },
    { value: "B", label: "Battle" },
    { value: "T", label: "Traitor" },
    { value: "F", label: "Fortress" },
    { value: "MS", label: "ManaStorm" },
    { value: "W", label: "World" },
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
    if (canvases.length) {
      drawCards();
    } else {
      canvasRefs.current = [];
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
        case "T":
          await drawTraitorCard(card, ctx, canvas, imageData);

          break;
        case "F":
          await drawFortressCard(card, ctx, canvas, imageData);

          break;
        case "MS":
          await drawManastormCard(card, ctx, canvas);

          break;
        case "W":
          await drawWorldCard(card, ctx, canvas, imageData);

          break;
      }

      setCardsDrawn(true);
    });
  };

  const handleFileChanged = (contents) => {
    setFileData(contents);
  };

  const generateCards = () => {
    if (cards.length) {
      resetCards();
      setCardTypeToDraw(null);
      setCardsDrawn(false);
    }

    if ((imageData?.length || cardType === "MS") && fileData?.length) {
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
            case "Traitor":
              if (cardType == "T" || cardType == "all" || !cardType) {
                setCardTypeToDraw("T");
                setCards(sheet);
              }
              break;
            case "Fortress":
              if (cardType == "F" || cardType == "all" || !cardType) {
                setCardTypeToDraw("F");
                setCards(sheet);
              }
              break;
            case "World":
              if (cardType == "W" || cardType == "all" || !cardType) {
                setCardTypeToDraw("W");
                setCards(sheet);
              }
              break;
            case "Mana Storm":
              if (cardType == "MS" || cardType == "all" || !cardType) {
                setCardTypeToDraw("MS");
                setCards(
                  reject(sheet, (card) => {
                    return [
                      "Howling Lowlands",
                      "Cape Hope",
                      "Paths to the East",
                      "Ildra",
                      "Bay of Ytha",
                      "Khazad Ril",
                      "Sirion Ria",
                      "Karaz Zharr",
                      "Athel Keldri",
                      "Karaz Okrik",
                      "Loren Lauroi",
                      "Athel Tirior",
                      "Tresamina Playa",
                    ].includes(card.Title);
                  })
                );
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
    resetCards();
    setCardType(val);
  };

  const downloadImages = () => {
    each(canvasRefs.current, (canvas, i) => {
      var img = canvas.toDataURL();
      var aDownloadLink = document.createElement("a");
      aDownloadLink.download = cards[i]["S#"];
      aDownloadLink.href = img;
      aDownloadLink.click();
    });
  };

  const resetCards = () => {
    canvasRefs.current = [];
    setCanvases([]);
    setCards([]);
    setCardsDrawn(false);
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
        {!!fileData && (!!imageData || cardType === "MS") && !cardsDrawn && (
          <SmolButton type="info" clicked={generateCards}>
            <Play />
            Generate Cards
          </SmolButton>
        )}

        {!!cardsDrawn && (
          <SmolButton type="info" clicked={resetCards}>
            <RefreshCcw />
            Reset
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
      </div>
    </div>
  );
}
