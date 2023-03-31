import { useContext, useState } from "react";
import { Plus } from "react-feather";
import { BuildContext } from "../../../../providers/build/buildProvider";
import { BigButton } from "../../../common/buttons/bigButton";
import { Accordion } from "../../../layout/accordion/accordion";
import { UnitCard } from "./unitCard";
import "./unitsPanel.scss";

export function UnitsPanel() {
  const { customUnits, setCustomUnits, defaultUnits, setDefaultUnits } =
    useContext(BuildContext);
  // fix this so it updates when a unit is added or removed
  const originalLength = customUnits.length;

  const addCustomPressed = () => {
    setCustomUnits({
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
              <UnitCard
                unit={unit}
                startEditable={index > originalLength + 1}
              />
            ))}
          </div>
          <div className="padding-md-vertical">
            <BigButton color="info" type="outline" clicked={addCustomPressed}>
              New Unit <Plus />
            </BigButton>
          </div>
        </div>
      </Accordion>
      <Accordion name="Default Units" startOpen={false}>
        <div className="padding-md-vertical">
          <div className="unit-cards">
            {defaultUnits.map((unit) => (
              <UnitCard unit={unit} />
            ))}
          </div>
          <div className="padding-md">
            <BigButton color="info" type="outline" clicked={addCustomPressed}>
              New Unit <Plus />
            </BigButton>
          </div>
        </div>
      </Accordion>
    </div>
  );
}
