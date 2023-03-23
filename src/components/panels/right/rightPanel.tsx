import { useState } from "react";
import CharacterSheet from "../../characterSheet/characterSheet";
import { CodePanel } from "../../codePanel/codePanel";
import { Accordion } from "../../layout/accordion/accordion";
import { SidebarRight } from "../../layout/right/sidebarRight";
import { AbilityEditor } from "./abilityEditor/abilityEditor";
import { AbilityTypeEditor } from "./abilityTypeEditor/abilityTypeEditor";
import { StatEditor } from "./statEditor/statEditor";
const example1 =
  "{myParam}This only appears when 'myParam' is at least 1{/myParam}";
const example2 = "%myParam% will be replaced with the value of 'myParam'";
const example3 = `You make 1 melee attack against an adjacent enemy. Roll 1d6{dmg}+%dmg%{/dmg} and do that much damage.`;
export function RightPanel({ importAttempted }) {
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
        setMenuTitle("Edit Data");
        break;
      default:
        break;
    }
  };

  const handleImportAttempted = (item) => {
    importAttempted(item);
  };

  return (
    <SidebarRight itemSelected={handleItemSelected} title={menuTitle}>
      {selectedItem === "sheet" ? <CharacterSheet></CharacterSheet> : ""}
      {selectedItem === "code" ? (
        <CodePanel importAttempted={handleImportAttempted}></CodePanel>
      ) : (
        ""
      )}
      {selectedItem === "list" ? (
        <div>
          <Accordion name="Abilities" startOpen={false}>
            <AbilityEditor></AbilityEditor>
          </Accordion>
          <Accordion name="Ability Types" startOpen={false}>
            <AbilityTypeEditor></AbilityTypeEditor>
          </Accordion>
          <Accordion name="Stats" startOpen={false}>
            <StatEditor></StatEditor>
          </Accordion>
        </div>
      ) : (
        ""
      )}
      {selectedItem === "help" ? (
        <div className="padding-md" style={{ textAlign: "left" }}>
          <h2>Ability Description Syntax</h2>
          <h3>Condition</h3>
          <p>{example1}</p>
          <h3>Value</h3>
          <p>{example2}</p>
          <h3>Example</h3>
          <p>{example3}</p>
        </div>
      ) : (
        ""
      )}
      {selectedItem === "stats" ? <StatEditor /> : ""}
    </SidebarRight>
  );
}
