import { BookOpen, HelpCircle, Code, List, BarChart2, Download, Edit3 } from "react-feather";

import "./rightMenu.scss";

export function RightMenu({ itemSelected, selectedItem }) {
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
    </div>
  );
}
