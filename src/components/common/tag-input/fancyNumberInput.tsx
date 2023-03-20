import { useState, useRef, useEffect } from "react";
import "./fancyTextInput.scss";

interface Props {
  value: string | number;
  valueChanged: (value: string | number) => void;
}

export function FancyNumberInput({ value, valueChanged }) {
  const [content, setContent] = useState(+value);
  const [width, setWidth] = useState(0);
  const span = useRef({ offsetWidth: 0 } as HTMLElement);

  useEffect(() => {
    setWidth(span?.current?.offsetWidth + 24);
  }, [content]);

  // useEffect(() => {
  //   setContent(+value);
  // }, [value]);

  const changeHandler = (evt) => {
    setContent(+evt.target.value);

    valueChanged(+evt.target.value);
  };

  return (
    <div className="fancy-text-input form-control">
      <span className="hidden-text" ref={span}>
        {content}
      </span>
      <input
        value={content}
        type="number"
        style={{ width }}
        onChange={changeHandler}
      />
    </div>
  );
}
