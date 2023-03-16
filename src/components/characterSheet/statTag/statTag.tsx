import { useEffect } from "react";
import { TAGS, TAG_COLORS } from "../../../data/tag-colors";
import "./statTag.scss";

function getStyle(tag): React.CSSProperties {
  let style: React.CSSProperties = {};

  const tagStyle = TAGS[tag];
  style = { borderColor: TAG_COLORS[tag] };
  if (tagStyle?.emphasis === 1) {
    style.borderColor = 'transparent';
    style.backgroundColor = tagStyle.color;
    style.color = tagStyle.textColor;
    style.fontWeight = 600;
    style.borderRadius = 12;
  }
  return style;
}
export function StatTag({ label }) {
  let style = getStyle(label);

  useEffect(() => {}, [label]);

  return (
    <span className="stat-tag" style={style}>
      {label}
    </span>
  );
}
