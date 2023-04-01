import { useContext, useEffect, useState } from "react";
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
    rightExpanded,
    leftExpanded,
  } = useContext(stateContext);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (side === "left") {
      setIsOpen(!!leftExpanded);
    } else {
      setIsOpen(!!rightExpanded);
    }
  }, [rightExpanded, leftExpanded]);

  const switchItem = (item) => {
    setAppMenuConfig({
      type: "setItem",
      item: { [item]: side === "left" ? "right" : "left" },
    });
  };

  const itemClicked = (e, item) => {
    const newMenus = { ...selectedMenus };
    newMenus[side] = item;

    if (e.shiftKey) {
      switchItem(item);
    } else {
      if (item === "zap") {
        if (buildMode === "build-fast") {
          setBuildMode("build-slow");
          setAppMode("build-slow");
        } else {
          setAppMode("build-fast");
          setBuildMode("build-fast");
        }
      } else if (item === "theme") {
        setTheme({
          type: "set",
          theme: theme === "light" ? "dark" : "light",
        });
      } else if (item === "edit") {
        setAppMode(appMode === "edit" ? buildMode : "edit");
      } else {
        changed({ newItem: item !== selectedMenus[side] });
        setSelectedMenus(newMenus);
      }
    }
  };

  return (
    <div className="app-menu">
      {appMenuConfig.info === side && (
        <button
          type="button"
          className={isOpen && selectedMenus[side] === "info" ? "selected" : ""}
          onClick={(e) => itemClicked(e, "info")}
        >
          <Disc />
        </button>
      )}
      {appMenuConfig.sheet === side &&
        (appMode === "build-slow" || appMode === "build-fast" ? (
          <button
            type="button"
            className={
              isOpen && selectedMenus[side] === "sheet" ? "selected" : ""
            }
            onClick={(e) => itemClicked(e, "sheet")}
          >
            <BookOpen />
          </button>
        ) : (
          <button
            type="button"
            className={
              isOpen && selectedMenus[side] === "sheet" ? "selected" : ""
            }
            onClick={(e) => itemClicked(e, "sheet")}
          >
            <Book />
          </button>
        ))}
      {appMenuConfig.units === side && (
        <button
          type="button"
          className={
            isOpen && selectedMenus[side] === "units" ? "selected" : ""
          }
          onClick={(e) => itemClicked(e, "units")}
        >
          <Users />
        </button>
      )}
      {appMenuConfig.settings === side && (
        <button
          type="button"
          className={
            isOpen && selectedMenus[side] === "settings" ? "selected" : ""
          }
          onClick={(e) => itemClicked(e, "settings")}
        >
          <Sliders />
        </button>
      )}
      {appMenuConfig.code === side && (
        <button
          type="button"
          className={isOpen && selectedMenus[side] === "code" ? "selected" : ""}
          onClick={(e) => itemClicked(e, "code")}
        >
          <Download />
        </button>
      )}
      {appMenuConfig.help === side && (
        <button
          type="button"
          className={isOpen && selectedMenus[side] === "help" ? "selected" : ""}
          onClick={(e) => itemClicked(e, "help")}
        >
          <HelpCircle />
        </button>
      )}

      <hr />
      {appMenuConfig.theme === side && (
        <SmolButton color="info" clicked={(e) => itemClicked(e, "theme")}>
          {theme === "light" ? <Moon /> : <Sun />}
        </SmolButton>
      )}
      {appMenuConfig.zap === side && (
        <SmolButton
          color={buildMode === "build-fast" ? "success" : "mutedText"}
          clicked={(e) => itemClicked(e, "zap")}
        >
          <Zap />
        </SmolButton>
      )}
      {appMenuConfig.edit === side && (
        <SmolButton
          color={appMode === "edit" ? "success" : "mutedText"}
          clicked={(e) => itemClicked(e, "edit")}
        >
          <Edit />
        </SmolButton>
      )}
    </div>
  );
}
