import { BookOpen, Info, Code } from "react-feather";

import "./leftMenu.scss";

export function LeftMenu({ itemSelected }) {
  const handleInfoSelected = (event) => itemSelected(event, "info");

  return (
    <div className="left-menu">
      <button type="button" onClick={handleInfoSelected}>
        <Info />
      </button>
    </div>
  );
}
