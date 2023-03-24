import { createContext, useState } from "react";

export const stateContext = createContext({} as any);

export const StateProvider = ({ children }) => {
  const [appMode, setAppMode] = useState("build");
  return (
    <stateContext.Provider value={{ appMode, setAppMode }}>
      {children}
    </stateContext.Provider>
  );
};
