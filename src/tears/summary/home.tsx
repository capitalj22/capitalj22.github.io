import { Cloud, CloudDrizzle, PlusCircle } from "react-feather";
import { TearsPast } from "./past/past";
import { tearsStateContext } from "../tearsStateProvider";
import { useContext } from "react";

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

      <div className="stats">
        <div className="label">salt stats</div>
        <div className="filters">
          <button>7d</button>
          <button>1m</button>
          <button>3m</button>
          <button>ytd</button>
        </div>
        <div className="statstuff">(Stats Go Here) v1.0.2</div>
      </div>
    </div>
  );
}
