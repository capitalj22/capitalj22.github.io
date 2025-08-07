import { useEffect, useState } from "react";
import "./pill-select.scss";
import classNames from "classnames";
import { ArrowLeft, Plus, X } from "react-feather";

interface Props {
  options: Array<{ label: string; value: any }>;
  valueChanged: (value: string) => void;
  label: string;
  defaultValue?: any;
  canAdd?: boolean;
  optionAdded?: any;
}

export function PillSelect({
  options,
  valueChanged,
  label,
  defaultValue,
  canAdd,
  optionAdded,
}: Props) {
  const [isSelecting, setIsSelecting] = useState(!defaultValue),
    [selectedItem, setSelectedItem] = useState(defaultValue || null),
    [isAddingNew, setIsAddingNew] = useState(false),
    [newText, setNewText] = useState(""),
    [localOptions, setLocalOptions] = useState(options);

  useEffect(() => {}, [localOptions]);

  const selected = (e) => {
    setSelectedItem(e);
    setIsSelecting(true);
  };

  const clear = () => {
    setSelectedItem(null);
    setIsSelecting(true);
  };

  const addNewOption = () => {
    setIsAddingNew(true);
  };

  const finishAdding = () => {
    if (newText?.length) {
      const newItem = { value: newText, label: newText };
      setLocalOptions([...options, newItem]);
      setIsAddingNew(false);
      setNewText('');
      setSelectedItem(newItem);
    } else {
      setIsAddingNew(false);
      setNewText('');
    }
  };

  const onNewKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      finishAdding();
    }
  };

  return (
    <div className="pill-select">
      <div className="label">{label}</div>
      {isSelecting && (
        <div className="pills">
          {localOptions?.map((option, index) => (
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
          {canAdd && isAddingNew && (
            <span className="pill">
              <input
                autoFocus
                type="text"
                onBlur={finishAdding}
                value={newText}
                onChange={(e) => setNewText(e?.target?.value as any)}
                onKeyDown={(e) => onNewKeydown(e as any)}
              />
            </span>
          )}
          {canAdd && !isAddingNew && (
            <button className="pill" type="button" onClick={addNewOption}>
              <Plus size={20} />
            </button>
          )}
        </div>
      )}
      {/* {!isSelecting && (
        <div className="selected-only">
          <div className="pills">
            <button type="button" className="pill selected" onClick={clear}>
              {selectedItem?.label}
              <X size={16}/>
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}
