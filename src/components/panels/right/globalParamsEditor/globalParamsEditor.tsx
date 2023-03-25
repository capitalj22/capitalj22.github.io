import { clone, map, some } from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { PlusSquare, Save, Trash2 } from "react-feather";
import { AbilitiesContext } from "../../../../providers/abilities/abilitiesProvider";
import { SmolButton } from "../../../common/buttons/smolButton";
import { FancyNumberInput } from "../../../common/tag-input/fancyNumberInput";
import { FancyTextInput } from "../../../common/tag-input/fancyTextInput";

export function GlobalParamsEditor() {
  const { globalParams, setGlobalParams } = useContext(AbilitiesContext);
  const [unsavedData, setUnsavedData] = useState(false);
  const [_params, setParams] = useState(globalParams);

  useEffect(() => {
    setParams(globalParams);
  }, [globalParams]);

  const keyChanged = (value, index) => {
    let newState = clone(_params);
    newState[index].id = value;
    setParams(newState);
    setUnsavedData(true);
  };

  const valueChanged = (value, index) => {
    let newState = clone(_params);
    newState[index].value = value;
    setParams(newState);
    setUnsavedData(true);
  };

  const addPressed = () => {
    let newState = [..._params, { id: "", value: 0 }];

    setParams(newState);
    setUnsavedData(true);
  };

  const removePressed = (index) => {
    let newParams = clone(_params);
    newParams.splice(index, 1);
    setGlobalParams(newParams);
  };

  const savePressed = () => {
    setGlobalParams({ type: "set", params: clone(_params) });
    setGlobalParams({ type: "save" });
    setUnsavedData(false);
  };

  return (
    <div className="param-editor">
      {_params &&
        map(_params, (param, index) => (
          <div className="param-line" key={index}>
            <SmolButton color="danger" clicked={() => removePressed(index)}>
              <Trash2 size="18" />
            </SmolButton>
            <FancyTextInput
              minWidth={120}
              placeholder="name"
              className="param-input"
              value={param.id}
              valueChanged={(e) => keyChanged(e, index)}
            ></FancyTextInput>
            <FancyNumberInput
              className="param-input"
              value={param.value}
              valueChanged={(e) => valueChanged(e, index)}
            ></FancyNumberInput>
          </div>
        ))}
      <div className="add-button">
        <div>
          <SmolButton
            disabled={some(_params, { name: "" })}
            color="theme"
            clicked={addPressed}
          >
            <PlusSquare size={20} /> Add Param
          </SmolButton>
        </div>
        <SmolButton
          disabled={!unsavedData}
          color="success"
          clicked={savePressed}
        >
          <Save size={20} /> Save Changes
        </SmolButton>
      </div>
    </div>
  );
}
