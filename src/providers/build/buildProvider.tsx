import { clone, map } from "lodash-es";
import { createContext, useReducer, useState } from "react";
export const BuildContext = createContext({} as any);

function getBuild() {
  const build = window.localStorage.getItem("dragon-build");
  if (build) {
    return JSON.parse(build);
  } else {
    return [];
  }
}

function getCustomUnits() {
  const units = window.localStorage.getItem("dragon-custom-units");
  if (units) {
    return JSON.parse(units);
  } else {
    return [];
  }
}

function getDefaultUnits() {
  const units = window.localStorage.getItem("dragon-default-units");
  if (units) {
    try {
      return JSON.parse(units);
    } catch (e) {
      return [];
    }
  } else {
    return [];
  }
}

const defaultUnitsReducer = (state, action) => {
  const { index, unit, units, type } = action;
  let newState = clone(state);

  if (type === "save") {
    try {
      window.localStorage.setItem(
        "dragon-default-units",
        JSON.stringify(newState)
      );
    } catch (err) {}
  }

  if (type === "add") {
    newState = [...newState, unit];
    return newState;
  }

  if (type === "set") {
    newState = units;
    window.localStorage.setItem(
      "dragon-default-units",
      JSON.stringify(newState)
    );
    return newState;
  }

  if (type === "update") {
    newState = map(newState, (u) => {
      if (u.id === unit.id) {
        return unit;
      } else {
        return u;
      }
    });

    window.localStorage.setItem(
      "dragon-default-units",
      JSON.stringify(newState)
    );

    return newState;
  }

  if (type === "remove") {
    const unitIdx = state.findIndex((x) => x.id === unit.id);

    if (unitIdx < 0) return state;

    const stateUpdate = [...state];

    stateUpdate.splice(unitIdx, 1);

    window.localStorage.setItem(
      "dragon-default-units",
      JSON.stringify(newState)
    );

    return stateUpdate;
  }
  return state;
};
const customUnitsReducer = (state, action) => {
  const { index, unit, units, type } = action;
  let newState = clone(state);

  if (type === "save") {
    try {
      window.localStorage.setItem(
        "dragon-custom-units",
        JSON.stringify(newState)
      );
    } catch (err) {}
  }

  if (type === "add") {
    newState = [...newState, unit];
    return newState;
  }

  if (type === "set") {
    newState = units;
    window.localStorage.setItem(
      "dragon-custom-units",
      JSON.stringify(newState)
    );
    return newState;
  }

  if (type === "update") {
    newState = map(newState, (u) => {
      if (u.id === unit.id) {
        return unit;
      } else {
        return u;
      }
    });

    window.localStorage.setItem(
      "dragon-custom-units",
      JSON.stringify(newState)
    );

    return newState;
  }

  if (type === "remove") {
    const unitIdx = state.findIndex((x) => x.id === unit.id);

    if (unitIdx < 0) return state;

    const stateUpdate = [...state];

    stateUpdate.splice(unitIdx, 1);

    window.localStorage.setItem(
      "dragon-custom-units",
      JSON.stringify(stateUpdate)
    );

    return stateUpdate;
  }
  return state;
};

const savedBuildReducer = (state, action) => {
  const { build, type } = action;
  let newState = clone(state);

  if (type === "imported") {
    newState = build;
    return newState;
  }

  return state;
};

const buildReducer = (state, action) => {
  const { build, type } = action;
  let newState = clone(state);
  if (type === "set") {
    newState = build;
    window.localStorage.setItem("dragon-build", JSON.stringify(newState));
    return newState;
  }

  return state;
};

export const BuildProvider = ({ children }) => {
  const [build, setBuild] = useReducer(buildReducer, getBuild());
  const [savedBuild, setSavedBuild] = useReducer(
    savedBuildReducer,
    build?.exportableBuild
  );

  const [customUnits, setCustomUnits] = useReducer(
    customUnitsReducer,
    getCustomUnits()
  );

  const [defaultUnits, setDefaultUnits] = useReducer(
    defaultUnitsReducer,
    getDefaultUnits()
  );

  const [selectedUnit, setSelectedUnit] = useState({
    type: "custom",
    unit: customUnits?.length > 1 ? customUnits[0]?.id : null,
  });

  return (
    <BuildContext.Provider
      value={{
        build,
        setBuild,
        savedBuild,
        setSavedBuild,
        customUnits,
        setCustomUnits,
        defaultUnits,
        setDefaultUnits,
        selectedUnit,
        setSelectedUnit,
      }}
    >
      {children}
    </BuildContext.Provider>
  );
};
