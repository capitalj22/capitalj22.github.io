import classNames from "classnames";
import { useContext, useEffect, useState } from "react";
import { ChevronsLeft, ChevronsRight } from "react-feather";
import { stateContext } from "../../../providers/state/stateProvider";
import { AppMenu } from "../menu/appMenu";

const PAGE_TITLES_BUILD = {
  sheet: "Character Sheet",
  code: "Save/Import",
  help: "Reference",
  units: "Units",
};

const PAGE_TITLES_EDIT = {
  sheet: "Edit Items",
  code: "Save/Import",
  help: "Reference",
  units: "Units",
};

import "./sidebarRight.scss";

export function SidebarRight({ children }) {
  const {
    leftExpanded,
    rightExpanded,
    setRightExpanded,
    selectedMenus,
    appMode,
  } = useContext(stateContext);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [title, setTitle] = useState("Character Sheet");

  let icon;

  useEffect(() => {
    if (appMode === "edit") {
      setTitle(PAGE_TITLES_EDIT[selectedMenus.right]);
    } else {
      setTitle(PAGE_TITLES_BUILD[selectedMenus.right]);
    }
  }, [selectedMenus, appMode]);

  const handleItemSelected = (event) => {
    if (event.newItem) {
      setRightExpanded(true);
    } else {
      setRightExpanded(!rightExpanded);
    }
  };

  const handleExpandPressed = (event) => {
    setPanelExpanded(!panelExpanded);
  };

  icon = !panelExpanded ? <ChevronsLeft /> : <ChevronsRight />;

  if (!rightExpanded) {
    return (
      <div className="sidebar-right">
        <AppMenu changed={handleItemSelected} side="right"></AppMenu>
      </div>
    );
  } else
    return (
      <div className="sidebar-right expanded">
        <div
          className={classNames({
            "sidebar-right-panel": true,
            full: panelExpanded,
            partial: rightExpanded,
            "minus-right": leftExpanded,
          })}
        >
          <div
            onClick={handleExpandPressed}
            className="sidebar-right-panel-heading"
          >
            <button className="expander">{icon}</button>
            {title}
          </div>
          <div className="sidebar-right-panel-content">{children}</div>
        </div>
        <AppMenu changed={handleItemSelected} side="right"></AppMenu>
      </div>
    );
}
