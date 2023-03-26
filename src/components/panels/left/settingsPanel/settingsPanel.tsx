import { each, map } from "lodash";
import { useContext, useEffect, useState } from "react";
import ReactSlider from "react-slider";
import {
  COLOR_THEMES,
  ThemeContext,
} from "../../../../providers/theme.provider";
import { ColorPicker } from "../../../common/color-picker/colorPicker";
import "./settingsPanel.scss";

export function SettingsPanel({ graphEvents$ }) {
  const [force1, setForce1] = useState(50);
  const [force2, setForce2] = useState(50);
  const [force3, setForce3] = useState(50);
  const [force4, setForce4] = useState(50);
  const [forces, setForces] = useState({});
  const { setColorTheme, colorTheme } = useContext(ThemeContext);

  useEffect(() => {}, [forces]);

  const handle1Updated = (event) => {
    setForce1(event);
    updateForces();
  };
  const handle2Updated = (event) => {
    setForce2(event);
    updateForces();
  };
  const handle3Updated = (event) => {
    setForce3(event);
    updateForces();
  };
  const handle4Updated = (event) => {
    setForce4(event);
    updateForces();
  };

  const updateForces = () => {
    graphEvents$.next({
      event: "forcesUpdated",
      data: {
        forces: {
          f1: force1,
          f2: force2,
          f3: force3,
          f4: force4,
        },
      },
    });
  };

  const colorChanged = (color) => {
    console.log(color);
    each(Object.keys(COLOR_THEMES), (key) => {
      if (color === COLOR_THEMES[key]["--themeColor"]) {
        setColorTheme({ type: "set", theme: key });
      }
    });
  };

  return (
    <div>
      <div className="sliders">
        <div className="padding-sm">
          Force Graph Settings
        </div>
        <div className="slider">
          <ReactSlider
            min={0}
            max={100}
            defaultValue={[25] as any}
            className="horizontal-slider"
            thumbClassName="thumb"
            trackClassName="track"
            // onBeforeChange={(value, index) =>
            //   console.log(`onBeforeChange: ${JSON.stringify({ value, index })}`)
            // }
            onChange={handle1Updated}
            // onAfterChange={(value, index) =>
            //   console.log(`onAfterChange: ${JSON.stringify({ value, index })}`)
            // }
            renderThumb={(props, state) => (
              <div {...props}>{state.valueNow}</div>
            )}
          ></ReactSlider>
        </div>
        <div className="slider">
          <ReactSlider
            min={0}
            max={50}
            defaultValue={[25] as any}
            className="horizontal-slider"
            thumbClassName="thumb"
            trackClassName="track"
            onChange={handle2Updated}
            renderThumb={(props, state) => (
              <div {...props}>{state.valueNow}</div>
            )}
          ></ReactSlider>
        </div>
        <div className="slider">
          <ReactSlider
            defaultValue={[70] as any}
            className="horizontal-slider"
            thumbClassName="thumb"
            trackClassName="track"
            onChange={handle3Updated}
            renderThumb={(props, state) => (
              <div {...props}>{state.valueNow}</div>
            )}
          ></ReactSlider>
        </div>
        <div className="slider">
          <ReactSlider
            className="horizontal-slider"
            thumbClassName="thumb"
            trackClassName="track"
            onChange={handle4Updated}
            renderThumb={(props, state) => (
              <div {...props}>{state.valueNow}</div>
            )}
          ></ReactSlider>
        </div>
      </div>
      <div className="theme">
        Theme
        <div className="colorpicker">
          <ColorPicker
            type="circle"
            color={COLOR_THEMES[colorTheme]["--themeColor"]}
            colorChanged={colorChanged}
            colorOptions={map(
              Object.keys(COLOR_THEMES),
              (key) => COLOR_THEMES[key]["--themeColor"]
            )}
          />
        </div>
      </div>
    </div>
  );
}
