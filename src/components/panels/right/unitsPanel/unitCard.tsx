import classNames from "classnames";
import { find } from "lodash-es";
import { useContext, useState } from "react";
import { Edit, RotateCcw, Save, Trash2 } from "react-feather";
import { BuildContext } from "../../../../providers/build/buildProvider";
import { BigButton } from "../../../common/buttons/bigButton";
import { SmolButton } from "../../../common/buttons/smolButton";
import { UnitSelect } from "../../../common/selects/unitSelect";
import { FancyTextInput } from "../../../common/tag-input/fancyTextInput";
import "./unitCard.scss";

export function UnitCard({ unit, startEditable = false }) {
  const {
    customUnits,
    defaultUnits,
    setCustomUnits,
    selectedUnitId,
    setSelectedUnitId,
    setSavedBuild,
  } = useContext(BuildContext);
  const [isEditing, setIsEditing] = useState(startEditable);
  const [name, setName] = useState(unit.name);
  const [unsavedData, setUnsavedData] = useState(false);
  const [unitBuild, setUnitBuild] = useState(unit.build || {});

  const saveUnit = () => {
    setCustomUnits({
      type: "update",
      unit: { ...unit, name, build: unitBuild },
    });
    setUnsavedData(false);
  };

  const deleteUnit = () => {
    setCustomUnits({ type: "remove", unit });
  };

  const nameChanged = (e) => {
    setName(e);
    setUnsavedData(true);
  };

  const cardClicked = () => {
    setSelectedUnitId(unit.id);

    if (unit.build) {
      setSavedBuild({ type: "imported", build: unit.build });
    } else {
      setSavedBuild({ type: "imported", build: {} });
    }
  };

  const unitCopySelected = (e) => {
    const unit = find([...customUnits, ...defaultUnits], { id: e });

    setUnitBuild(unit.build || {});
    setUnsavedData(true);
  };

  if (isEditing) {
    return (
      <div className="unit-card">
        <div className="unit-card-row"></div>
        <div className="unit-card-row">
          <SmolButton color="info" clicked={(e) => setIsEditing(false)}>
            <RotateCcw />
          </SmolButton>
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
        <div className="unit-card-row">
          Copy from:
          <UnitSelect
            defaultValue={undefined}
            valueChanged={unitCopySelected}
          />
        </div>
        <div className="padding-sm">
          <BigButton
            disabled={!unsavedData}
            type="outline"
            color="success"
            clicked={saveUnit}
          >
            <Save /> Save Unit
          </BigButton>
        </div>
      </div>
    );
  } else {
    return (
      <div
        onClick={cardClicked}
        className={classNames({
          "unit-card": true,
          selectable: true,
          selected: selectedUnitId === unit.id,
        })}
      >
        <div className="unit-card-row">
          <SmolButton color="info" clicked={(e) => setIsEditing(true)}>
            <Edit />
          </SmolButton>
          <div className="unit-card-name">{unit.name}</div>
        </div>
      </div>
    );
  }
}
