import { ArrowLeft, CheckSquare } from "react-feather";
import { SmolButton } from "../../components/common/buttons/smolButton";
import { TearDates } from "../datepicker/datepicker";
import { Intensity } from "../intensity/intensity";
import { PillSelect } from "../pill-select/pill-select";

interface Props {
  backPressed: any;
  savePressed: any;
}
export function TearsAdd({ backPressed, savePressed }: Props) {
  const whereChanged = (e) => {
      console.log(e);
    },
    bcChanged = (e) => {
      console.log(e);
    },
    intensityChanged = () => {},
    cathChanged = () => {},
    emoChanged = () => {};

  const whereOptions = [
      { value: "home", label: "at home" },
      { value: "work", label: "at work" },
      { value: "car", label: "in my car" },
      { value: "friends", label: "with friends" },
      { value: "family", label: "with family" },
    ],
    bcOptions = [
      { value: "stress", label: "stress" },
      { value: "exhaustion", label: "exhaustion" },
      { value: "pain", label: "pain" },
      { value: "strangers", label: "strangers" },
      { value: "coworkers", label: "coworkers" },
      { value: "friends", label: "friends" },
      { value: "family", label: "family" },
      { value: "media", label: "media" },
      { value: "news", label: "news" },
    ],
    cathOptions = [
      { value: "yes", label: "cathartic" },
      { value: "no", label: "not cathartic" },
    ],
    emoOptions = [
      { value: "sadness", label: "sadness" },
      { value: "frustrartion", label: "frustration" },
      { value: "helplessness", label: "helplessness" },
      { value: "anger", label: "anger" },
      { value: "grief", label: "grief" },
      { value: "pain", label: "pain" },
      { value: "happiness", label: "happiness" },
      { value: "appreciation", label: "appreciation" },
    ];

  const back = () => {
    backPressed(false);
  };
  const save = () => {
    savePressed();
  };

  return (
    <div>
      <SmolButton clicked={back}>
        <ArrowLeft />
      </SmolButton>
      <div>
        <TearDates />
      </div>
      <div className="section">
        <PillSelect
          canAdd={true}
          label="I cried"
          options={whereOptions}
          valueChanged={whereChanged}
        />
      </div>
      <div className="section">
        <PillSelect
          canAdd={true}
          label="Due to"
          options={bcOptions}
          valueChanged={bcChanged}
        />
      </div>
      <div className="section">
        <PillSelect
          canAdd={true}
          label="Centered on"
          options={emoOptions}
          valueChanged={emoChanged}
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
        <button className="lg-button" onClick={savePressed}>
          <CheckSquare size={80} />
        </button>
      </div>
    </div>
  );
}
