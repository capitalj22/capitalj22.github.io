import { useContext, useState, useEffect } from "react";
import { InfoPanel } from "./infoPanel/infoPanel";
import { SidebarLeft } from "../../layout/left/sidebarLeft";
import { SettingsPanel } from "./settingsPanel/settingsPanel";
import { EditPanel } from "./editPanel/editPanel";
import { NodesContext } from "../../../providers/nodes/nodesProvider";
import { stateContext } from "../../../providers/state/stateProvider";
import { AppPanel } from "../../layout/appPanel/appPanel";

export function LeftPanel({ graphEvents$ }) {
  const { node, selectedNodeId } = useContext(NodesContext);
  const { appMode } = useContext(stateContext);
  const [selectedItem, setSelectedItem] = useState("info");
  const [showInfoPanel, setShowInfoPanel] = useState(!!node);
  const handleItemSelected = (item) => {
    setSelectedItem(item);
  };

  return (
    <SidebarLeft>
      <AppPanel graphEvents$={graphEvents$} side="left" />
    </SidebarLeft>
  );
}
