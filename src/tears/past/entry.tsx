import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSnow,
} from "react-feather";
import { Cry } from "../tears";

interface Props {
  cry: Cry;
}
export function TearsEntry({ cry }: Props) {
  const month = cry.date.toLocaleDateString("default", { month: "short" }),
    day = cry.date.getDate();
  return (
    <div className="entry">
      <span className="date">
        {month} {day}
      </span>
      <span className="details">
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
      </span>
    </div>
  );
}
