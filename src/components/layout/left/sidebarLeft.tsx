import { useContext, useEffect, useState } from "react";
import { stateContext } from "../../../providers/state/stateProvider";
import { LeftMenu } from "./leftMenu";

import "./sidebarLeft.scss";

export function SidebarLeft({ children, itemSelected, expanded }) {
  const [selectedPage, setSelectedPage] = useState(null);
  const { leftExpanded, setLeftExpanded, rightExpanded, setRightExpanded } =
    useContext(stateContext);

  const handleItemSelected = (event, page) => {
    if (page === selectedPage || !leftExpanded) {
      setLeftExpanded(!leftExpanded);
    }

    setSelectedPage(page);

    itemSelected(page);
  };

  if (!leftExpanded) {
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
