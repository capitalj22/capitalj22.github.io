import { isFunction } from "lodash-es";
import { useContext, useEffect } from "react";
import { Check } from "react-feather";
import { TagsContext } from "../../../providers/tags/tagsProvider";
import "./statTag.scss";

interface Props {
  label: string;
  clicked?: (event: string) => void;
  selected?: boolean;
  children?;
  emphasize?: boolean;
}

function getStyle(clicked, selected, color, emphasize): React.CSSProperties {
  let style: React.CSSProperties = {};
  style.borderColor = color;
  if (selected) {
    style.color = "#1a1a1c";
    style.backgroundColor = color;
    style.fontWeight = 500;
  } else {
    style.color = "#fff";
  }
  if (emphasize) {
    style.borderColor = "transparent";
    style.backgroundColor = color;
    style.color = "#222";
    style.fontWeight = 600;
    style.borderRadius = 12;
  } else {
  }
  if (isFunction(clicked)) {
    style.cursor = "pointer";
    style.paddingRight = "32px";
  }

  return style;
}
export function StatTag({
  label,
  clicked,
  selected,
  children,
  emphasize,
}: Props) {
  const { tagColors } = useContext(TagsContext);

  const handleClicked = (event) => {
    if (isFunction(clicked)) {
      clicked(label);
    }
  };
  useEffect(() => {}, [label]);

  return (
    <span
      onClick={handleClicked}
      className="stat-tag"
      style={getStyle(clicked, selected, tagColors[label] || "#fff", emphasize)}
    >
      {label}{" "}
      {clicked && (
        <div className="check">
          {selected ? <Check size={14}></Check> : ""}
        </div>
      )}
      {children && children}
    </span>
  );
}