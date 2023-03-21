import { BookOpen, HelpCircle, Code, List, BarChart2 } from "react-feather";

import "./rightMenu.scss";

export function RightMenu({ itemSelected }) {
  return (
    <div className="right-menu">
      <button type="button" onClick={(e) => itemSelected("sheet")}>
        <BookOpen />
      </button>
      <button type="button" onClick={(e) => itemSelected("code")}>
        <Code />
      </button>
      <button type="button" onClick={(e) => itemSelected("list")}>
        <List />
      </button>
      <button type="button" onClick={(e) => itemSelected("stats")}>
        <BarChart2 />
      </button>
      <button type="button" onClick={(e) => itemSelected("help")}>
        <HelpCircle />
      </button>
    </div>
  );
}
