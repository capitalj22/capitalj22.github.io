import { isFunction } from "lodash-es";
import { useEffect } from "react";
import { Check } from "react-feather";
import { TAGS } from "../../../data/tag-colors";
import "./statTag.scss";

interface Props {
  label: string;
  clicked?: (event: string) => void;
  selected?: boolean;
  children?;
}

function getStyle(tag, clicked, selected?): React.CSSProperties {
  let style: React.CSSProperties = {};

  const tagStyle = TAGS[tag] || { color: "#fff" };
  style = { borderColor: tagStyle.color || "#fff" };
  if (selected) {
    style.borderWidth = "2px";
    style.color = "#1a1a1c";
    style.backgroundColor = tagStyle.color;
    style.fontWeight = 500;
  } else {
    style.color = "#fff";
  }
  if (tagStyle?.emphasis === 1) {
    style.borderColor = "transparent";
    style.backgroundColor = tagStyle.color;
    style.color = tagStyle.textColor;
    style.fontWeight = 600;
    style.borderRadius = 12;
  }
  if (isFunction(clicked)) {
    style.cursor = "pointer";
  }

  return style;
}
export function StatTag({ label, clicked, selected, children }: Props) {
  let style = getStyle(label, clicked, selected);

  const handleClicked = (event) => {
    if (isFunction(clicked)) {
      clicked(label);
    }
  };
  useEffect(() => {}, [label]);

  return (
    <span onClick={handleClicked} className="stat-tag" style={style}>
      {label} {selected ? <Check size={14}></Check> : ""}
      {children && children}
    </span>
  );
}
