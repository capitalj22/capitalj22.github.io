import { Disc, Edit, Info, Settings } from "react-feather";

import "./leftMenu.scss";

export function LeftMenu({ itemSelected }) {
  const handleInfoSelected = (event) => itemSelected(event, "info");
  const handleSettingsSelected = (event) => itemSelected(event, "settings");
  const handleEditSelected = (event) => itemSelected(event, "edit");

  return (
    <div className="left-menu">
      <button type="button" onClick={handleInfoSelected}>
        <Disc />
      </button>
      <button type="button" onClick={handleSettingsSelected}>
        <Settings />
      </button>
    </div>
  );
}
