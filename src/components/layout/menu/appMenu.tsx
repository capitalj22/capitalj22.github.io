import { useContext, useState } from "react";
import {
  BookOpen,
  HelpCircle,
  Download,
  Moon,
  Sun,
  Edit,
  Book,
  Zap,
  Users,
  Disc,
  Sliders,
} from "react-feather";
import { stateContext } from "../../../providers/state/stateProvider";
import { ThemeContext } from "../../../providers/theme.provider";
import { SmolButton } from "../../common/buttons/smolButton";
import "./appMenu.scss";

export function AppMenu({ side = "left", changed }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const {
    appMode,
    setAppMode,
    buildMode,
    setBuildMode,
    appMenuConfig,
    setAppMenuConfig,
    selectedMenus,
    setSelectedMenus,
  } = useContext(stateContext);
  const zapClicked = () => {
    if (buildMode === "build-fast") {
      setBuildMode("build-slow");
      setAppMode("build-slow");
    } else {
      setAppMode("build-fast");
      setBuildMode("build-fast");
    }
  };

  const itemClicked = (e, item) => {
    const newMenus = { ...selectedMenus };
    newMenus[side] = item;

    if (e.shiftKey) {
      console.log("setItem");
      setAppMenuConfig({
        type: "setItem",
        item: { [item]: side === "left" ? "right" : "left" },
      });
    }

    changed({ newItem: item !== selectedMenus[side] });
    setSelectedMenus(newMenus);
  };

  return (
    <div className="app-menu">
      {appMenuConfig.info === side && (
        <button
          type="button"
          className={selectedMenus[side] === "info" ? "selected" : ""}
          onClick={(e) => itemClicked(e, "info")}
        >
          <Disc />
        </button>
      )}
      {appMenuConfig.sheet === side &&
        (appMode === "build-slow" || appMode === "build-fast" ? (
          <button
            type="button"
            className={selectedMenus[side] === "sheet" ? "selected" : ""}
            onClick={(e) => itemClicked(e, "sheet")}
          >
            <BookOpen />
          </button>
        ) : (
          <button
            type="button"
            className={selectedMenus[side] === "sheet" ? "selected" : ""}
            onClick={(e) => itemClicked(e, "sheet")}
          >
            <Book />
          </button>
        ))}
      {appMenuConfig.units === side && (
        <button
          type="button"
          className={selectedMenus[side] === "units" ? "selected" : ""}
          onClick={(e) => itemClicked(e, "units")}
        >
          <Users />
        </button>
      )}
      {appMenuConfig.settings === side && (
        <button
          type="button"
          className={selectedMenus[side] === "settings" ? "selected" : ""}
          onClick={(e) => itemClicked(e, "settings")}
        >
          <Sliders />
        </button>
      )}
      {appMenuConfig.code === side && (
        <button
          type="button"
          className={selectedMenus[side] === "code" ? "selected" : ""}
          onClick={(e) => itemClicked(e, "code")}
        >
          <Download />
        </button>
      )}
      {appMenuConfig.help === side && (
        <button
          type="button"
          className={selectedMenus[side] === "help" ? "selected" : ""}
          onClick={(e) => itemClicked(e, "help")}
        >
          <HelpCircle />
        </button>
      )}

      <hr />
      {appMenuConfig.theme === side && (
        <SmolButton
          color="info"
          clicked={() =>
            setTheme({
              type: "set",
              theme: theme === "light" ? "dark" : "light",
            })
          }
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </SmolButton>
      )}
      {appMenuConfig.zap === side && (
        <SmolButton
          color={buildMode === "build-fast" ? "success" : "mutedText"}
          clicked={zapClicked}
        >
          <Zap />
        </SmolButton>
      )}
      {appMenuConfig.edit === side && (
        <SmolButton
          color={appMode === "edit" ? "success" : "mutedText"}
          clicked={() => setAppMode(appMode === "edit" ? buildMode : "edit")}
        >
          <Edit />
        </SmolButton>
      )}
    </div>
  );
}
