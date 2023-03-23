import { useState, useRef, useEffect } from "react";
import "./fancyTextInput.scss";

interface Props {
  value: string | number;
  valueChanged: (value: string | number) => void;
}

export function FancyNumberInput({
  value,
  valueChanged,
  className = "",
  minWidth = 48,
  min=undefined,
  max=undefined
}) {
  const [content, setContent] = useState(+value);
  const [width, setWidth] = useState(minWidth);
  const span = useRef({ offsetWidth: 0 } as HTMLElement);

  useEffect(() => {
    const newWidth = span?.current?.offsetWidth + 24;
    setWidth(newWidth > minWidth ? newWidth : minWidth);
  }, [content]);

  const changeHandler = (evt) => {
    setContent(+evt.target.value);

    valueChanged(+evt.target.value);
  };

  return (
    <div className={"fancy-text-input form-control " + className}>
      <span className="hidden-text" ref={span}>
        {content}
      </span>
      <input
        min={min}
        max={max}
        value={content}
        type="number"
        style={{ width }}
        onChange={changeHandler}
      />
    </div>
  );
}
