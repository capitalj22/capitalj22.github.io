import { clone, map } from "lodash-es";
import { createContext, useReducer } from "react";

export const AbilitiesContext = createContext(
  {} as { abilities: any; setAbilities: any; abilityTypes; setAbilityTypes }
);

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

// saved books reducer function
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
  // get the book object and the type of action by destructuring
  const { index, abilityType, abilityTypes, type } = action;
  let newState = clone(state);
  // if "add"
  // return an array of the previous state and the book object

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

  // if "remove"
  // remove the book object in the previous state
  // that matches the title of the current book object
  if (type === "remove") {
    const bookIndex = state.findIndex((x) => x.id === abilityType.id);

    // if no match, return the previous state
    if (bookIndex < 0) return state;

    // avoid mutating the original state, create a copy
    const stateUpdate = [...state];

    // then splice it out from the array
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

  return (
    <AbilitiesContext.Provider
      value={{ abilities, setAbilities, abilityTypes, setAbilityTypes }}
    >
      {children}
    </AbilitiesContext.Provider>
  );
};
