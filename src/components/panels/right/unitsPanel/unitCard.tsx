import classNames from "classnames";
import { each, filter, find, includes, sortBy, uniq } from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { Edit, RotateCcw, Save, Trash2 } from "react-feather";
import { BuildContext } from "../../../../providers/build/buildProvider";
import { stateContext } from "../../../../providers/state/stateProvider";
import { BigButton } from "../../../common/buttons/bigButton";
import { SmolButton } from "../../../common/buttons/smolButton";
import { UnitSelect } from "../../../common/selects/unitSelect";
import { FancyTextInput } from "../../../common/tag-input/fancyTextInput";
import "./unitCard.scss";
import { TagSelect } from "../../../characterSheet/abilityCard/tagSelect";
import { StatTag } from "../../../characterSheet/statTag/statTag";

const LOGOS = {
  dragon: "dragon.png ",
  undead: "skull.png",
  humanoid: "knight.png"
};
function getLogo(tags): string {
  let logos = filter(Object.keys(LOGOS), (key) => includes(tags, key));
  if (logos.length) {
    return LOGOS[logos[0]];
  } else {
    return "";
  }
}

export function UnitCard({ unit, startEditable = false, unitType = "custom" }) {
  const {
    customUnits,
    defaultUnits,
    setCustomUnits,
    setDefaultUnits,
    selectedUnit,
    setSelectedUnit,
    setSavedBuild,
  } = useContext(BuildContext);
  const { appMode } = useContext(stateContext);
  const [isEditing, setIsEditing] = useState(startEditable);
  const [name, setName] = useState(unit.name);
  const [unsavedData, setUnsavedData] = useState(false);
  const [unitBuild, setUnitBuild] = useState(unit.build || {});
  const [tags, setTags] = useState(unit.tags || []);
  const [logo, setLogo] = useState(getLogo(tags));

  useEffect(() => {
    if (!unit.name) {
      setIsEditing(true);
    }
  }, []);

  const saveUnit = () => {
    if (unitType === "custom") {
      setCustomUnits({
        type: "update",
        unit: { ...unit, name, build: unitBuild, tags: sortBy(tags) },
      });
    } else {
      setDefaultUnits({
        type: "update",
        unit: { ...unit, name, build: unitBuild, tags: sortBy(tags) },
      });
    }
    setUnsavedData(false);
    setIsEditing(false);
  };

  const deleteUnit = () => {
    if (unitType === "custom") {
      setCustomUnits({ type: "remove", unit });
    } else {
      setDefaultUnits({ type: "remove", unit });
    }
  };

  const nameChanged = (e) => {
    setName(e);
    setUnsavedData(true);
  };

  const cardClicked = () => {
    let savedUnit;

    if (unitType === "custom") {
      savedUnit = find(customUnits, { id: unit.id });
    } else {
      savedUnit = find(defaultUnits, { id: unit.id });
    }

    if (savedUnit.build) {
      setSavedBuild({ type: "imported", build: savedUnit.build });
    } else {
      setSavedBuild({ type: "imported", build: {} });
    }

    setSelectedUnit({ type: unitType, unit });
  };

  const unitCopySelected = (e) => {
    const unit = find([...customUnits, ...defaultUnits], { id: e });

    setUnitBuild(unit.build || {});
    setUnsavedData(true);
  };

  const tagsChanged = (e) => {
    setTags(e);
    setUnsavedData(true);
  };

  const undoClicked = () => {
    if (!unit.name) {
      deleteUnit();
    } else {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="unit-card editing">
        <div className="unit-card-row"></div>
        <div className="unit-card-row">
          <SmolButton color="info" clicked={undoClicked}>
            <RotateCcw />
          </SmolButton>
          <FancyTextInput
            fullWidth={true}
            autoFocus={true}
            placeholder="Name..."
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
        <div className="unit-card-row">
          <TagSelect tagsChanged={tagsChanged} tags={unit.tags} />
        </div>
        <div className="padding-sm-vertical">
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
          selected: selectedUnit?.unit?.id === unit.id,
        })}
      >
        {!!logo && (
          <img
            className="unit-overlay"
            src={`cardbacks/${logo}`}
          ></img>
        )}
        <div className="unit-card-row">
          <div className="left">
            {(unitType === "custom" || appMode === "edit") && (
              <SmolButton color="info" clicked={(e) => setIsEditing(true)}>
                <Edit />
              </SmolButton>
            )}
            <div className="unit-card-name">{unit.name}</div>
          </div>
          <div className="level">
            level <span className="value">{unit.lvl || "?"}</span>
          </div>
        </div>
        <div className="tags">
          {sortBy(uniq([...(unit.tags || []), ...(tags || [])]))?.map((tag) => (
            <StatTag key={tag} label={tag}></StatTag>
          ))}
        </div>
      </div>
    );
  }
}
