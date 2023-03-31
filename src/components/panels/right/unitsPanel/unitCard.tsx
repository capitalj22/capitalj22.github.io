import classNames from "classnames";
import { useContext, useState } from "react";
import { Save, Trash2 } from "react-feather";
import { BuildContext } from "../../../../providers/build/buildProvider";
import { BigButton } from "../../../common/buttons/bigButton";
import { SmolButton } from "../../../common/buttons/smolButton";
import { FancyTextInput } from "../../../common/tag-input/fancyTextInput";
import "./unitCard.scss";

export function UnitCard({ unit, isEditing = false }) {
  const { setCustomUnits, selectedUnitId, setSelectedUnitId } =
    useContext(BuildContext);
  const [name, setName] = useState(unit.name);
  const [unsavedData, setUnsavedData] = useState(false);

  const saveUnit = () => {
    setCustomUnits({ type: "update", unit: { ...unit, name } });
    setUnsavedData(false);
  };

  const deleteUnit = () => {
    setCustomUnits({ type: "remove", unit });
  };

  const nameChanged = (e) => {
    setName(e);
    setUnsavedData(true);
  };

  const cardClicked = () => {};
  if (isEditing) {
    return (
      <div className="unit-card">
        <div className="unit-card-row">
          <FancyTextInput
            minWidth={100}
            placeholder="Unit Name"
            value={name}
            valueChanged={nameChanged}
          />
          <SmolButton color="danger" clicked={deleteUnit}>
            <Trash2 />
          </SmolButton>
        </div>
        {!!unsavedData && (
          <div className="padding-sm">
            <BigButton type="outline" color="success" clicked={saveUnit}>
              <Save /> Save Unit
            </BigButton>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div
        onClick={() => setSelectedUnitId(unit.id)}
        className={classNames({
          "unit-card": true,
          selectable: true,
          selected: selectedUnitId === unit.id,
        })}
      >
        <div>{unit.name}</div>
      </div>
    );
  }
}
