import { useState, useRef, useEffect } from "react";
import "./fancyTextInput.scss";

interface Props {
  value: string | number;
  valueChanged: (value: string | number) => void;
  type?: "text" | "number";
}

export function FancyTextInput({ value, valueChanged, type = "text" }) {
  const [content, setContent] = useState(value);
  const [width, setWidth] = useState(0);
  const span = useRef({ offsetWidth: 0 } as HTMLElement);

  useEffect(() => {
    setWidth(span?.current?.offsetWidth + (type === "number" ? 24 : 12));
  }, [content]);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const changeHandler = (evt) => {
    // setContent(evt.target.value);
    if (type === "number") {
      valueChanged(parseInt(evt.target.value, 10));
    } else {
      valueChanged(evt.target.value);
    }
  };

  return (
    <div className="fancy-text-input form-control">
      <span className="hidden-text" ref={span}>
        {content}
      </span>
      <input
        value={content}
        type={type}
        style={{ width }}
        onChange={changeHandler}
      />
    </div>
  );
}
