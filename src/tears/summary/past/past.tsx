import { useContext, useEffect, useState } from "react";
import { tearsStateContext } from "../../tearsStateProvider";
import { TearsEntry } from "./entry";
import { orderBy, sortBy, take } from "lodash-es";
import "./past.scss";
import classNames from "classnames";
import { Cry } from "../../tears";

export function TearsPast() {
  const { cries } = useContext(tearsStateContext);
  const [localCries, setLocalCries] = useState<Cry[]>(cries);

  useEffect(() => {
    setLocalCries(orderBy(cries, (cry) => new Date(cry.date), "desc"));
  }, [cries]);

  return (
    <div>
      <div className="label">my cries</div>
      <div
        className={classNames("entries-container", { many: cries.length > 5 })}
      >
        <div className="entries">
          {(localCries)?.map((entry, index) => (
            <TearsEntry cry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}
