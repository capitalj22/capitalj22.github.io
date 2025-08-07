import { Cloud, CloudDrizzle, PlusCircle } from "react-feather";
import { TearsPast } from "../past/past";

interface Props {
  addPressed: any;
}
export function TearsHome({ addPressed }: Props) {
  return (
    <div className="home">
      <div className="new">
        <button className="addButton" type="button" onClick={() => addPressed()}>
          <PlusCircle size={80} />
        </button>
      </div>

      <TearsPast />

      <div className="stats">
        <div className="label">Stats</div>
        <div className="statstuff">(Stats Go Here) v1.0.2</div>
      </div>
    </div>
  );
}
