import { useState } from "react";
import "./pill-select.scss";
import classNames from "classnames";
import { ArrowLeft, X } from "react-feather";

interface Props {
  options: Array<{ label: string; value: any }>;
  valueChanged: (value: string) => void;
  label: string;
  defaultValue?: any;
}

export function PillSelect({
  options,
  valueChanged,
  label,
  defaultValue,
}: Props) {
  const [isSelecting, setIsSelecting] = useState(!defaultValue),
    [selectedItem, setSelectedItem] = useState(defaultValue || null);

  const selected = (e) => {
    setSelectedItem(e);
    setIsSelecting(false);
  };

  const clear = () => {
    setSelectedItem(null);
    setIsSelecting(true);
  }

  return (
    <div className="pill-select">
      <div className="label">{label}</div>
      {isSelecting && (
        <div className="pills">
          {options?.map((option, index) => (
            <button
              className={classNames("pill", {
                selected: selectedItem?.value === option.value,
              })}
              type="button"
              onClick={() => selected(option)}
            >
              {option?.label}
            </button>
          ))}
        </div>
      )}
      {!isSelecting && (
        <div className="selected-only">
          <div className="pills">
            <button type="button" className="pill selected" onClick={clear}>
              {selectedItem?.label}
              <X size={16}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
