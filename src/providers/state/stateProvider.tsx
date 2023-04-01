import { clone } from "lodash-es";
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

function getAppMenuConfig() {
  const defaultConfig = {
    code: "right",
    edit: "right",
    help: "right",
    info: "left",
    sheet: "right",
    settings: "left",
    theme: "right",
    units: "left",
    zap: "right",
  };

  const config = window.localStorage.getItem("dragon-app-menu-config");
  if (config) {
    try {
      return JSON.parse(config);
    } catch (e) {
      return defaultConfig;
    }
  } else {
    return defaultConfig;
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

function appMenuConfigReducer(state, action) {
  const { type, config, item } = action;
  let newState = clone(state);

  if (type === "setItem") {
    newState = { ...newState, ...item };
    window.localStorage.setItem(
      "dragon-app-menu-config",
      JSON.stringify(newState)
    );
    console.log(newState);
    
    return newState;
  }
}

export const StateProvider = ({ children }) => {
  const [appMode, setAppMode] = useState("build-slow");
  const [buildMode, setBuildMode] = useState("build-slow");
  const [rightExpanded, setRightExpanded] = useState(false);
  const [leftExpanded, setLeftExpanded] = useState(true);
  const [version, setVersion] = useReducer(versionReducer, getVersion());
  const [appMenuConfig, setAppMenuConfig] = useReducer(
    appMenuConfigReducer,
    getAppMenuConfig()
  );
  const [selectedMenus, setSelectedMenus] = useState({
    left: "info",
    right: "sheet",
  });

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
        appMenuConfig,
        setAppMenuConfig,
        selectedMenus,
        setSelectedMenus,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};
