import { useContext, useState } from "react";
import { Copy, Download, MapPin, RefreshCcw, Shield } from "react-feather";
import { AbilitiesContext } from "../../providers/abilities/abilitiesProvider";
import { BuildContext } from "../../providers/build/buildProvider";
import { StatsContext } from "../../providers/stats/statsProvider";
import { TagsContext } from "../../providers/tags/tagsProvider";

import "./codePanel.scss";

export function CodePanel({ nodes, importAttempted }) {
  const { build } = useContext(BuildContext);
  const { tagColors } = useContext(TagsContext);
  const { stats } = useContext(StatsContext);
  const { abilityTypes, abilities } = useContext(AbilitiesContext);
  const [buildValue, setBuildTextValue] = useState("");
  const [treeValue, setTreeTextValue] = useState("");
  const [notification1Style, setNotification1Style] = useState({ opacity: 0 });
  const [notification2Style, setNotification2Style] = useState({ opacity: 0 });

  const handleBuildValueChanged = (event) => {
    setBuildTextValue(event.target.value);
  };

  const handleBuildImportClicked = (event) => {
    importAttempted({ type: "build", data: buildValue });
  };

  const handleTreeValueChanged = (event) => {
    setTreeTextValue(event.target.value);
  };

  const handleTreeImportClicked = (event) => {
    importAttempted({ type: "trees", data: treeValue });
  };

  const handleBuildCopyClicked = (event) => {
    navigator.clipboard.writeText(JSON.stringify(build.exportableBuild));

    setNotification1Style({ opacity: 1 });

    setTimeout(() => {
      setNotification2Style({ opacity: 0 });
    }, 2000);
  };

  const handleTreeCopyClicked = (event) => {
    const config = {
      abilities,
      nodes,
      tagColors,
      stats,
      abilityTypes,
    };

    navigator.clipboard.writeText(JSON.stringify(config));

    setNotification2Style({ opacity: 1 });

    setTimeout(() => {
      setNotification2Style({ opacity: 0 });
    }, 2000);
  };

  const resetClicked = (event) => {
    importAttempted({
      type: "reset",
    });
  };

  const defaultClicked = (event) => {
    importAttempted({
      type: "default",
    });
  };

  return (
    <div className="code-panel">
      <div>
        <div className="title">Build</div>
        <div className="import">
          <textarea
            spellCheck={false}
            rows={8}
            onChange={handleBuildValueChanged}
            placeholder="Paste exported build here"
          ></textarea>
          <button className="attached" onClick={handleBuildImportClicked}>
            Import Build <Download />
          </button>
        </div>
        <div className="export">
          <button onClick={handleBuildCopyClicked}>
            Copy Current Build <Copy />
          </button>
          <div style={notification1Style}>Text Copied to Clipboard</div>
        </div>
      </div>
      <div>
        <div className="title">Trees/Abilities</div>
        <div className="import">
          <textarea
            spellCheck={false}
            rows={8}
            onChange={handleTreeValueChanged}
            placeholder="Paste exported trees and abilities here"
          ></textarea>
          <button className="attached" onClick={handleTreeImportClicked}>
            Import Trees/Abilities <Download />
          </button>
        </div>
        <div className="export">
          <button onClick={handleTreeCopyClicked}>
            Copy Current Trees/Abilities <Copy />
          </button>
          <div style={notification2Style}>Text Copied to Clipboard</div>
        </div>
      </div>

      <div className="reset">
        <div className="title">Reset</div>
        <button onClick={defaultClicked}>
          Load Defaults
          <RefreshCcw />
        </button>
        <br />
        <button onClick={resetClicked}>
          Reset
          <Shield />
        </button>
      </div>
    </div>
  );
}
