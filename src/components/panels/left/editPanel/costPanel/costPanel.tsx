import { clone, times } from "lodash-es";
import { useEffect, useState } from "react";
import { MinusSquare, PlusSquare } from "react-feather";
import "./costPanel.scss";

function convertLevelCost(levelCost, levels, cost) {
  if (levels) {
    if (levelCost?.length) {
      return levelCost;
    } else {
      const lvlArray: number[] = [];
      times(levels, () => lvlArray.push(levelCost || cost || 1));
      return lvlArray;
    }
  } else {
    return [cost || 1];
  }
}

function update(levels, levelCost, levelsChanged) {
  levelsChanged({ levels, levelCost });
}

export function CostPanel({ levels, levelCost, cost, color, levelsChanged }) {
  const [_levels, setLevels] = useState(levels || 1);
  const [_levelCost, setLevelCost] = useState(
    convertLevelCost(levelCost, levels || 1, cost || 1)
  );

  useEffect(() => {
    setLevels(levels || 1);
    setLevelCost(convertLevelCost(levelCost, levels, cost));
  }, [levels, levelCost, cost]);

  const costPlusClicked = (event) => {
    let newLevels = _levels + 1;
    let newLevelCost = _levelCost;

    if (newLevelCost.length) {
      newLevelCost = [...newLevelCost, 1];
    }

    update(newLevels, newLevelCost, levelsChanged);
  };

  const costMinusClicked = (event) => {
    let newLevels = levels;
    let newLevelCost = levelCost;

    if (levels > 1) {
      newLevels = levels - 1;

      if (newLevelCost.length) {
        newLevelCost = newLevelCost.slice(0, newLevelCost.length - 1);
      }
    }

    update(newLevels, newLevelCost, levelsChanged);
  };

  const costClicked = (event, index) => {
    let newCost = clone(_levelCost);
    if (!event.shiftKey) {
      newCost[index] += 1;
    } else if (newCost[index] > 1) {
      newCost[index] -= 1;
    }
    update(_levels, newCost, levelsChanged);
  };

  return (
    <div className="cost-panel">
      <button onClick={costMinusClicked}>
        <MinusSquare />
      </button>
      <div className="levels">
        {times(_levels, (index) => (
          <span key={index} onClick={(e) => costClicked(e, index)} className="level-points">
            <span
              className="level-dot"
              style={{
                background: color,
              }}
            >
              {_levelCost.length ? _levelCost[index] : _levelCost}
            </span>
          </span>
        ))}
      </div>

      <button onClick={costPlusClicked}>
        <PlusSquare />
      </button>
    </div>
  );
}
