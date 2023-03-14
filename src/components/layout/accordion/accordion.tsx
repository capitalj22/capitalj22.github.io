import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import "./accordion.scss";

export function Accordion({ children, name, startOpen }) {
  const [expanded, setExpanded] = useState(startOpen);

  const handleToggled = (event) => {
    setExpanded(!expanded);
  };

  if (expanded) {
    return (
      <div className="accordion open">
        <button className="accordion-button" onClick={handleToggled}>
          {name}
          <ChevronUp />
        </button>
        <div className="container">{children}</div>
      </div>
    );
  } else {
    return (
      <div className="accordion closed">
        <button className="accordion-button" onClick={handleToggled}>
          {name}
          <ChevronDown />
        </button>
      </div>
    );
  }
}
