import { useContext } from "react";
import { stateContext } from "../../../providers/state/stateProvider";
import { AppMenu } from "../menu/appMenu";

import "./sidebarLeft.scss";

export function SidebarLeft({ children }) {
  const { leftExpanded, setLeftExpanded } =
    useContext(stateContext);

  const handleItemSelected = (event) => {
    if (event.newItem) {
      setLeftExpanded(true);
    } else {
      setLeftExpanded(!leftExpanded);
    }
  };

  if (!leftExpanded) {
    return (
      <div className="sidebar-left">
        <AppMenu changed={handleItemSelected} side="left"></AppMenu>
      </div>
    );
  } else
    return (
      <div className="sidebar-left">
        <AppMenu changed={handleItemSelected} side="left"></AppMenu>
        <div className="sidebar-left-panel">{children}</div>
      </div>
    );
}
