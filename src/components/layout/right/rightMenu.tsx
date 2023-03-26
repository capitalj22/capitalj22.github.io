import { useContext } from "react";
import {
  BookOpen,
  HelpCircle,
  Download,
  Edit3,
  Moon,
  Sun,
  Edit,
  User,
  Book,
  Zap,
} from "react-feather";
import { stateContext } from "../../../providers/state/stateProvider";
import { ThemeContext } from "../../../providers/theme.provider";
import { SmolButton } from "../../common/buttons/smolButton";

import "./rightMenu.scss";

export function RightMenu({ itemSelected, selectedItem }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const { appMode, setAppMode, buildMode, setBuildMode } =
    useContext(stateContext);

  const zapClicked = () => {
    if (buildMode === "build-fast") {
      setBuildMode("build-slow");
      setAppMode("build-slow");
    } else {
      setAppMode("build-fast");
      setBuildMode("build-fast");
    }
  };
  return (
    <div className="right-menu">
      {appMode === "build-slow" || appMode === "build-fast" ? (
        <button
          type="button"
          className={selectedItem === "sheet" ? "selected" : ""}
          onClick={(e) => itemSelected("sheet")}
        >
          <BookOpen />
        </button>
      ) : (
        <button
          type="button"
          className={selectedItem === "sheet" ? "selected" : ""}
          onClick={(e) => itemSelected("sheet")}
        >
          <Book />
        </button>
      )}
      <button
        type="button"
        className={selectedItem === "code" ? "selected" : ""}
        onClick={(e) => itemSelected("code")}
      >
        <Download />
      </button>
      <button
        type="button"
        className={selectedItem === "help" ? "selected" : ""}
        onClick={(e) => itemSelected("help")}
      >
        <HelpCircle />
      </button>
      <hr />
      <SmolButton
        color="info"
        clicked={() =>
          setTheme({ type: "set", theme: theme === "light" ? "dark" : "light" })
        }
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </SmolButton>
      <SmolButton
        color={buildMode === "build-fast" ? "success" : "mutedText"}
        clicked={zapClicked}
      >
        <Zap />
      </SmolButton>
      <SmolButton
        color={appMode === "edit" ? "success" : "mutedText"}
        clicked={() => setAppMode(appMode === "edit" ? buildMode : "edit")}
      >
        <Edit />
      </SmolButton>
    </div>
  );
}
