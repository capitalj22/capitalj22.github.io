import Select from "react-select";
import { selectStyles } from "./select-styles";

interface Props {
  options: any;
  valueChanged: (value: string) => void;
}
export function GenericSelect({ options, valueChanged }: Props) {
  return (
    <Select
      className="unit-select"
      styles={selectStyles()}
      options={options}
      onChange={(e) => valueChanged(e?.value)}
    ></Select>
  );
}
