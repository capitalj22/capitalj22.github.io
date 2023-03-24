import { createContext, useState } from "react";

export const stateContext = createContext({} as any);

export const StateProvider = ({ children }) => {
  const [appMode, setAppMode] = useState("build");
  const [rightExpanded, setRightExpanded] = useState(true);
  const [leftExpanded, setLeftExpanded] = useState(true);

  return (
    <stateContext.Provider
      value={{
        appMode,
        setAppMode,
        rightExpanded,
        setRightExpanded,
        leftExpanded,
        setLeftExpanded,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};
