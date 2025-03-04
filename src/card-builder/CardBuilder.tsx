import { useEffect, useRef, useState } from "react";
import ExcelFileInput from "./ExcelFileInput";
import { each, find, map, omit, reject, uniq } from "lodash-es";
import "./cardBuilder.scss";

import ImageFileInput from "./imgFileInput";
import { GenericSelect } from "../components/common/selects/genericSelect";
import { SmolButton } from "../components/common/buttons/smolButton";
import { Download, Play, RefreshCcw } from "react-feather";
import { drawHordeCard } from "./card-types/horde";
import { drawBattleCard } from "./card-types/battle";
import { drawSorceryCard } from "./card-types/sorcery";
import { drawSeasonCard } from "./card-types/season";
import { drawTraitorCard } from "./card-types/traitor";
import { drawFortressCard } from "./card-types/fortress";
import { drawManastormCard } from "./card-types/manastorm";
import { drawWorldCard } from "./card-types/world";
import { drawFactionAbilityCard } from "./card-types/faction/ability";
import { drawFactionInfo } from "./card-types/faction/info";

enum CardTypes {
  Battle = "Battle",
  Horde = "Horde",
  Sorcery = "Sorcery",
  Season = "Season",
  Traitor = "Traitor",
  Fortress = "Fortress",
  World = "World",
  ManaStorm = "Manastorm",
  FactionAbility = "Faction Ability",
  FactionAlliance = "Faction Alliance",
  SVC = "Special Victory Condition",
  FactionInfo = "Faction Info",
  Leader = "Leader",
}
export function CardBuilder() {
  const CARD_WIDTH_PRINT = 822,
    CARD_HEIGHT_PRINT = 1122,
    CARD_WIDTH_TTS = 750,
    CARD_HEIGHT_TTS = 1080;

  let canvasRefs = useRef([]);
  const [fileData, setFileData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [output, setOutput] = useState<"print" | "tts">("tts");
  const [cardType, setCardType] = useState("all" as CardTypes | "all");
  const [canvases, setCanvases] = useState([]);
  const [cards, setCards] = useState([]);
  const [cardTypeToDraw, setCardTypeToDraw] = useState("all");
  const [cardsDrawn, setCardsDrawn] = useState(false);

  const options = [
    { value: "all", label: "All" },
    ...map(CardTypes, (val, key) => ({ value: val, label: key })),
  ];

  const outputOptions = [
    { value: "print", label: "Print" },
    { value: "tts", label: "TTS" },
  ];

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  useEffect(() => {
    addCanvases(cards);
  }, [cards]);

  const setupCanvas = (i) => {
    canvas = canvasRefs.current[i];
    if (output === "tts") {
      canvas.width = CARD_WIDTH_TTS;
      canvas.height = CARD_HEIGHT_TTS;
    } else {
      canvas.width = CARD_WIDTH_PRINT;
      canvas.height = CARD_HEIGHT_PRINT;
    }
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
    const cardTypeFuncs = {
      [CardTypes.Battle]: drawBattleCard,
      [CardTypes.Horde]: drawHordeCard,
      [CardTypes.Sorcery]: drawSorceryCard,
      [CardTypes.Season]: drawSeasonCard,
      [CardTypes.Traitor]: drawTraitorCard,
      [CardTypes.Fortress]: drawFortressCard,
      [CardTypes.World]: drawWorldCard,
      [CardTypes.ManaStorm]: drawManastormCard,
      [CardTypes.FactionAbility]: drawFactionAbilityCard,
      [CardTypes.FactionAlliance]: drawFactionAbilityCard,
      [CardTypes.SVC]: drawFactionAbilityCard,
      [CardTypes.FactionInfo]: drawFactionInfo,
      [CardTypes.Leader]: drawBattleCard,
    };
    each(cards, async (card, i) => {
      setupCanvas(i);
      await cardTypeFuncs[card["Type"]].call(
        //@ts-ignore
        this,
        card,
        ctx,
        imageData,
        output
      );

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

    if (fileData?.length) {
      let cardsToDraw = [];

      each(fileData, (sheet) => {
        if (sheet.length) {
          if (sheet[0].Type === cardType || cardType == "all" || !cardType) {
            cardsToDraw = [...cardsToDraw, ...sheet];
          }

          //   case CardTypes.ManaStorm:
          //     if (cardType == "MS" || cardType == "all" || !cardType) {
          //       cardsToDraw = [
          //         ...cardsToDraw,
          //         ...reject(sheet, (card) => {
          //           return [
          //             "Howling Lowlands",
          //             "Cape Hope",
          //             "Paths to the East",
          //             "Ildra",
          //             "Bay of Ytha",
          //             "Khazad Ril",
          //             "Sirion Ria",
          //             "Karaz Zharr",
          //             "Athel Keldri",
          //             "Karaz Okrik",
          //             "Loren Lauroi",
          //             "Athel Tirior",
          //             "Tresamina Playa",
          //           ].includes(card.Title);
          //         }),
          //       ];
          //     }
          //     break;
          // }

          setCards(cardsToDraw);
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

  const outputChanged = (val) => {
    resetCards();
    setOutput(val);
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
            label={"For:"}
            options={outputOptions}
            valueChanged={outputChanged}
          ></GenericSelect>
        </div>
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
        {!!fileData &&
          (!!imageData ||
            cardType === CardTypes.ManaStorm ||
            cardType === CardTypes.FactionAbility ||
            cardType === CardTypes.FactionInfo) &&
          !cardsDrawn && (
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
          <canvas key={i} ref={(ref) => (canvasRefs.current[i] = ref)}></canvas>
        ))}
      </div>
    </div>
  );
}
