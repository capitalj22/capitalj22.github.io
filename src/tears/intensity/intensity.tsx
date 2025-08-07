import classNames from "classnames";
import { useEffect, useState } from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSnow,
} from "react-feather";
import "./intensity.scss";

interface Props {
  valueChanged: any;
}
export function Intensity({ valueChanged }: Props) {
  const [intensity, setIntensity] = useState(1);
  useEffect(() => {
    valueChanged(intensity);
  }, [intensity]);

  return (
    <div className="intensity-select">
      <div className="label">It felt like</div>

      <div className="intensities">
        <button
          className={classNames("intensity i1", { selected: intensity === 1 })}
          onClick={() => setIntensity(1)}
        >
          <Cloud />
        </button>
        <button
          className={classNames("intensity i2", { selected: intensity === 2 })}
          onClick={() => setIntensity(2)}
        >
          <CloudSnow />
        </button>
        <button
          className={classNames("intensity i3", { selected: intensity === 3 })}
          onClick={() => setIntensity(3)}
        >
          <CloudDrizzle />
        </button>
        <button
          className={classNames("intensity i4", { selected: intensity === 4 })}
          onClick={() => setIntensity(4)}
        >
          <CloudRain />
        </button>
        <button
          className={classNames("intensity i5", { selected: intensity === 5 })}
          onClick={() => setIntensity(5)}
        >
          <CloudLightning />
        </button>
      </div>
    </div>
  );
}
