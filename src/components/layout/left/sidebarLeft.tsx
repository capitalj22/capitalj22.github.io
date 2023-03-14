import { useState } from "react";
import { LeftMenu } from "./leftMenu";

import "./sidebarLeft.scss";

export function SidebarLeft({ children, itemSelected }) {
  const [expanded, setExpanded] = useState(true);
  const [selectedPage, setSelectedPage] = useState(null);

  const handleItemSelected = (event, page) => {
    if (page === selectedPage || !expanded) {
      setExpanded(!expanded);
    }
    setSelectedPage(page);

    itemSelected(page);
  };

  if (!expanded) {
    return (
      <div className="sidebar-left">
        <LeftMenu itemSelected={handleItemSelected}></LeftMenu>
      </div>
    );
  } else
    return (
      <div className="sidebar-left">
        <LeftMenu itemSelected={handleItemSelected}></LeftMenu>
        <div className="sidebar-left-panel">{children}</div>
      </div>
    );
}
