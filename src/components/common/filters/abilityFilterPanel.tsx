import { useContext, useEffect, useState } from "react";
import { ChevronUp, Minus, Plus, RotateCcw } from "react-feather";
import { TagFilters } from "../../characterSheet/tagFilters/tagFilters";
import { SmolButton } from "../buttons/smolButton";
import { FancyTextInput } from "../tag-input/fancyTextInput";
import "./abilityFilterPanel.scss";
import { abilityFiltersContext } from "./abilityFilterProvider";

export function AbilityFilterPanel({ tags, expanded, filtersUpdated }) {
  const { filters, setFilters } = useContext(abilityFiltersContext);
  const [isExpanded, setIsExpanded] = useState(expanded);

  const resetClicked = () => {
    setFilters({ tags: [], textFilter: "" });
  };

  useEffect(() => {
    filtersUpdated(filters);
  }, [filters]);

  if (isExpanded) {
    return (
      <div className="ability-filters open">
        <FancyTextInput
          fullWidth={true}
          placeholder="Filter by name"
          minWidth={200}
          className="text-filter"
          value={filters?.textFilter}
          valueChanged={(e) => setFilters({ ...filters, textFilter: e })}
        />
        <div className="tag-filters">
          <TagFilters tags={tags} />
        </div>
        <div className="controls">
          <SmolButton
            color="theme"
            noPadding={true}
            clicked={resetClicked}
            disabled={!filters.tags.length && !filters.textFilter.length}
          >
            <RotateCcw size={18} />
            reset
          </SmolButton>
          <SmolButton
            color="mutedWhite"
            clicked={() => setIsExpanded(!isExpanded)}
          >
            <Minus size={18} />
          </SmolButton>
        </div>
      </div>
    );
  } else {
    return (
      <div className="ability-filters closed">
        <button onClick={() => setIsExpanded(!isExpanded)} className="controls">
          filters
          <Plus size={18} />
        </button>
      </div>
    );
  }
}
