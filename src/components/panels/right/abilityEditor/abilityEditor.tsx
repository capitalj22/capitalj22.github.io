import { difference, filter, reduce, sortBy, uniq } from "lodash-es";
import { useContext, useState } from "react";
import { ChevronsDown, ChevronsUp, PlusSquare } from "react-feather";
import { Ability } from "../../../../entities/abilities/abilities";
import { AbilitiesContext } from "../../../../providers/abilities/abilitiesProvider";
import { AbilityCard } from "../../../characterSheet/abilityCard/abilityCard";
import { SmolButton } from "../../../common/buttons/smolButton";
import { AbilityFilterPanel } from "../../../common/filters/abilityFilterPanel";
import { AbilityFiltersProvider } from "../../../common/filters/abilityFilterProvider";
import "./abilityEditor.scss";

function filterAbilities(abilities, filters) {
  return filter(abilities, (ability) => {
    let matches = true;
    if (filters.tags?.length) {
      matches = difference(filters.tags, ability.tags).length === 0;
    }
    if (filters.textFilter?.length) {
      matches =
        matches &&
        ability.name.toLowerCase().includes(filters.textFilter.toLowerCase());
    }
    return matches;
  });
}

function getTags(abilities: Ability[]) {
  const tags = reduce(
    abilities,
    (allTags, ability) => {
      if (ability?.tags?.length) {
        return [...allTags, ...ability.tags];
      } else {
        return allTags;
      }
    },
    [] as string[]
  );

  return sortBy(uniq(tags));
}

export function AbilityEditor() {
  const { abilities, setAbilities } = useContext(AbilitiesContext);
  const [filters, setFilters] = useState({
    tags: [] as string[],
    textFilter: "",
  });
  const [allExpanded, setAllExpanded] = useState(false);
  const [focusedAbility, setFocusedAbility] = useState("");

  const abilityEdited = (event) => {};

  const abilityCopied = (event) => {
    setFocusedAbility(event.id);
  };

  const abilityRemoved = (id) => {
    setAbilities({ type: "remove", ability: { id } });
    setAbilities({ type: "save" });
  };

  const filtersUpdated = (event) => {
    setFilters(event);
  };
  const addButtonPressed = () => {
    const newId = `id-${Math.floor(Math.random() * 200)}`;
    setAbilities({
      type: "add",
      ability: {
        name: filters.textFilter || "New Ability",
        id: newId,
        description: "",
        tags: filters.tags,
        type: "action",
      },
    });

    setFocusedAbility(newId);
  };

  const toggleExpandAll = () => {
    setAllExpanded(!allExpanded);
  };

  return (
    <div className="ability-editor">
      <AbilityFiltersProvider>
        <AbilityFilterPanel
          expanded={true}
          tags={getTags(abilities)}
          filtersUpdated={filtersUpdated}
          // filtersUpdated={(filters) => {}}
        />
      </AbilityFiltersProvider>

      <div className="expand-button">
        Abilities
        <SmolButton color="theme" clicked={toggleExpandAll}>
          {allExpanded ? <ChevronsDown size={30} /> : <ChevronsUp size={30} />}
        </SmolButton>
      </div>
      <div className="ability-cards">
        <div className="card-wrapper new-button">
          <button onClick={addButtonPressed}>
            <PlusSquare /> New Ability
          </button>
        </div>
        {filterAbilities(abilities, filters).map((ability, index) => (
          <div className="card-wrapper">
            <AbilityCard
              key={index}
              ability={ability}
              isPlayerAbility={true}
              modifiers={ability.modifiers}
              startOpen={false}
              isExpanded={allExpanded}
              editable={true}
              forceIsEditing={ability.id === focusedAbility}
              abilityEdited={abilityEdited}
              abilityCopied={abilityCopied}
              abilityRemoved={abilityRemoved}
            ></AbilityCard>
          </div>
        ))}
        {filterAbilities(abilities, filters).length > 10 && (
          <div className="card-wrapper new-button">
            <button onClick={addButtonPressed}>
              <PlusSquare /> New Ability
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
