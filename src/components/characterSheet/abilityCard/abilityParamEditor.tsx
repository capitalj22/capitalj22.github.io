import { clone, each, map } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import { PlusSquare } from "react-feather";
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
    paramsChanged(convertParams([..._params, { name: "...", value: 0 }]));
  };

  return (
    <div className="param-editor">
      <div className="title">Params</div>
      {_params &&
        map(_params, (param, index) => (
          <div className="param-line">
            <FancyTextInput
              value={param.name}
              valueChanged={(e) => keyChanged(e, index)}
            ></FancyTextInput>
            <FancyNumberInput
              value={param.value}
              valueChanged={(e) => valueChanged(e, index)}
            ></FancyNumberInput>
          </div>
        ))}
      <button className="add-button" onClick={addPressed}>
        Add Param <PlusSquare size={18} />
      </button>
    </div>
  );
}
