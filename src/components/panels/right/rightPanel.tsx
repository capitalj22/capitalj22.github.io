import { useState } from "react";

import { AppPanel } from "../../layout/appPanel/appPanel";
import { SidebarRight } from "../../layout/right/sidebarRight";

export function RightPanel({ graphEvents$ }) {
  const [menuTitle, setMenuTitle] = useState("info");

  return (
    <SidebarRight title={menuTitle}>
      <AppPanel graphEvents$={graphEvents$} side="right" />
    </SidebarRight>
  );
}
