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

const statsReducer = (state, action) => {
  const { index, stat, stats, type } = action;
  let newState = clone(state);

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
    window.localStorage.setItem("dragon-stats", JSON.stringify(newState));
    return newState;
  }

  if (type === "update") {
    newState[index] = stat;
    return newState;
  }

  if (type === "remove") {
    const bookIndex = state.findIndex((x) => x.id === stat.id);

    if (bookIndex < 0) return state;

    const stateUpdate = [...state];

    stateUpdate.splice(bookIndex, 1);
    return stateUpdate;
  }
  return state;
};

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useReducer(statsReducer, getStats());
  return (
    <StatsContext.Provider value={{ stats, setStats }}>
      {children}
    </StatsContext.Provider>
  );
};
