import { filter, intersection, map, reduce, sortBy, uniq } from "lodash-es";
import { useContext, useState } from "react";
import { ChevronsDown, ChevronsUp, PlusSquare } from "react-feather";
import { Ability } from "../../../../entities/abilities/abilities";
import { AbilitiesContext } from "../../../../providers/abilities/abilitiesProvider";
import { AbilityCard } from "../../../characterSheet/abilityCard/abilityCard";
import { TagFilters } from "../../../characterSheet/tagFilters/tagFilters";
import { SmolButton } from "../../../common/buttons/smolButton";
import { FancyTextInput } from "../../../common/tag-input/fancyTextInput";
import "./abilityEditor.scss";

function filterAbilities(abilities, filters) {
  return filter(abilities, (ability) => {
    let matches = true;
    if (filters.tags?.length) {
      matches = intersection(filters.tags, ability.tags).length > 0;
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

export function AbilityEditor({ abilitiesChanged }) {
  const { abilities, setAbilities } = useContext(AbilitiesContext);
  const [filters, setFilters] = useState({
    tags: [] as string[],
    textFilter: "",
  });
  const [allExpanded, setAllExpanded] = useState(false);
  const [focusedAbility, setFocusedAbility] = useState("");

  const abilityEdited = (event) => {
    let newAbilities = map(abilities, (ability) => {
      if (ability.id === event.id) {
        return event.ability;
      }
      return ability;
    });

    setAbilities(newAbilities);
    abilitiesChanged(newAbilities);
  };

  const abilityCopied = (event) => {
    // let newAbilities = map(abilities, (ability) => {
    //   if (ability.id === event.id) {
    //     return event.ability;
    //   }
    //   return ability;
    // });
    // newAbilities.push({
    //   ...event.ability,
    //   id: `${event.ability.id}-copy`,
    //   name: `${event.ability.name} Copy`,
    // });
    // setAbilities(newAbilities);
    // abilitiesChanged(newAbilities);
  };

  const abilityRemoved = (id) => {
    // let newAbilities = filter(abilities, (ability) => ability.id !== id);
    // setAbilities(newAbilities);
    // abilitiesChanged(newAbilities);
    setAbilities({ type: "remove", ability: { id } });
  };

  const addButtonPressed = () => {
    const newId = `id-${Math.floor(Math.random() * 200)}`;
    setAbilities({
      type: "add",
      ability: {
        name: "Name",
        id: newId,
        description: "",
        tags: [],
        type: "action",
      },
    });

    setFocusedAbility(newId);
    // setAbilities([
    //   ...abilities,
    //   { name: "Name", id: "id", description: "...", tags: [], type: "action" },
    // ]);
  };

  const toggleExpandAll = () => {
    setAllExpanded(!allExpanded);
  };

  // useEffect(() => {
  //   setAbilities(orderBy(abilities, "name"));
  // }, [abilities]);
  return (
    <div className="ability-editor">
      <div className="filters">
        <div className="tag-filters">
          <FancyTextInput
            placeholder="Filter by name"
            minWidth={200}
            className="text-filter"
            value={filters.textFilter}
            valueChanged={(e) => setFilters({ ...filters, textFilter: e })}
          />
          <TagFilters
            tags={getTags(abilities)}
            selectedTagsChanged={(e) => {
              setFilters({ ...filters, tags: e });
            }}
          />
        </div>
      </div>
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
