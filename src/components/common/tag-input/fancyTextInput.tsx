import { isUndefined } from "lodash-es";
import { useState, useRef, useEffect } from "react";
import "./fancyTextInput.scss";

interface Props {
  value: string;
  valueChanged: (value: string) => void;
  className?: string;
  blur?: any;
  minWidth?: number;
  placeholder?: string;
}

export function FancyTextInput({
  value,
  valueChanged,
  className,
  blur,
  minWidth = 48,
  placeholder = "",
}: Props) {
  const [content, setContent] = useState(value);
  const [width, setWidth] = useState(0);
  const span = useRef({ offsetWidth: 0 } as HTMLElement);

  useEffect(() => {
    if (!isUndefined(content)) {
      const newWidth = span?.current?.clientWidth + 24;
      setWidth(newWidth > minWidth ? newWidth : minWidth);
    }
  }, [content]);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const changeHandler = (evt) => {
    valueChanged(evt.target.value);
  };

  return (
    <div className={"fancy-text-input form-control " + className}>
      <span className="hidden-text" ref={span}>
        {content}
      </span>
      <input
        placeholder={placeholder}
        onBlur={blur}
        value={content}
        type="text"
        style={{ width }}
        onChange={changeHandler}
      />
    </div>
  );
}
