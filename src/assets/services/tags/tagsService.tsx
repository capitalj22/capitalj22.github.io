import { clone } from "lodash-es";
import { createContext, useReducer, useState } from "react";
export const TagsContext = createContext(
  {} as { tagColors: any; setTagColors: any }
);

function getTagColors() {
  const tagColors = window.localStorage.getItem("dragon-tagColors");
  if (tagColors) {
    return JSON.parse(tagColors);
  } else {
    return {};
  }
}

const tagColors = getTagColors();

// saved books reducer function
const tagColorsReducer = (state, action) => {
  // get the book object and the type of action by destructuring
  const { tag, color, type, colors } = action;
  let newState = clone(state);
  // if "add"
  // return an array of the previous state and the book object
  if (type === "add") {
    newState[tag] = color;
    window.localStorage.setItem("dragon-tagColors", JSON.stringify(newState));
    return newState;
  }

  if (type === "set") {
    newState = colors;
    window.localStorage.setItem("dragon-tagColors", JSON.stringify(newState));
    return colors;
  }

  // if "remove"
  // remove the book object in the previous state
  // that matches the title of the current book object
  //   if (type === "remove") {
  //     const bookIndex = state.findIndex((x) => x.title === book.title);

  //     // if no match, return the previous state
  //     if (bookIndex < 0) return state;

  //     // avoid mutating the original state, create a copy
  //     const stateUpdate = [...state];

  //     // then splice it out from the array
  //     stateUpdate.splice(bookIndex, 1);
  //     return stateUpdate;
  //   }
  return state;
};

// const tagColorsReducer = (state, action) => {};

export const TagsProvider = ({ children }) => {
  const [tagColors, setTagColors] = useReducer(
    tagColorsReducer,
    getTagColors()
  );
  //   const [savedTags, setSavedTags] = useReducer(savedTagsReducer, []);
  return (
    <TagsContext.Provider value={{ tagColors, setTagColors }}>
      {children}
    </TagsContext.Provider>
  );
};
