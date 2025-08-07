import { clone } from "lodash-es";
import { createContext, useReducer, useState } from "react";

export const tearsStateContext = createContext({} as any);

function criesReducer(state, action) {
  let newState = clone(state);

  const { type, val } = action;

  if (type === "add") {
    newState = [...newState, val];
    window.localStorage.setItem("my-cries-cries", JSON.stringify(newState));

    return newState;
  }

  if (type === "set") {
    window.localStorage.setItem("my-cries-cries", JSON.stringify(val));
    
    return val;
  }
}

function getCries() {
  const cries = window.localStorage.getItem("my-cries-cries");

  if (cries) {
    try {
      console.log(cries)
      // return [];
      return JSON.parse(cries);
    } catch (e) {
      return [];
    }
  } else {
    return [];
  }
}

export const TearsStateProvider = ({ children }) => {
  const [cries, setCries] = useReducer(criesReducer, getCries());

  return (
    <tearsStateContext.Provider
      value={{
        cries,
        setCries,
      }}
    >
      {children}
    </tearsStateContext.Provider>
  );
};
