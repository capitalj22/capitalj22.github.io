import { useState } from "react";
import { ArrowLeft, PlusCircle } from "react-feather";
import { TearDates } from "./datepicker/datepicker";
import { SmolButton } from "../components/common/buttons/smolButton";
import "./tears.scss";
import { GenericSelect } from "../components/common/selects/genericSelect";
import { PillSelect } from "./pill-select/pill-select";

export function Tears() {
  const [isAdding, setIsAdding] = useState(false);
  const onClick = (e) => {
    e.stopPropagation();
    setIsAdding(true);
  };
  const back = () => {
    setIsAdding(false);
  };

  const whereOptions = [
    { value: "home", label: "At Home" },
    { value: "work", label: "At Work" },
    { value: "car", label: "In My Car" },
    { value: "friends", label: "With Friends" },
    { value: "family", label: "With Family" },
    { value: "other", label: "Other" },
  ];
  const bcOptions = [
    { value: "stress", label: "Stress" },
    { value: "exhaustion", label: "Exhaustion" },
    { value: "other", label: "Other" },
  ];
  const whereChanged = (e) => {
      console.log(e);
    },
    bcChanged = (e) => {
      console.log(e);
    };

  return (
    <div className="tears">
      {!isAdding && (
        <button type="button" onClick={onClick}>
          <PlusCircle size={45} />
        </button>
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
        </div>
      )}
    </div>
  );
}
