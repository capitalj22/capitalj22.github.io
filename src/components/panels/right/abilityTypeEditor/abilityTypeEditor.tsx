import { map } from "lodash-es";
import { useContext } from "react";
import { PlusSquare, Trash2 } from "react-feather";
import { AbilitiesContext } from "../../../../providers/abilities/abilitiesProvider";
import { FancyTextInput } from "../../../common/tag-input/fancyTextInput";
import "./abilityTypeEditor.scss";

export function AbilityTypeEditor() {
  const { abilityTypes, setAbilityTypes } = useContext(AbilitiesContext);

  const addPressed = (event) => {
    setAbilityTypes({
      type: "add",
      abilityType: { id: "new-abilityType-type", name: "New Ability Type" },
    });
  };

  const removePressed = (event) => {
    setAbilityTypes({
      type: "remove",
      abilityType: { id: event },
    });
  };

  const valueChanged = (val, index, prop) => {
    setAbilityTypes({
      type: "update",
      index: index,
      abilityType: { ...abilityTypes[index], [prop]: val },
    });
  };

  const saveAbilityTypes = () => {
    setAbilityTypes({ type: "save" });
  };

  return (
    <div className="abilityType-editor">
      <div className="abilityTypes">
        {map(abilityTypes, (abilityType, index) => (
          <div key={index} className="abilityType-instance">
            <div className="top">
              <div className="name">
                <FancyTextInput
                  blur={saveAbilityTypes}
                  value={abilityType.name}
                  valueChanged={(val) => valueChanged(val, index, "name")}
                />
              </div>
              <button
                className="remove-button"
                onClick={(e) => removePressed(abilityType.id)}
              >
                <Trash2 />
              </button>
            </div>
            <div className="bottom">
              <div className="id">
                <FancyTextInput
                  blur={saveAbilityTypes}
                  value={abilityType.id}
                  valueChanged={(val) => valueChanged(val, index, "id")}
                />
              </div>
            </div>
          </div>
        ))}
        <button className="new-button" onClick={addPressed}>
          Add Type <PlusSquare />
        </button>
      </div>
    </div>
  );
}
