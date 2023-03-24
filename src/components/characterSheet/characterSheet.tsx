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
  return groupBy(
    map(
      filter(build.abilities, (ability) => {
        return !ability.replaced && ability.learned;
      }),
      (ability) => ({
        ...ability,
      })
    ),
    "type"
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
  let abilityTags = {};
  each(Object.keys(knownAbilities), (typeName) => {
    let tags: string[] = [];
    each(knownAbilities[typeName], (knownAbility) => {
      const id = knownAbility.id;
      knownAbility.ability = find(abilities as any, { id });

      if (knownAbility.tags) {
        tags = uniq([...tags, ...knownAbility.tags]);
      }
    });
    abilityTags[typeName] = sortBy(tags);
  });

  return { abilityTags, knownAbilities };
}

function CharacterSheet() {
  const { build } = useContext(BuildContext);
  const { abilityTypes, abilities } = useContext(AbilitiesContext);
  const [knownAbilities, setKnownAbilities] = useState({});
  const [abilityTags, setAbilityTags] = useState({});
  const { stats } = useContext(StatsContext);
  const [filters, setFilters] = useState({});
  const { ref, active, width } = useContainerQueries({
    breakpoints: breakpoints as any,
  });
  const [allExpanded, setAllExpanded] = useState({});

  const toggleExpandAll = (key) => {
    setAllExpanded({ ...allExpanded, ...{ [key]: !allExpanded[key] } });
  };

  useEffect(() => {
    const result = formatKnownAbilitiesAndTags(build, abilities);
    setKnownAbilities(result.knownAbilities);
    setAbilityTags(result.abilityTags);
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
            label={stat.name}
            value={build.stats[stat.id] || 0}
          ></StatLine>
        ))}
      </div>
      <div className="abilities">
        <div className="title">Abilities</div>
        {sortBy(abilityTypes, "name").map((type, index) => (
          <Accordion
            key={index}
            startOpen={false}
            name={type.name}
            disabled={!knownAbilities[type.id]?.length}
          >
            <AbilityFiltersProvider>
              <AbilityFilterPanel
                expanded={false}
                tags={abilityTags[type.id] || []}
                filtersUpdated={(e) => setFilters({ ...filters, [type.id]: e })}
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
                  knownAbilities[type.id],
                  filters[type.id]
                )?.map((knownAbility) => (
                  <div>
                    {knownAbility?.ability && (
                      <AbilityCard
                        ability={knownAbility.ability}
                        isPlayerAbility={true}
                        modifiers={knownAbility.modifiers}
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
    </div>
  );
}

export default CharacterSheet;
