import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import "./accordion.scss";
import classNames from "classnames";

export function Accordion({ children, name, startOpen, disabled = false }) {
  const [expanded, setExpanded] = useState(startOpen);

  const handleToggled = (event) => {
    if (!disabled) {
      setExpanded(!expanded);
    }
  };

  if (expanded) {
    return (
      <div
        className={classNames({
          accordion: true,
          open: true,
          disabled: disabled,
        })}
      >
        <button className="accordion-button" onClick={handleToggled}>
          {name}
          <ChevronUp />
        </button>
        <div className="container">{children}</div>
      </div>
    );
  } else {
    return (
      <div
        className={classNames({
          accordion: true,
          closed: true,
          disabled: disabled,
        })}
      >
        <button className="accordion-button" onClick={handleToggled}>
          {name}
          <span className="icon">
            <ChevronDown />
          </span>
        </button>
      </div>
    );
  }
}
