import {
  each,
  filter,
  find,
  groupBy,
  intersection,
  map,
  sortBy,
  uniq,
} from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { AbilitiesContext } from "../../providers/abilities/abilitiesProvider";
import { BuildContext } from "../../providers/build/buildProvider";
import { StatsContext } from "../../providers/stats/statsProvider";
import { Accordion } from "../layout/accordion/accordion";
import { AbilityCard } from "./abilityCard/abilityCard";
import "./characterSheet.scss";
import { StatLine } from "./statLine/statLine";
import { TagFilters } from "./tagFilters/tagFilters";

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
  if (filters) {
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
  } else {
    return abilities;
  }
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

  useEffect(() => {
    const result = formatKnownAbilitiesAndTags(build, abilities);

    setKnownAbilities(result.knownAbilities);
    setAbilityTags(result.abilityTags);
  }, [build, abilities]);

  const handleSelectedTagsChanged = (tags, key) => {
    setFilters({ ...filters, [key]: { tags: tags } });
  };

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
            {abilityTags[type.id]?.length ? (
              <div className="filter-panel">
                <TagFilters
                  tags={abilityTags[type.id]}
                  selectedTagsChanged={(e) =>
                    handleSelectedTagsChanged(e, type.id)
                  }
                ></TagFilters>
              </div>
            ) : (
              ""
            )}
            <div className="ability-cards">
              {filterAbilities(knownAbilities[type.id], filters[type.id])?.map(
                (knownAbility) => (
                  <div>
                    {knownAbility?.ability && (
                      <AbilityCard
                        ability={knownAbility.ability}
                        isPlayerAbility={true}
                        modifiers={knownAbility.modifiers}
                        startOpen={true}
                      ></AbilityCard>
                    )}
                  </div>
                )
              )}
            </div>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

export default CharacterSheet;
