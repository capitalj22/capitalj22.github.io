import { useContext, useState } from "react";
import { stateContext } from "../../../providers/state/stateProvider";
import CharacterSheet from "../../characterSheet/characterSheet";
import { CodePanel } from "../../codePanel/codePanel";
import { Accordion } from "../../layout/accordion/accordion";
import { SidebarRight } from "../../layout/right/sidebarRight";
import { AbilityEditor } from "./abilityEditor/abilityEditor";
import { AbilityTypeEditor } from "./abilityTypeEditor/abilityTypeEditor";
import { GlobalParamsEditor } from "./globalParamsEditor/globalParamsEditor";
import { HelpPanel } from "./helpPanel/helpPanel";
import { StatEditor } from "./statEditor/statEditor";

export function RightPanel() {
  const [selectedItem, setSelectedItem] = useState("info");
  const [menuTitle, setMenuTitle] = useState("info");
  const { appMode } = useContext(stateContext);

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
        setMenuTitle("Edit Data");
        break;
      default:
        break;
    }
  };

  return (
    <SidebarRight itemSelected={handleItemSelected} title={menuTitle}>
      {selectedItem === "sheet" && (
        <div>
          {appMode === "build-slow" || appMode === "build-fast" ? (
            <CharacterSheet></CharacterSheet>
          ) : (
            <div>
              <Accordion name="Abilities" startOpen={false}>
                <AbilityEditor></AbilityEditor>
              </Accordion>
              <Accordion name="Ability Types" startOpen={false}>
                <AbilityTypeEditor></AbilityTypeEditor>
              </Accordion>
              <Accordion name="Global Params" startOpen={false}>
                <div className="padding-md">
                  <GlobalParamsEditor></GlobalParamsEditor>
                </div>
              </Accordion>
              <Accordion name="Stats" startOpen={false}>
                <StatEditor></StatEditor>
              </Accordion>
            </div>
          )}
        </div>
      )}

      {selectedItem === "code" ? <CodePanel></CodePanel> : ""}

      {selectedItem === "help" ? <HelpPanel /> : ""}
      {selectedItem === "stats" ? <StatEditor /> : ""}
    </SidebarRight>
  );
}
