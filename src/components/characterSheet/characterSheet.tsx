import {
  difference,
  each,
  filter,
  find,
  groupBy,
  map,
  sortBy,
  uniq,
} from "lodash-es";
import { useContext, useEffect, useRef, useState } from "react";
import Masonry from "@mui/lab/Masonry";
import { AbilitiesContext } from "../../providers/abilities/abilitiesProvider";
import { BuildContext } from "../../providers/build/buildProvider";
import { StatsContext } from "../../providers/stats/statsProvider";
import { Accordion } from "../layout/accordion/accordion";
import { AbilityCard } from "./abilityCard/abilityCard";
import "./characterSheet.scss";
import { StatLine } from "./statLine/statLine";
import { useContainerQueries } from "use-container-queries";
import { SmolButton } from "../common/buttons/smolButton";
import { ChevronsDown, ChevronsUp } from "react-feather";
import { AbilityFilterPanel } from "../common/filters/abilityFilterPanel";
import { AbilityFiltersProvider } from "../common/filters/abilityFilterProvider";

function getKnownAbilities(build) {
  return map(
    filter(build.abilities, (ability) => {
      return !ability.replaced && ability.learned;
    }),
    (ability) => ({
      ...ability,
    })
  );
}

function filterAbilities(abilities, filters) {
  let newAbilities = abilities;
  if (filters) {
    newAbilities = filter(abilities, (ability) => {
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
  } else {
    newAbilities = abilities;
  }

  return sortBy(newAbilities, "name");
}

const breakpoints = {
  small: [0, 600],
  med: [600, 900],
  large: [901, 1150],
  xl: [1151, 1400],
  xxl: [1401, 1600],
  xxxl: [1601, 2000],
};

function getColumns(active) {
  const columns = {
    small: 1,
    med: 2,
    large: 3,
    xl: 4,
    xxl: 5,
    xxxl: 6,
  };

  return columns[active];
}

function formatKnownAbilitiesAndTags(build, abilities) {
  let knownAbilities = getKnownAbilities(build);
  let knownAbilitiesByType = groupBy(knownAbilities, "type");
  let abilityTags = {};
  let allAbilityTags: string[] = [];

  each(knownAbilities, (ability) => {
    abilityTags[ability.name] = ability.tags;
  });

  each(Object.keys(knownAbilitiesByType), (typeName) => {
    let tags: string[] = [];
    each(knownAbilitiesByType[typeName], (knownAbility) => {
      const id = knownAbility.id;
      knownAbility.ability = find(abilities as any, { id });

      if (knownAbility.tags) {
        tags = uniq([...tags, ...knownAbility.tags]);
      }
    });
    allAbilityTags = uniq([...allAbilityTags, ...tags]);
    abilityTags[typeName] = sortBy(tags);
  });

  return { abilityTags, knownAbilities, knownAbilitiesByType, allAbilityTags };
}

function CharacterSheet() {
  const { build } = useContext(BuildContext);
  const { abilityTypes, abilities } = useContext(AbilitiesContext);
  const [knownAbilities, setKnownAbilities] = useState({});
  const [knownAbilitiesByType, setKnownAbilitiesByType] = useState({});
  const [abilityTags, setAbilityTags] = useState({});
  const [allAbilityTags, setAllAbilityTags] = useState([] as string[]);
  const { stats } = useContext(StatsContext);
  const [filters, setFilters] = useState({});
  const [globalFilters, setGlobalFilters] = useState({});
  const { ref, active, width } = useContainerQueries({
    breakpoints: breakpoints as any,
  });
  const {
    ref: ref2,
    active: active2
  } = useContainerQueries({
    breakpoints: breakpoints as any,
  });
  const [allExpanded, setAllExpanded] = useState({});
  const [globalFilterActive, setGlobalFilterActive] = useState(false);

  const toggleExpandAll = (key) => {
    setAllExpanded({ ...allExpanded, ...{ [key]: !allExpanded[key] } });
  };

  const globalFiltersUpdated = (filters) => {
    setGlobalFilterActive(filters.tags.length || filters.textFilter.length);
    setGlobalFilters(filters);
  };

  useEffect(() => {
    const result = formatKnownAbilitiesAndTags(build, abilities);
    setKnownAbilities(result.knownAbilities);
    setKnownAbilitiesByType(result.knownAbilitiesByType);
    setAbilityTags(result.abilityTags);
    setAllAbilityTags(result.allAbilityTags);
  }, [build, abilities]);

  return (
    <div className="character-sheet">
      <div className="stats">
        <div className="title">Stats</div>
        <StatLine
          label=" Skill Points Spent"
          value={build.pointsInvested}
        ></StatLine>
        {map(stats, (stat, key) => (
          <StatLine
            key={key}
            label={stat.name}
            value={build.stats[stat.id] || 0}
          ></StatLine>
        ))}
      </div>
      <div className="abilities">
        <div className="title">Abilities</div>
        <AbilityFiltersProvider>
          <AbilityFilterPanel
            name="filter all"
            tags={allAbilityTags}
            expanded={true}
            filtersUpdated={globalFiltersUpdated}
          />
        </AbilityFiltersProvider>
        {!globalFilterActive && (
          <div className="accordions">
            {sortBy(abilityTypes, "name").map((type, index) => (
              <Accordion
                key={index}
                startOpen={false}
                name={type.name}
                disabled={!knownAbilitiesByType[type.id]?.length}
              >
                <AbilityFiltersProvider>
                  <AbilityFilterPanel
                    expanded={false}
                    tags={abilityTags[type.id] || []}
                    filtersUpdated={(e) =>
                      setFilters({ ...filters, [type.id]: e })
                    }
                  />
                </AbilityFiltersProvider>
                <div ref={ref} className="ability-cards">
                  <div className="expand-button">
                    <SmolButton
                      color="theme"
                      clicked={() => toggleExpandAll(type.id)}
                    >
                      {!!allExpanded[type.id] ? (
                        <ChevronsUp size={30} />
                      ) : (
                        <ChevronsDown size={30} />
                      )}
                    </SmolButton>
                  </div>
                  <Masonry columns={getColumns(active)} spacing={2}>
                    {filterAbilities(
                      knownAbilitiesByType[type.id],
                      filters[type.id]
                    )?.map((knownAbility, index) => (
                      <div key={index}>
                        {knownAbility?.ability && (
                          <AbilityCard
                            ability={knownAbility.ability}
                            isPlayerAbility={true}
                            modifiers={knownAbility.modifiers}
                            tags={knownAbility.tags}
                            playerGlobalParams={build.globalParams}
                            startOpen={false}
                            isExpanded={!!allExpanded[type.id]}
                          ></AbilityCard>
                        )}
                      </div>
                    ))}
                  </Masonry>
                </div>
              </Accordion>
            ))}
          </div>
        )}
        {!!globalFilterActive && (
          <div ref={ref2} className="ability-cards">
            <Masonry columns={getColumns(active2)} spacing={1.5}>
              {filterAbilities(knownAbilities, globalFilters)?.map(
                (knownAbility, index) => (
                  <div key={index}>
                    {knownAbility?.ability && (
                      <AbilityCard
                        ability={knownAbility.ability}
                        isPlayerAbility={true}
                        modifiers={knownAbility.modifiers}
                        tags={knownAbility.tags}
                        playerGlobalParams={build.globalParams}
                        startOpen={true}
                      ></AbilityCard>
                    )}
                  </div>
                )
              )}
            </Masonry>
          </div>
        )}
      </div>
    </div>
  );
}

export default CharacterSheet;
