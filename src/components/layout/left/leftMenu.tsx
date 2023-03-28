import { Disc, Sliders } from "react-feather";

import "./leftMenu.scss";

export function LeftMenu({ itemSelected, selectedItem }) {
  const handleInfoSelected = (event) => itemSelected(event, "info");
  const handleSettingsSelected = (event) => itemSelected(event, "settings");

  return (
    <div className="left-menu">
      <button
        type="button"
        className={selectedItem === "info" ? "selected" : ""}
        onClick={handleInfoSelected}
      >
        <Disc />
      </button>
      <button
        type="button"
        className={selectedItem === "settings" ? "selected" : ""}
        onClick={handleSettingsSelected}
      >
        <Sliders />
      </button>
    </div>
  );
}
