import { useContext } from "react";
import {
  BookOpen,
  HelpCircle,
  Code,
  List,
  BarChart2,
  Download,
  Edit3,
  Moon,
  Sun,
} from "react-feather";
import { ThemeContext } from "../../../providers/theme.provider";

import "./rightMenu.scss";

export function RightMenu({ itemSelected, selectedItem }) {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <div className="right-menu">
      <button
        type="button"
        className={selectedItem === "sheet" ? "selected" : ""}
        onClick={(e) => itemSelected("sheet")}
      >
        <BookOpen />
      </button>
      <button
        type="button"
        className={selectedItem === "list" ? "selected" : ""}
        onClick={(e) => itemSelected("list")}
      >
        <Edit3 />
      </button>
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
      <button
        onClick={() =>
          setTheme({ type: "set", theme: theme === "light" ? "dark" : "light" })
        }
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </button>
    </div>
  );
}
