import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "react-feather";
import { RightMenu } from "./rightMenu";

import "./sidebarRight.scss";

export function SidebarRight({ children, itemSelected, title }) {
  const [expanded, setExpanded] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);

  let icon;

  const handleItemSelected = (page) => {
    if (page === selectedPage || !expanded) {
      setExpanded(!expanded);
    }
    setSelectedPage(page);

    itemSelected(page);
  };

  const handleExpandPressed = (event) => {
    setPanelExpanded(!panelExpanded);
  };

  icon = !panelExpanded ? <ChevronsLeft /> : <ChevronsRight />;
  if (!expanded) {
    return (
      <div className="sidebar-right">
        <RightMenu itemSelected={handleItemSelected} selectedItem={undefined}></RightMenu>
      </div>
    );
  } else
    return (
      <div className="sidebar-right expanded">
        <div
          className={
            panelExpanded
              ? "sidebar-right-panel full"
              : "sidebar-right-panel partial"
          }
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
        <RightMenu itemSelected={handleItemSelected} selectedItem={selectedPage}></RightMenu>
      </div>
    );
}
