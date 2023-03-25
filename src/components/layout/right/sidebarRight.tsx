import classNames from "classnames";
import { useContext, useState } from "react";
import { ChevronsLeft, ChevronsRight } from "react-feather";
import { stateContext } from "../../../providers/state/stateProvider";
import { RightMenu } from "./rightMenu";

import "./sidebarRight.scss";

export function SidebarRight({ children, itemSelected, title }) {
  const [selectedPage, setSelectedPage] = useState(null);
  const { leftExpanded, setLeftExpanded, rightExpanded, setRightExpanded } =
    useContext(stateContext);
  const [panelExpanded, setPanelExpanded] = useState(true);

  let icon;

  const handleItemSelected = (page) => {
    if (page === selectedPage || !rightExpanded) {
      setRightExpanded(!rightExpanded);
    }
    setSelectedPage(page);

    itemSelected(page);
  };

  const handleExpandPressed = (event) => {
    setPanelExpanded(!panelExpanded);
  };

  icon = !panelExpanded ? <ChevronsLeft /> : <ChevronsRight />;
  if (!rightExpanded) {
    return (
      <div className="sidebar-right">
        <RightMenu
          itemSelected={handleItemSelected}
          selectedItem={undefined}
        ></RightMenu>
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
        <RightMenu
          itemSelected={handleItemSelected}
          selectedItem={selectedPage}
        ></RightMenu>
      </div>
    );
}
