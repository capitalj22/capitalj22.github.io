import { isFunction } from "lodash-es";
import { useContext, useEffect } from "react";
import { Check } from "react-feather";
import { TagsContext } from "../../../providers/tags/tagsProvider";
import { ThemeContext } from "../../../providers/theme.provider";
import "./statTag.scss";
import chroma from "chroma-js";

interface Props {
  label: string;
  clicked?: (event: string) => void;
  selected?: boolean;
  children?;
  emphasize?: boolean;
  color?: string;
}

function getStyle(
  clicked,
  selected,
  color,
  emphasize,
  colorOverride,
  theme
): React.CSSProperties {
  let style: React.CSSProperties = {};
  const tagColor = colorOverride || color;
  style.borderColor = tagColor;
  const selectedTextColor =
    chroma.contrast(tagColor, "white") > 3 ? "#eee" : "#313232";

  if (selected) {
    style.backgroundColor = tagColor;
    style.fontWeight = 500;
    style.color = selectedTextColor;
  }

  if (emphasize) {
    style.borderColor = "transparent";
    style.backgroundColor = tagColor;
    style.color = selectedTextColor;
    style.fontWeight = 600;
    style.borderRadius = 12;
  }

  if (isFunction(clicked)) {
    style.cursor = "pointer";
    style.paddingRight = "32px";
  }

  if (theme === "light") {
    // style.backgroundColor = tagColor;
    style.borderWidth = 2;
    // style.color = "#333";
  }

  return style;
}
export function StatTag({
  label,
  clicked,
  selected,
  children,
  emphasize,
  color,
}: Props) {
  const { tagColors } = useContext(TagsContext);
  const { theme } = useContext(ThemeContext);
  const handleClicked = (event) => {
    if (isFunction(clicked)) {
      clicked(label);
    }
  };

  return (
    <span
      onClick={handleClicked}
      className="stat-tag"
      style={getStyle(
        clicked,
        selected,
        (tagColors && tagColors[label]) || "#fff",
        emphasize,
        color,
        theme
      )}
    >
      {label}{" "}
      {clicked && (
        <div className="check">{selected ? <Check size={14}></Check> : ""}</div>
      )}
      {children && children}
    </span>
  );
}
