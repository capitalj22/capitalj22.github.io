import { useContext, useState } from "react";
import { stateContext } from "../../../providers/state/stateProvider";
import { AppPanel } from "../../layout/appPanel/appPanel";
import { SidebarRight } from "../../layout/right/sidebarRight";

export function RightPanel({ graphEvents$ }) {
  const [selectedItem, setSelectedItem] = useState("info");
  const [menuTitle, setMenuTitle] = useState("info");
  const { appMode } = useContext(stateContext);

  return (
    <SidebarRight title={menuTitle}>
      <AppPanel graphEvents$={graphEvents$} side="right" />
    </SidebarRight>
  );
}
