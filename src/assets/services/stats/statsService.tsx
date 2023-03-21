import { clone } from "lodash-es";
import { createContext, useReducer } from "react";
export const StatsContext = createContext({} as { stats: any; setStats: any });

function getStats() {
  const stats = window.localStorage.getItem("dragon-stats");
  if (stats) {
    return JSON.parse(stats);
  } else {
    return [];
  }
}

// saved books reducer function
const statsReducer = (state, action) => {
  // get the book object and the type of action by destructuring
  const { index, stat, stats, type } = action;
  let newState = clone(state);
  // if "add"
  // return an array of the previous state and the book object

  if (type === "save") {
    try {
      window.localStorage.setItem("dragon-stats", JSON.stringify(newState));
    } catch (err) {}
  }

  if (type === "add") {
    newState = [...newState, stat];
    return newState;
  }

  if (type === "set") {
    newState = stats;
    // window.localStorage.setItem("dragon-stats", JSON.stringify(newState));
    return newState;
  }

  if (type === "update") {
    newState[index] = stat;
    // window.localStorage.setItem("dragon-stats", JSON.stringify(newState));
    return newState;
  }

  // if "remove"
  // remove the book object in the previous state
  // that matches the title of the current book object
  if (type === "remove") {
    const bookIndex = state.findIndex((x) => x.id === stat.id);

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

// const tagColorsReducer = (state, action) => {};

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useReducer(statsReducer, getStats());
  //   const [savedTags, setSavedTags] = useReducer(savedTagsReducer, []);
  return (
    <StatsContext.Provider value={{ stats, setStats }}>
      {children}
    </StatsContext.Provider>
  );
};
