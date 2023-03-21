import { useState } from "react";
import CharacterSheet from "../../characterSheet/characterSheet";
import { CodePanel } from "../../codePanel/codePanel";
import { SidebarRight } from "../../layout/right/sidebarRight";
import { AbilityEditor } from "./abilityEditor/abilityEditor";
import { StatEditor } from "./statEditor/statEditor";

export function RightPanel({
  build,
  importAttempted,
  abilities,
  nodes,
  abilitiesChanged,
}) {
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
      case "list":
        setMenuTitle("Edit Abilities");
        break;
      case "stats":
        setMenuTitle("Edit Stats");
        break;
      default:
        break;
    }
  };

  const handleImportAttempted = (item) => {
    importAttempted(item);
  };

  const handleAbilitiesChanged = (event) => {
    abilitiesChanged(event);
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
          build={build}
          abilities={abilities}
          nodes={nodes}
          importAttempted={handleImportAttempted}
        ></CodePanel>
      ) : (
        ""
      )}
      {selectedItem === "list" ? (
        <AbilityEditor
          abilities={abilities}
          abilitiesChanged={handleAbilitiesChanged}
        ></AbilityEditor>
      ) : (
        ""
      )}
      {selectedItem === "help" ? <div></div> : ""}
      {selectedItem === "stats" ? <StatEditor/>: ""}
    </SidebarRight>
  );
}
