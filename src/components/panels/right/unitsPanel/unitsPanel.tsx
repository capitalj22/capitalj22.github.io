import { useContext, useState } from "react";
import { Edit, Plus } from "react-feather";
import { BuildContext } from "../../../../providers/build/buildProvider";
import { BigButton } from "../../../common/buttons/bigButton";
import { SmolButton } from "../../../common/buttons/smolButton";
import { Accordion } from "../../../layout/accordion/accordion";
import { UnitCard } from "./unitCard";
import "./unitsPanel.scss";

export function UnitsPanel() {
  const { customUnits, setCustomUnits, defaultUnits, setDefaultUnits } =
    useContext(BuildContext);
  const [isEditing, setIsEditing] = useState(false);
  const addCustomPressed = () => {
    setCustomUnits({
      type: "add",
      unit: { id: `unit-${Math.floor(Math.random() * 20000)}` },
    });
    setIsEditing(true);
  };

  return (
    <div className="units-panel">
      <Accordion name="My Units" startOpen={true}>
        <div className="padding-md">
          <div>
            <SmolButton
              color={isEditing ? "success" : "mutedText"}
              clicked={() => setIsEditing(!isEditing)}
            >
              <Edit /> Edit Units
            </SmolButton>
          </div>
          <div className="unit-cards">
            {customUnits.map((unit) => (
              <UnitCard unit={unit} isEditing={isEditing} />
            ))}
          </div>
          <div className="padding-md">
            <BigButton color="info" type="outline" clicked={addCustomPressed}>
              New Unit <Plus />
            </BigButton>
          </div>
        </div>
      </Accordion>
      <Accordion name="Default Units" startOpen={false}>
        <div className="padding-md">
          <div>
            <SmolButton
              color={isEditing ? "success" : "mutedText"}
              clicked={() => setIsEditing(!isEditing)}
            >
              <Edit /> Edit Units
            </SmolButton>
          </div>
          <div className="unit-cards">
            {defaultUnits.map((unit) => (
              <UnitCard unit={unit} isEditing={isEditing} />
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
