import { createContext, useReducer, useState } from "react";

export const stateContext = createContext({} as any);

// @TODO - move this to a better provider
function getVersion() {
  const version = window.localStorage.getItem("dragon-config-version");
  if (version) {
    try {
      return JSON.parse(version);
    } catch (e) {
      return "0.0.0";
    }
  } else {
    return "0.0.0";
  }
}

function versionReducer(state, action) {
  const { type, version } = action;

  if (type === "set") {
    window.localStorage.setItem(
      "dragon-config-version",
      JSON.stringify(version)
    );
    return version;
  }
}

export const StateProvider = ({ children }) => {
  const [appMode, setAppMode] = useState("build-slow");
  const [buildMode, setBuildMode] = useState("build-slow");
  const [rightExpanded, setRightExpanded] = useState(true);
  const [leftExpanded, setLeftExpanded] = useState(true);
  const [version, setVersion] = useReducer(versionReducer, getVersion());

  return (
    <stateContext.Provider
      value={{
        appMode,
        setAppMode,
        rightExpanded,
        setRightExpanded,
        leftExpanded,
        setLeftExpanded,
        version,
        setVersion,
        buildMode,
        setBuildMode,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};
