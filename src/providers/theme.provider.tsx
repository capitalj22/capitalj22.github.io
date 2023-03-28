import { clone, each } from "lodash-es";
import { createContext, useReducer } from "react";
export const ThemeContext = createContext({} as any);

export const COLOR_THEMES = {
  default: {
    "--themeColor": "#3bac99",
    "--themeColorMod": "#2f808f",
    "--themeColorText": "#a4dbe2",
    "--panelColor": "#1b1b1d",
    "--panelColor2": "#2e2e34",
    "--panelColor3": "#25262c",
  },
  alt1: {
    "--themeColor": "#6d63f8",
    "--themeColorMod": "#5557e0",
    "--themeColorText": "#a08dcc",
    "--panelColor": "#1b1b1d",
    "--panelColor2": "#2e2e34",
    "--panelColor3": "#25262c",
  },
  alt2: {
    "--themeColor": "#c155ac",
    "--themeColorMod": "#9d4980",
    "--themeColorText": "#df82d5",
    "--panelColor": "#22262f",
    "--panelColor2": "#2c3139",
    "--panelColor3": "#2c353e",
  },
  autumn: {
    "--themeColor": "#e34841",
    "--themeColorMod": "#bf342d",
    "--themeColorText": "#fbb87e",
    "--panelColor": "#22292f",
    "--panelColor2": "#222224",
    "--panelColor3": "#2b2c32",
  },
  steel: {
    "--themeColor": "#405185",
    "--themeColorMod": "#313f68",
    "--themeColorText": "#cd725a",
    "--panelColor": "#1a1d26",
    "--panelColor2": "#282d34",
    "--panelColor3": "#2d3234",
  },
};

function getTheme() {
  const build = window.localStorage.getItem("dragon-theme");
  if (build) {
    return JSON.parse(build);
  } else {
    return "dark";
  }
}

function getColorTheme() {
  const colorTheme = window.localStorage.getItem("dragon-color-theme");

  if (colorTheme) {
    const parsedTheme = JSON.parse(colorTheme);
    each(Object.keys(COLOR_THEMES[parsedTheme]), (key) => {
      document.documentElement.style.setProperty(
        key,
        COLOR_THEMES[parsedTheme][key]
      );
    });
    return parsedTheme;
  } else {
    return "default";
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

const colorThemeReducer = (state, action) => {
  const { theme, type } = action;
  let newState = clone(state);
  if (type === "set") {
    newState = theme;

    each(Object.keys(COLOR_THEMES[theme]), (key) => {
      document.documentElement.style.setProperty(
        key,
        COLOR_THEMES[action.theme][key]
      );
    });
    window.localStorage.setItem("dragon-color-theme", JSON.stringify(newState));
    return newState;
  }

  return state;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useReducer(themeReducer, getTheme());
  const [colorTheme, setColorTheme] = useReducer(
    colorThemeReducer,
    getColorTheme()
  );

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, colorTheme, setColorTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
