import { BookOpen, Info } from "react-feather";

import "./rightMenu.scss";

export function RightMenu({ itemSelected }) {
  const handleSheetSelected = (event) => itemSelected(event, "sheet");
  const handleInfoSelected = (event) => itemSelected(event, "info");

  return (
    <div className="right-menu">
      <button type="button" onClick={handleInfoSelected}>
        <Info />
      </button>
      <button type="button" onClick={handleSheetSelected}>
        <BookOpen />
      </button>
    </div>
  );
}
