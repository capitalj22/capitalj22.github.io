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
} from "react-feather";
import { stateContext } from "../../../providers/state/stateProvider";
import { ThemeContext } from "../../../providers/theme.provider";
import { SmolButton } from "../../common/buttons/smolButton";

import "./rightMenu.scss";

export function RightMenu({ itemSelected, selectedItem }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const { appMode, setAppMode } = useContext(stateContext);
  return (
    <div className="right-menu">
      {appMode === "build" ? (
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
      <button
        onClick={() =>
          setTheme({ type: "set", theme: theme === "light" ? "dark" : "light" })
        }
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </button>
      <SmolButton
        color={appMode === "edit" ? "success" : "theme"}
        clicked={() => setAppMode(appMode === "edit" ? "build" : "edit")}
      >
        <Edit />
      </SmolButton>
    </div>
  );
}
