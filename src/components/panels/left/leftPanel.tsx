import { useContext, useState, useEffect } from "react";
import { InfoPanel } from "./infoPanel/infoPanel";
import { SidebarLeft } from "../../layout/left/sidebarLeft";
import { SettingsPanel } from "./settingsPanel/settingsPanel";
import { EditPanel } from "./editPanel/editPanel";
import { NodesContext } from "../../../providers/nodes/nodesProvider";

export function LeftPanel({ graphEvents$ }) {
  const { node, selectedNodeId } = useContext(NodesContext);
  const [selectedItem, setSelectedItem] = useState("info");
  const [showInfoPanel, setShowInfoPanel] = useState(!!node);
  const handleItemSelected = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    setShowInfoPanel(!!selectedNodeId);
  }, [selectedNodeId]);

  return (
    <SidebarLeft itemSelected={handleItemSelected} expanded={undefined}>
      {selectedItem === "info" ? (
        <div>
          {showInfoPanel ? <InfoPanel graphEvents={graphEvents$} /> : ""}
        </div>
      ) : (
        ""
      )}
      {selectedItem === "settings" ? (
        <SettingsPanel graphEvents$={graphEvents$} />
      ) : (
        ""
      )}
    </SidebarLeft>
  );
}
