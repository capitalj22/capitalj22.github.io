import { clone } from "lodash-es";
import { createContext, useReducer } from "react";
export const TagsContext = createContext(
  {} as { tagColors: any; setTagColors: any }
);

function getTagColors() {
  const tagColors = window.localStorage.getItem("dragon-tagColors");
  if (tagColors) {
    try {
      return JSON.parse(tagColors);
    } catch (e) {
      return {};
    }
  } else {
    return {};
  }
}

const tagColorsReducer = (state, action) => {
  const { tag, color, type, colors } = action;
  let newState = clone(state);

  if (type === "add") {
    newState[tag] = color;
    return newState;
  }

  if (type === "set") {
    newState = colors || {};
    window.localStorage.setItem("dragon-tagColors", JSON.stringify(newState));

    return colors;
  }

  if (type === "save") {
    window.localStorage.setItem("dragon-tagColors", JSON.stringify(newState));
  }

  return state;
};

export const TagsProvider = ({ children }) => {
  const [tagColors, setTagColors] = useReducer(
    tagColorsReducer,
    getTagColors()
  );
  return (
    <TagsContext.Provider value={{ tagColors, setTagColors }}>
      {children}
    </TagsContext.Provider>
  );
};
