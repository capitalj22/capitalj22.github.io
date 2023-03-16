import { useEffect, useState } from "react";
import { LeftMenu } from "./leftMenu";

import "./sidebarLeft.scss";

export function SidebarLeft({ children, itemSelected, expanded }) {
  const [menuExpanded, setMenuExpanded] = useState(true);
  const [menuPropped, setMenuPropped] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);

  const handleItemSelected = (event, page) => {
    if (page === selectedPage || !menuExpanded) {
      // setMenuPropped(!menuPropped);
      setMenuExpanded(!menuExpanded);
    }

    setSelectedPage(page);

    itemSelected(page);
  };

  if (!menuExpanded) {
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
