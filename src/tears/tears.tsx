import { useState } from "react";
import {
  ArrowLeft,
  CheckSquare,
  Cloud,
  CloudDrizzle,
  PlusCircle,
} from "react-feather";
import { TearDates } from "./datepicker/datepicker";
import { SmolButton } from "../components/common/buttons/smolButton";
import "./tears.scss";
import { PillSelect } from "./pill-select/pill-select";
import { Intensity } from "./intensity/intensity";

export function Tears() {
  const [isAdding, setIsAdding] = useState(false);
  const onClick = (e) => {
    e.stopPropagation();
    setIsAdding(true);
  };
  const back = () => {
    setIsAdding(false);
  };
  const save = () => {
    back();
  };

  const whereOptions = [
      { value: "home", label: "at home" },
      { value: "work", label: "at work" },
      { value: "car", label: "in my car" },
      { value: "friends", label: "with friends" },
      { value: "family", label: "with family" },
      { value: "other", label: "other" },
    ],
    bcOptions = [
      { value: "stress", label: "stress" },
      { value: "exhaustion", label: "exhaustion" },
      { value: "other", label: "other" },
    ],
    cathOptions = [
      { value: "yes", label: "Cathartic" },
      { value: "no", label: "Not Cathartic" },
    ];

  const whereChanged = (e) => {
      console.log(e);
    },
    bcChanged = (e) => {
      console.log(e);
    },
    intensityChanged = () => {},
    cathChanged = () => {};

  return (
    <div className="tears">
      {!isAdding && (
        <div className="home">
          <div className="new">
            <button className="addButton" type="button" onClick={onClick}>
              <PlusCircle size={80} />
            </button>
          </div>

          <div className="past">
            <div className="label">my cries</div>
            <div className="entries">
              <div className="entry">
                <span className="date">Aug 1</span>
                <span className="details">
                  <span className="int i3">
                    <CloudDrizzle size={14} />
                  </span>
                </span>
              </div>
              <div className="entry">
                <span className="date">Jul 27</span>
                <span className="details">
                  <span className="int i3">
                    <CloudDrizzle size={14} />
                  </span>
                </span>
              </div>
              <div className="entry">
                <span className="date">Jul 15</span>
                <span className="details">
                  <span className="int i1">
                    <Cloud size={14} />
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="stats">
            <div className="label">Stats</div>
            <div className="statstuff">(Stats Go Here)</div>
          </div>
        </div>
      )}
      {isAdding && (
        <div>
          <SmolButton clicked={back}>
            <ArrowLeft />
          </SmolButton>
          <div>
            <TearDates />
          </div>
          <div className="section">
            <PillSelect
              label="I cried"
              options={whereOptions}
              valueChanged={whereChanged}
            />
          </div>
          <div className="section">
            <PillSelect
              label="Due to"
              options={bcOptions}
              valueChanged={bcChanged}
            />
          </div>
          <div className="section">
            <Intensity valueChanged={intensityChanged} />
          </div>
          <div className="section">
            <PillSelect
              label="It was"
              options={cathOptions}
              valueChanged={cathChanged}
            />
          </div>

          <div className="section done">
            <button className="lg-button" onClick={save}>
              <CheckSquare size={80} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
