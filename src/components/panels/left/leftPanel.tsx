import { useState } from "react";
import { InfoPanel } from "./infoPanel/infoPanel";
import { SidebarLeft } from "../../layout/left/sidebarLeft";
import { SettingsPanel } from "./settingsPanel/settingsPanel";
import { EditPanel } from "./editPanel/editPanel";

export function LeftPanel({ build, selectedNode, graphEvents$ }) {
  const [selectedItem, setSelectedItem] = useState("info");
  const handleItemSelected = (item) => {
    setSelectedItem(item);

    switch (item) {
      case "info":
        graphEvents$.next({ event: "modeChanged", data: { mode: "build" } });
        break;
      case "settings":
        graphEvents$.next({ event: "modeChanged", data: { mode: "build" } });
        break;
      case "edit":
        graphEvents$.next({ event: "modeChanged", data: { mode: "edit" } });
        break;
      default:
        break;
    }
  };
  const handleExpanded = (event) => {};

  return (
    <SidebarLeft itemSelected={handleItemSelected} expanded={handleExpanded}>
      {selectedItem === "info" ? <InfoPanel node={selectedNode} /> : ""}
      {selectedItem === "settings" ? (
        <SettingsPanel graphEvents$={graphEvents$} />
      ) : (
        ""
      )}
      {selectedItem === "edit" ? <EditPanel node={selectedNode} /> : ""}
    </SidebarLeft>
  );
}
