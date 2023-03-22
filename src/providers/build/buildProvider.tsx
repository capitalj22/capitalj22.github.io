import { clone } from "lodash-es";
import { createContext, useReducer } from "react";
export const BuildContext = createContext({} as { build: any; setBuild: any });

function getBuild() {
  const build = window.localStorage.getItem("dragon-build");
  if (build) {
    return JSON.parse(build);
  } else {
    return [];
  }
}

const buildReducer = (state, action) => {
  const { build, type } = action;
  let newState = clone(state);
  console.log(state, action);
  if (type === "set") {
    newState = build;
    window.localStorage.setItem("dragon-build", JSON.stringify(newState));
    return newState;
  }

  return state;
};

export const BuildProvider = ({ children }) => {
  const [build, setBuild] = useReducer(buildReducer, getBuild());
  return (
    <BuildContext.Provider value={{ build, setBuild }}>
      {children}
    </BuildContext.Provider>
  );
};
