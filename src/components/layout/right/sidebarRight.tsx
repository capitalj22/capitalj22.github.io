import classNames from "classnames";
import { useContext, useState } from "react";
import { ChevronsLeft, ChevronsRight } from "react-feather";
import { stateContext } from "../../../providers/state/stateProvider";
import { AppMenu } from "../menu/appMenu";

import "./sidebarRight.scss";

export function SidebarRight({ children, title }) {
  const { leftExpanded, setLeftExpanded, rightExpanded, setRightExpanded } =
    useContext(stateContext);
  const [panelExpanded, setPanelExpanded] = useState(false);

  let icon;

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
