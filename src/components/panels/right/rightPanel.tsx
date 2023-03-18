import { useState } from "react";
import CharacterSheet from "../../characterSheet/characterSheet";
import { CodePanel } from "../../codePanel/codePanel";
import { SidebarRight } from "../../layout/right/sidebarRight";

export function RightPanel({ build, importAttempted }) {
  const [selectedItem, setSelectedItem] = useState("info");
  const [menuTitle, setMenuTitle] = useState("info");

  const handleItemSelected = (item) => {
    setSelectedItem(item);

    switch (item) {
      case "sheet":
        setMenuTitle("Character Sheet");
        break;
      case "code":
        setMenuTitle("Import/Export");
        break;
      case "help":
        setMenuTitle("Help");
        break;
      default:
        break;
    }
  };

  const handleImportAttempted = (item) => {
    //
  };

  return (
    <SidebarRight itemSelected={handleItemSelected} title={menuTitle}>
      {selectedItem === "sheet" ? (
        <CharacterSheet dragon={build}></CharacterSheet>
      ) : (
        ""
      )}
      {selectedItem === "code" ? (
        <CodePanel
          dragon={build}
          importAttempted={handleImportAttempted}
        ></CodePanel>
      ) : (
        ""
      )}
      {selectedItem === "help" ? <div></div> : ""}
    </SidebarRight>
  );
}
