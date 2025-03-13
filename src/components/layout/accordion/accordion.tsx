import { useState } from "react";
import { ChevronDown, ChevronUp, Shield } from "react-feather";
import "./accordion.scss";
import classNames from "classnames";

export function Accordion({ children, name, startOpen, disabled = false, icon=null }) {
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
        {icon}{name}
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
        {icon}{name}
          <span className="icon">
            <ChevronDown />
          </span>
        </button>
      </div>
    );
  }
}
