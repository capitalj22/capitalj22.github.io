import { clone } from "lodash-es";
import { createContext, useReducer } from "react";
export const ThemeContext = createContext({} as any);

function getTheme() {
  const build = window.localStorage.getItem("dragon-theme");
  if (build) {
    return JSON.parse(build);
  } else {
    return [];
  }
}

const themeReducer = (state, action) => {
  const { theme, type } = action;
  let newState = clone(state);
  if (type === "set") {
    newState = theme;
    window.localStorage.setItem("dragon-theme", JSON.stringify(newState));
    return newState;
  }

  return state;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useReducer(themeReducer, getTheme());

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
