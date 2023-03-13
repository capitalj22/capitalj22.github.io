import { useState } from "react";
import { BookOpen, Camera } from "react-feather";
import { RightMenu } from "./rightMenu";

import "./sidebarRight.scss";

export function SidebarRight({ children }) {
  const [expanded, setExpanded] = useState(false);

  const handleItemSelected = (event) => {
    setExpanded(!expanded);
  };

  if (!expanded) {
    return (
      <div className="sidebar-right">
        <RightMenu itemSelected={handleItemSelected}></RightMenu>
      </div>
    );
  } else
    return (
      <div className="sidebar-right">
        <div className="sidebar-right-panel">{children}</div>
        <RightMenu itemSelected={handleItemSelected}></RightMenu>
      </div>
    );
}
