import { clone, map, some, uniqueId } from "lodash-es";
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
      JSON.stringify(stateUpdate)
    );

    return stateUpdate;
  }
  return state;
};

const customUnitsReducer = (state, action) => {
  // console.log(action);
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
    if (some(newState, { id: unit.id })) {
      unit.id = `copy-${Math.floor(Math.random() * 700000)}`;
      unit.name = `${unit.name}-${unit.id}`;
    }
    newState = [...newState, unit];
    return newState;
  }

  if (type === "addMany") {
    const newUnits = map(units, (u) => {
      const dupe =
        some(newState, { id: u.id }) || some(newState, { name: u.name });
      if (dupe) {
        const id = `copy-${Math.floor(Math.random() * 700000)}`;

        return { ...u, id, name: `${u.name}-${u.id}` };
      }

      return u;
    });

    newState = [...newState, ...newUnits];
    window.localStorage.setItem(
      "dragon-custom-units",
      JSON.stringify(newState)
    );
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
    unit: null,
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
