import { useContext, useEffect, useState } from "react";
import { tearsStateContext } from "../../tearsStateProvider";
import "./stats.scss";

import { filter, map } from "lodash-es";
import classNames from "classnames";

export function TearStats() {
  const { cries } = useContext(tearsStateContext);

  const filterCries = (df, c) => {
    switch (df) {
      case "7d":
        return filter(cries, (cry) => {
          const date = new Date(cry.date),
            sevenDaysAgo = new Date();

          sevenDaysAgo.setDate(date.getDate() - 7); // Set the date to 7 days before today

          return date >= sevenDaysAgo;
        });
    }
  };

  const [durationFilter, setDurationFilter] = useState("7d");
  const [filteredCries, setFilteredCries] = useState(cries);
  const [avInt, setAvIng] = useState(null);
  const [rankedLocs, setRankedLocs] = useState();

  useEffect(() => {
    // const newCries = filter(cries, (cry) => {
    //   const date = new Date(cry.date),
    //     sevenDaysAgo = new Date();

    //   sevenDaysAgo.setDate(date.getDate() - 7); // Set the date to 7 days before today

    //   date >= sevenDaysAgo;
    // });

    setFilteredCries(cries);
    const intensities = map(cries, "intensity");
    setAvIng(
      (intensities.reduce((acc, v) => acc + v, 0) / intensities.length).toFixed(
        2
      )
    );
    const locs = map(cries, "where");
  }, [durationFilter, cries]);
  return (
    <div className="cry-stats">
      <div className="label">salt stats</div>
      <div className="filters">
        <button
          className={classNames({ selected: durationFilter === "7d" })}
          type="button"
          onClick={() => setDurationFilter("7d")}
        >
          7d
        </button>
        <button
          className={classNames({ selected: durationFilter === "1m" })}
          type="button"
          onClick={() => setDurationFilter("1m")}
        >
          1m
        </button>
        <button
          className={classNames({ selected: durationFilter === "3m" })}
          type="button"
          onClick={() => setDurationFilter("3m")}
        >
          3m
        </button>
        <button
          className={classNames({ selected: durationFilter === "ytd" })}
          type="button"
          onClick={() => setDurationFilter("ytd")}
        >
          ytd
        </button>
      </div>
      {filteredCries.length && (
        <div>
          <div className="section">
            <div className="stat-panel">
              <div className="label">intensity</div>
              <div className="blips">
                {filteredCries.map((cry) => (
                  <span
                    className={classNames("blip", {
                      i1: cry.intensity === 1,
                      i2: cry.intensity === 2,
                      i3: cry.intensity === 3,
                      i4: cry.intensity === 4,
                      i5: cry.intensity === 5,
                    })}
                  >
                    {cry.intensity}
                  </span>
                ))}
              </div>
              <div className="tear-stat-line">Average: {avInt}</div>
            </div>
          </div>
          <div className="section">
            <div className="stat-panel">
              <div className="label">locations</div>
              (placeholder)
            </div>
          </div>
          <div className="section">
            <div className="stat-panel">
              <div className="label">triggers</div>
              (placeholder)
            </div>
          </div>
          <div className="section">
            <div className="stat-panel">
              <div className="label">emotions</div>
              (placeholder)
            </div>
          </div>
          <div className="section">
            <div className="stat-panel">
              <div className="label">catharsis</div>
              (placeholder)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
