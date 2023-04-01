import { useContext } from "react";
import { Plus } from "react-feather";
import { BuildContext } from "../../../../providers/build/buildProvider";
import { stateContext } from "../../../../providers/state/stateProvider";
import { BigButton } from "../../../common/buttons/bigButton";
import { Accordion } from "../../../layout/accordion/accordion";
import { UnitCard } from "./unitCard";
import "./unitsPanel.scss";

export function UnitsPanel() {
  const { customUnits, setCustomUnits, defaultUnits, setDefaultUnits } =
    useContext(BuildContext);
  const { appMode } = useContext(stateContext);

  const addCustomPressed = () => {
    setCustomUnits({
      type: "add",
      unit: { id: `unit-${Math.floor(Math.random() * 20000)}` },
    });
  };

  const addDefaultPressed = () => {
    setDefaultUnits({
      type: "add",
      unit: { id: `unit-${Math.floor(Math.random() * 20000)}` },
    });
  };

  return (
    <div className="units-panel">
      <Accordion name="My Units" startOpen={true}>
        <div className="padding-md">
          <div className="unit-cards">
            {customUnits.map((unit, index) => (
              <UnitCard key={unit.id} unit={unit} unitType="custom" />
            ))}
          </div>
          <div className="padding-md-vertical">
            <BigButton color="info" type="outline" clicked={addCustomPressed}>
              New Custom Unit <Plus />
            </BigButton>
          </div>
        </div>
      </Accordion>
      <Accordion name="Default Units" startOpen={true}>
        <div className="padding-md">
          <div className="unit-cards">
            {defaultUnits.map((unit) => (
              <UnitCard key={unit.id} unit={unit} unitType="default" />
            ))}
          </div>
          {appMode === "edit" && (
            <div className="padding-md-vertical">
              <BigButton
                color="info"
                type="outline"
                clicked={addDefaultPressed}
              >
                New Default Unit <Plus />
              </BigButton>
            </div>
          )}
        </div>
      </Accordion>
    </div>
  );
}
