import { useContext, useState } from "react";
import { stateContext } from "../../../providers/state/stateProvider";
import CharacterSheet from "../../characterSheet/characterSheet";
import { CodePanel } from "../../codePanel/codePanel";
import { Accordion } from "../../layout/accordion/accordion";
import { SidebarRight } from "../../layout/right/sidebarRight";
import { InfoPanel } from "../../panels/left/infoPanel/infoPanel";
import { SettingsPanel } from "../../panels/left/settingsPanel/settingsPanel";
import { AbilityEditor } from "../../panels/right/abilityEditor/abilityEditor";
import { AbilityTypeEditor } from "../../panels/right/abilityTypeEditor/abilityTypeEditor";
import { GlobalParamsEditor } from "../../panels/right/globalParamsEditor/globalParamsEditor";
import { HelpPanel } from "../../panels/right/helpPanel/helpPanel";
import { StatEditor } from "../../panels/right/statEditor/statEditor";
import { UnitsPanel } from "../../panels/right/unitsPanel/unitsPanel";

export function AppPanel({ graphEvents$, side = "left" }) {
  const { appMode, selectedMenus, setSelectedMenus } = useContext(stateContext);
  const [selectedItem, setSelectedItem] = useState(selectedMenus[side]);
  const [menuTitle, setMenuTitle] = useState("info");

  return (
    <div>
      {selectedMenus[side] === "sheet" && (
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
      {selectedMenus[side] === "units" && <UnitsPanel />}
      {selectedMenus[side] === "code" && <CodePanel />}
      {selectedMenus[side] === "help" && <HelpPanel />}
      {selectedMenus[side] === "stats" && <StatEditor />}
      {selectedMenus[side] === "info" && <InfoPanel graphEvents$={graphEvents$} />}
      {selectedMenus[side] === "settings" && (
        <SettingsPanel graphEvents$={graphEvents$} />
      )}
    </div>
  );
}
