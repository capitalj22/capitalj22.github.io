import { clone } from "lodash-es";
import { createContext, useReducer } from "react";
export const BuildContext = createContext({} as any);

function getBuild() {
  const build = window.localStorage.getItem("dragon-build");
  if (build) {
    return JSON.parse(build);
  } else {
    return [];
  }
}

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

  return (
    <BuildContext.Provider
      value={{ build, setBuild, savedBuild, setSavedBuild }}
    >
      {children}
    </BuildContext.Provider>
  );
};
