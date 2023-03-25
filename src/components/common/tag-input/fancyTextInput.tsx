import classNames from "classnames";
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
  fullWidth?: boolean;
  autoFocus?: boolean;
  unsavedData?: boolean;
}

export function FancyTextInput({
  value,
  valueChanged,
  className,
  blur,
  minWidth = 48,
  placeholder = "",
  fullWidth = false,
  autoFocus = undefined,
  unsavedData = false,
}: Props) {
  const [content, setContent] = useState(value);
  const [width, setWidth] = useState(fullWidth ? "100%" : minWidth);
  const span = useRef({ offsetWidth: 0 } as HTMLElement);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!isUndefined(content) && !fullWidth) {
      const newWidth = span?.current?.clientWidth + 24;
      setWidth(newWidth > minWidth ? newWidth : minWidth);
    }
  }, [content]);

  useEffect(() => {
    setContent(value);
  }, [value]);

  useEffect(() => {
    if (!isUndefined(autoFocus) && autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const changeHandler = (evt) => {
    valueChanged(evt.target.value);
  };

  return (
    <div className={"fancy-text-input form-control " + className}>
      <span className="hidden-text" ref={span}>
        {content}
      </span>
      <input
        className={classNames({
          unsavedData: unsavedData,
        })}
        ref={inputRef}
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
