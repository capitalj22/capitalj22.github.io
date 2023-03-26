import { Disc, Sliders } from "react-feather";

import "./leftMenu.scss";

export function LeftMenu({ itemSelected }) {
  const handleInfoSelected = (event) => itemSelected(event, "info");
  const handleSettingsSelected = (event) => itemSelected(event, "settings");

  return (
    <div className="left-menu">
      <button type="button" onClick={handleInfoSelected}>
        <Disc />
      </button>
      <button type="button" onClick={handleSettingsSelected}>
        <Sliders />
      </button>
    </div>
  );
}
