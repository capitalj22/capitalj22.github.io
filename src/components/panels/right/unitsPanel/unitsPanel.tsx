import { useContext, useEffect, useState } from "react";
import { Plus } from "react-feather";
import { BuildContext } from "../../../../providers/build/buildProvider";
import { stateContext } from "../../../../providers/state/stateProvider";
import { BigButton } from "../../../common/buttons/bigButton";
import { Accordion } from "../../../layout/accordion/accordion";
import { UnitCard } from "./unitCard";
import "./unitsPanel.scss";
import { AbilityFiltersProvider } from "../../../common/filters/abilityFilterProvider";
import { AbilityFilterPanel } from "../../../common/filters/abilityFilterPanel";
import { difference, filter, reduce, sortBy, uniq } from "lodash-es";

function getDefaultUnitTags(defaultUnits) {
  return reduce(
    defaultUnits,
    (acc, unit) => {
      return uniq([...acc, ...(unit.tags || [])]);
    },
    [] as string[]
  );
}

function filterUnits(units, filters) {
  let filteredUntis = units;
  if (filters) {
    filteredUntis = filter(units, (unit) => {
      let matches = true;
      if (filters.tags?.length) {
        matches = difference(filters.tags, unit.tags).length === 0;
      }
      if (filters.textFilter?.length) {
        matches =
          matches &&
          unit.name.toLowerCase().includes(filters.textFilter.toLowerCase());
      }
      return matches;
    });
  } else {
    filteredUntis = units;
  }

  return sortBy(filteredUntis, "name");
}
export function UnitsPanel() {
  const { customUnits, setCustomUnits, defaultUnits, setDefaultUnits } =
    useContext(BuildContext);
  const { appMode } = useContext(stateContext);
  const [defaultUnitTags, setDefaultUnitTags] = useState(
    getDefaultUnitTags(defaultUnits)
  );
  const [filters, setFilters] = useState({ tags: null, textFilter: null });

  useEffect(() => {
    setDefaultUnitTags(getDefaultUnitTags(defaultUnits));
  }, [defaultUnits]);

  const addCustomPressed = () => {
    setCustomUnits({
      type: "add",
      unit: { id: `unit-${Math.floor(Math.random() * 20000)}` },
    });
  };

  const addDefaultPressed = () => {
    setDefaultUnits({
      type: "add",
      unit: { id: `unit-${Math.floor(Math.random() * 20000)}` },
    });
  };

  return (
    <div className="units-panel">
      <Accordion name="My Units" startOpen={true}>
        <div className="padding-md">
          <div className="unit-cards">
            {customUnits.map((unit, index) => (
              <UnitCard key={unit.id} unit={unit} unitType="custom" />
            ))}
          </div>
          <div className="padding-md-vertical">
            <BigButton color="info" type="outline" clicked={addCustomPressed}>
              New Custom Unit <Plus />
            </BigButton>
          </div>
        </div>
      </Accordion>
      <Accordion name="Standard Units" startOpen={true}>
        <AbilityFiltersProvider>
          <AbilityFilterPanel
            name="Filter Units"
            expanded={false}
            tags={defaultUnitTags || []}
            filtersUpdated={setFilters}
          />
          <div className="padding-md">
            <div className="unit-cards">
              {filterUnits(defaultUnits, filters).map((unit) => (
                <UnitCard key={unit.id} unit={unit} unitType="default" />
              ))}
            </div>
            {appMode === "edit" && (
              <div className="padding-md-vertical">
                <BigButton
                  color="info"
                  type="outline"
                  clicked={addDefaultPressed}
                >
                  New Default Unit <Plus />
                </BigButton>
              </div>
            )}
          </div>
        </AbilityFiltersProvider>
      </Accordion>
    </div>
  );
}
