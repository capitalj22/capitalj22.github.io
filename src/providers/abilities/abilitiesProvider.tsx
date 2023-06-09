import { clone, map } from "lodash-es";
import { createContext, useReducer } from "react";

export const AbilitiesContext = createContext({} as any);

function getAbilities() {
  const abilities = window.localStorage.getItem("dragon-abilities");
  if (abilities) {
    return JSON.parse(abilities);
  } else {
    return [];
  }
}

function getAbilityTypes() {
  const abilities = window.localStorage.getItem("dragon-ability-types");
  if (abilities) {
    return JSON.parse(abilities);
  } else {
    return [];
  }
}

function getGlobalParams() {
  const globalParams = window.localStorage.getItem("dragon-global-params");
  if (globalParams) {
    return JSON.parse(globalParams);
  } else {
    return [];
  }
}

const globalParamReducer = (state, action) => {
  const { targetId, index, param, params, type } = action;
  let newState = clone(state);

  if (type === "save") {
    try {
      window.localStorage.setItem(
        "dragon-global-params",
        JSON.stringify(newState)
      );
    } catch (err) {}
  }

  if (type === "add") {
    newState = [...newState, param];
    return newState;
  }

  if (type === "set") {
    newState = params;

    window.localStorage.setItem(
      "dragon-global-params",
      JSON.stringify(newState)
    );
    return newState;
  }

  if (type === "update") {
    newState = map(newState, (ab) => {
      if (ab.id === targetId) {
        return param;
      } else {
        return ab;
      }
    });

    return newState;
  }

  if (type === "remove") {
    const paramIndex = state.findIndex((x) => x.id === param.id);

    if (paramIndex < 0) return state;

    const stateUpdate = [...state];

    stateUpdate.splice(paramIndex, 1);
    return stateUpdate;
  }
  return state;
};

const abilitiesReducer = (state, action) => {
  const { targetId, index, ability, abilities, type } = action;
  let newState = clone(state);

  if (type === "save") {
    try {
      window.localStorage.setItem("dragon-abilities", JSON.stringify(newState));
    } catch (err) {}
  }

  if (type === "add") {
    newState = [...newState, ability];
    return newState;
  }

  if (type === "set") {
    newState = abilities;

    window.localStorage.setItem("dragon-abilities", JSON.stringify(newState));
    return newState;
  }

  if (type === "update") {
    newState = map(newState, (ab) => {
      if (ab.id === targetId) {
        return ability;
      } else {
        return ab;
      }
    });

    return newState;
  }

  if (type === "remove") {
    const abilityIndex = state.findIndex((x) => x.id === ability.id);

    if (abilityIndex < 0) return state;

    const stateUpdate = [...state];

    stateUpdate.splice(abilityIndex, 1);
    return stateUpdate;
  }
  return state;
};

const abilityTypeReducer = (state, action) => {
  const { index, abilityType, abilityTypes, type } = action;
  let newState = clone(state);

  if (type === "save") {
    try {
      window.localStorage.setItem(
        "dragon-ability-types",
        JSON.stringify(newState)
      );
    } catch (err) {}
  }

  if (type === "add") {
    newState = [...newState, abilityType];
    return newState;
  }

  if (type === "set") {
    newState = abilityTypes;
    window.localStorage.setItem(
      "dragon-ability-types",
      JSON.stringify(newState)
    );
    return newState;
  }

  if (type === "update") {
    newState[index] = abilityType;
    return newState;
  }

  if (type === "remove") {
    const bookIndex = state.findIndex((x) => x.id === abilityType.id);

    if (bookIndex < 0) return state;

    const stateUpdate = [...state];

    stateUpdate.splice(bookIndex, 1);
    return stateUpdate;
  }
  return state;
};

export const AbilitiesProvider = ({ children }) => {
  const [abilities, setAbilities] = useReducer(
    abilitiesReducer,
    getAbilities()
  );

  const [abilityTypes, setAbilityTypes] = useReducer(
    abilityTypeReducer,
    getAbilityTypes()
  );

  const [globalParams, setGlobalParams] = useReducer(
    globalParamReducer,
    getGlobalParams()
  );

  return (
    <AbilitiesContext.Provider
      value={{
        abilities,
        setAbilities,
        abilityTypes,
        setAbilityTypes,
        globalParams,
        setGlobalParams,
      }}
    >
      {children}
    </AbilitiesContext.Provider>
  );
};
