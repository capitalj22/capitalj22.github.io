import { useContext, useState } from "react";
import { tearsStateContext } from "../../tearsStateProvider";
import { TearsEntry } from "./entry";
import { take } from "lodash-es";
import "./past.scss";

export function TearsPast() {
  const { cries } = useContext(tearsStateContext);
  const [localCries, setLocalCries] = useState(take(cries, 5));

  return (
    <div>
      <div className="label">my cries</div>

      <div className="entries-container">
        <div className="entries">
          {cries?.map((entry, index) => (
            <TearsEntry cry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}
