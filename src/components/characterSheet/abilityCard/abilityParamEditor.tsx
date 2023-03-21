import { clone, each, map, some } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import { PlusSquare, Trash2 } from "react-feather";
import { BigButton } from "../../common/buttons/bigButton";
import { SmolButton } from "../../common/buttons/smolButton";
import { FancyNumberInput } from "../../common/tag-input/fancyNumberInput";
import { FancyTextInput } from "../../common/tag-input/fancyTextInput";
import "./abilityParamEditor.scss";

function formatParams(params = {}) {
  if (params) {
    return map(Object.keys(params), (key) => {
      return {
        name: key,
        value: params[key],
      };
    });
  } else {
    return [];
  }
}

function convertParams(params) {
  let newParams = {};
  each(params, (param) => {
    newParams[param.name] = param.value;
  });

  return newParams;
}

export function AbilityParamEditor({ params, paramsChanged }) {
  const [_params, setParams] = useState(formatParams(params));

  useEffect(() => {
    setParams(formatParams(params));
  }, [params]);

  const keyChanged = (value, index) => {
    let newParams = clone(_params);
    newParams[index].name = value;

    paramsChanged(convertParams(newParams));
  };

  const valueChanged = (value, index) => {
    let newParams = clone(_params);
    newParams[index].value = value;
    paramsChanged(convertParams(newParams));
  };

  const addPressed = () => {
    paramsChanged(convertParams([..._params, { name: "", value: 0 }]));
  };

  const removePressed = (index) => {
    let newParams = clone(_params);
    newParams.splice(index, 1);
    paramsChanged(convertParams(newParams));
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
      <BigButton
        disabled={some(_params, { name: "" })}
        color="theme"
        clicked={addPressed}
      >
        Add Param <PlusSquare size={20} />
      </BigButton>
    </div>
  );
}
