import { clone, each, map, some } from "lodash-es";
import { useEffect, useState } from "react";
import { PlusSquare, Trash2 } from "react-feather";
import { BigButton } from "../../common/buttons/bigButton";
import { SmolButton } from "../../common/buttons/smolButton";
import { FancyNumberInput } from "../../common/tag-input/fancyNumberInput";
import { FancyTextInput } from "../../common/tag-input/fancyTextInput";
import "./abilityParamEditor.scss";

export function AbilityParamEditor({ params, paramsChanged }) {
  const [_params, setParams] = useState(params);

  useEffect(() => {
    setParams(params);
  }, [params]);

  const keyChanged = (value, index) => {
    let newParams = clone(_params);
    newParams[index].name = value;

    paramsChanged(newParams);
  };

  const valueChanged = (value, index) => {
    let newParams = clone(_params);
    newParams[index].value = value;
    paramsChanged(newParams);
  };

  const addPressed = () => {
    paramsChanged([...params, { name: "", value: 0 }]);
  };

  const removePressed = (index) => {
    let newParams = clone(_params);
    newParams.splice(index, 1);
    paramsChanged(newParams);
  };

  return (
    <div className="param-editor">
      {_params &&
        map(_params, (param, index) => (
          <div className="param-line">
            <SmolButton color="danger" clicked={() => removePressed(index)}>
              <Trash2 size="18" />
            </SmolButton>
            <FancyTextInput
              minWidth={120}
              placeholder="name"
              className="param-input"
              value={param.name}
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
        <BigButton
          disabled={some(_params, { name: "" })}
          color="theme"
          clicked={addPressed}
        >
          Add Param <PlusSquare size={20} />
        </BigButton>
      </div>
    </div>
  );
}
