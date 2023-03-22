import { createContext, useState } from "react";
export const abilityFiltersContext = createContext({} as any);

export const AbilityFiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState({ textFilter: "", tags: [] });

  return (
    <abilityFiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </abilityFiltersContext.Provider>
  );
};
