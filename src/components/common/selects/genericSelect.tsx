import Select from "react-select";
import { selectStyles } from "./select-styles";
import "./genericSelect.scss";

interface Props {
  options: any;
  valueChanged: (value: string) => void;
  label: string;
}
export function GenericSelect({ options, valueChanged, label }: Props) {
  return (
    <div className="generic-select">
      <div className="label">{label}</div>
      <Select
        className="select"
        styles={selectStyles()}
        options={options}
        onChange={(e) => valueChanged(e?.value)}
      ></Select>
    </div>
  );
}
