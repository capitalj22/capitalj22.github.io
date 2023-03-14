import { useEffect } from "react";
import { TAG_COLORS } from "../../../data/tag-colors";
import "./statTag.scss";

export function StatTag({ label }) {
  let style = { borderColor: TAG_COLORS[label] };

  useEffect(() => {
    style = { borderColor: TAG_COLORS[label] };
  }, [label]);

  return (
    <span className="stat-tag" style={style}>
      {label}
    </span>
  );
}
