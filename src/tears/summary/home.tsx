import { Cloud, CloudDrizzle, PlusCircle } from "react-feather";
import { TearsPast } from "./past/past";
import { tearsStateContext } from "../tearsStateProvider";
import { useContext } from "react";
import { TearStats } from "./stats/stats";

interface Props {
  addPressed: any;
}
export function TearsHome({ addPressed }: Props) {
  const { cries } = useContext(tearsStateContext);

  return (
    <div className="home">
      <div className="new">
        <button
          className="addButton"
          type="button"
          onClick={() => addPressed()}
        >
          <PlusCircle size={80} />
        </button>
      </div>

      <TearsPast />
      <div className="section">
        <TearStats />
      </div>

      <div className="vers"> v1.0.3</div>
    </div>
  );
}
