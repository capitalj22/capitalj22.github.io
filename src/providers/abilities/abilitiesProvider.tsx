import { clone, map } from "lodash-es";
import { createContext, useReducer } from "react";

export const AbilitiesContext = createContext(
  {} as { abilities: any; setAbilities: any }
);

function getAbilities() {
  const abilities = window.localStorage.getItem("dragon-abilities");
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

    console.log(newState)

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

export const AbilitiesProvider = ({ children }) => {
  const [abilities, setAbilities] = useReducer(
    abilitiesReducer,
    getAbilities()
  );
  return (
    <AbilitiesContext.Provider value={{ abilities, setAbilities }}>
      {children}
    </AbilitiesContext.Provider>
  );
};
