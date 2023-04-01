import { AppPanel } from "../../layout/appPanel/appPanel";
import { SidebarRight } from "../../layout/right/sidebarRight";

export function RightPanel({ graphEvents$ }) {
  return (
    <SidebarRight>
      <AppPanel graphEvents$={graphEvents$} side="right" />
    </SidebarRight>
  );
}
