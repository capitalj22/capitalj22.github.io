import { filter, find, map } from "lodash-es";
import React from "react";
import { useState } from "react";
import { ABILITIES } from "../../entities/abilities/abilities";
import { SkillNode } from "../../entities/skilltree/node.entity";
import { AbilityCard } from "../characterSheet/abilityCard/abilityCard";
import "./nodeTooltip.scss";

export function NodeTooltip({ tooltip }) {
  React.useEffect(() => {
    if (tooltip.show) {
      setStyle({
        left: tooltip.x,
        top: tooltip.y + 10,
        visibility: "visible" as any,
        opacity: 1,
      });
    } else {
      setStyle({ top: 0, left: 0, visibility: "hidden" as any, opacity: 0 });
    }
  }, [tooltip]);

  const [style, setStyle] = useState({
    top: 0,
    left: 0,
    visibility: "hidden" as any,
    opacity: 0,
  });
  return (
    <div className="node-tooltip" style={style}>
      <div className="description">{tooltip.node?.description}</div>
    </div>
  );
}
