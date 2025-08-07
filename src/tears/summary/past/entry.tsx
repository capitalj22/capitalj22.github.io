import {
  ChevronDown,
  ChevronUp,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSnow,
} from "react-feather";
import { Cry } from "../../tears";
import { useState } from "react";
import "./entry.scss";
import classNames from "classnames";

interface Props {
  cry: Cry;
}
export function TearsEntry({ cry }: Props) {
  const cryDate = new Date(cry.date);
  const [isExpanded, setIsExpanded] = useState<boolean>();

  const month = cryDate.toLocaleDateString("default", { month: "short" }),
    day = cryDate.getDate();
  return (
    <div>
      <div
        className={classNames("entry", {
          i1: cry.intensity === 1,
          i2: cry.intensity === 2,
          i3: cry.intensity === 3,
          i4: cry.intensity === 4,
          i5: cry.intensity === 5,
        })}
      >
        <button className="top-row" onClick={() => setIsExpanded(!isExpanded)}>
          <span className="details">
            <div className="intensity">
              {cry.intensity === 1 && (
                <span className="int i1">
                  <Cloud size={14} />
                </span>
              )}
              {cry.intensity === 2 && (
                <span className="int i2">
                  <CloudSnow size={14} />
                </span>
              )}
              {cry.intensity === 3 && (
                <span className="int i3">
                  <CloudDrizzle size={14} />
                </span>
              )}
              {cry.intensity === 4 && (
                <span className="int i4">
                  <CloudRain size={14} />
                </span>
              )}
              {cry.intensity === 5 && (
                <span className="int i5">
                  <CloudLightning size={14} />
                </span>
              )}
            </div>
            <div className="date">
              {month} {day}
            </div>
          </span>
          <div className="toggle">
            {isExpanded && <ChevronUp />} {!isExpanded && <ChevronDown />}
          </div>
        </button>
        {isExpanded && (
          <div className="extras">
            <div>
              <span>location</span> - <span className="value">{cry.where}</span>
            </div>
            <div>
              <span>trigger</span> -{" "}
              <span className="value">{cry.trigger}</span>
            </div>
            <div>
              <span>emotion</span> -{" "}
              <span className="value">{cry.emotion}</span>
            </div>
            <div>
              <span>cathartic</span> -{" "}
              <span className="value">{cry.wasCathartic}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
