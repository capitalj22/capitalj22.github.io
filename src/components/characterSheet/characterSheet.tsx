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

function CharacterSheet() {
  const { build } = useContext(BuildContext);
  const { abilityTypes } = useContext(AbilitiesContext);
  const [knownAbilities, setKnownAbilities] = useState({});
  const [abilityTags, setAbilityTags] = useState({});
  const { stats } = useContext(StatsContext);

  useEffect(() => {
    const abilities = getKnownAbilities(build);

    let abilityTagsTemp = {};
    each(Object.keys(abilities), (typeName) => {
      let tags: string[] = [];
      each(abilities[typeName], (ability) => {
        if (ability.tags) {
          tags = uniq([...tags, ...ability.tags]);
        }
      });
      abilityTagsTemp[typeName] = sortBy(tags);
    });
    setKnownAbilities(abilities);
    setAbilityTags(abilityTagsTemp);
  }, [build]);

  const handleSelectedTagsChanged = (tags, key) => {
    let tempAbilities = getKnownAbilities(build);

    if (tags.length) {
      tempAbilities[key] = filter(
        tempAbilities[key],
        (ability) => ability.tags && intersection(ability.tags, tags).length
      );
    }

    setKnownAbilities(tempAbilities);
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
          <StatLine label={stat.name} value={build.stats[stat.id] || 0}></StatLine>
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
              {knownAbilities[type.id]?.map((ability) => (
                <AbilityCard
                  ability={ability}
                  isPlayerAbility={true}
                  modifiers={ability.modifiers}
                  startOpen={true}
                ></AbilityCard>
              ))}
            </div>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

export default CharacterSheet;
