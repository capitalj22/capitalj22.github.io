import {
  each,
  filter,
  groupBy,
  intersection,
  map,
  sortBy,
  uniq,
} from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { StatsContext } from "../../providers/stats/statsProvider";
import { Accordion } from "../layout/accordion/accordion";
import { AbilityCard } from "./abilityCard/abilityCard";
import "./characterSheet.scss";
import { StatLine } from "./statLine/statLine";
import { TagFilters } from "./tagFilters/tagFilters";

function getKnownAbilities(dragon) {
  return groupBy(
    filter(dragon.abilities, (ability) => {
      return !ability.replaced && ability.learned;
    }),
    "type"
  );
}
function CharacterSheet({ dragon }) {
  const [knownAbilities, setKnownAbilities] = useState({});
  const [abilityTags, setAbilityTags] = useState({});
  const { stats } = useContext(StatsContext);

  useEffect(() => {
    const abilities = getKnownAbilities(dragon);

    let abilityTagsTemp = {};
    each(Object.keys(abilities), (type) => {
      let tags: string[] = [];
      each(abilities[type], (ability) => {
        if (ability.tags) {
          tags = uniq([...tags, ...ability.tags]);
        }
      });
      abilityTagsTemp[type] = sortBy(tags);
    });
    setKnownAbilities(abilities);
    setAbilityTags(abilityTagsTemp);
  }, [dragon]);

  const handleSelectedTagsChanged = (tags, key) => {
    let tempAbilities = getKnownAbilities(dragon);

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
          value={dragon.pointsInvested}
        ></StatLine>
        {map(stats, (stat, key) => (
          <StatLine label={stat.name} value={dragon[stat.id] || 0}></StatLine>
        ))}
      </div>
      <div className="abilities">
        <div className="title">Abilities</div>
        {knownAbilities &&
          sortBy(Object.keys(knownAbilities)).map((key) => (
            <Accordion startOpen={false} name={key}>
              {abilityTags[key].length ? (
                <div className="filter-panel">
                  <TagFilters
                    tags={abilityTags[key]}
                    selectedTagsChanged={(e) =>
                      handleSelectedTagsChanged(e, key)
                    }
                  ></TagFilters>
                </div>
              ) : (
                ""
              )}
              <div className="ability-cards">
                {knownAbilities[key].map((ability) => (
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
