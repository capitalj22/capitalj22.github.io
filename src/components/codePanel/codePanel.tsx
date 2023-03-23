import { useContext, useState } from "react";
import { Copy, Download, RefreshCcw, Shield } from "react-feather";
import { AbilitiesContext } from "../../providers/abilities/abilitiesProvider";
import { BuildContext } from "../../providers/build/buildProvider";
import { NodesContext } from "../../providers/nodes/nodesProvider";
import { StatsContext } from "../../providers/stats/statsProvider";
import { TagsContext } from "../../providers/tags/tagsProvider";
import exampleJson from "../../data/example-config.json";

import "./codePanel.scss";

export function CodePanel() {
  const { build, setSavedBuild } = useContext(BuildContext);
  const { tagColors, setTagColors } = useContext(TagsContext);
  const { stats, setStats } = useContext(StatsContext);
  const { abilityTypes, abilities, setAbilities, setAbilityTypes } =
    useContext(AbilitiesContext);
  const { nodes, setNodes } = useContext(NodesContext);
  const [buildValue, setBuildTextValue] = useState("");
  const [treeValue, setTreeTextValue] = useState("");
  const [notification1Style, setNotification1Style] = useState({ opacity: 0 });
  const [notification2Style, setNotification2Style] = useState({ opacity: 0 });

  const handleBuildValueChanged = (event) => {
    setBuildTextValue(event.target.value);
  };

  const handleBuildImportClicked = (event) => {
    const build = JSON.parse(buildValue);

    if (build) {
      setSavedBuild({ type: "imported", build });
    }
  };

  const handleTreeValueChanged = (event) => {
    setTreeTextValue(event.target.value);
  };

  const handleTreeImportClicked = (event) => {
    const config = JSON.parse(treeValue);

    setSavedBuild({ type: "imported", build: {} });

    if (config) {
      if (config.nodes) {
        setNodes({ type: "set", nodes: config.nodes });
      }
      if (config.abilities) {
        setAbilities({ type: "set", abilities: config.abilities });
      }
      if (config.tagColors) {
        setTagColors({ type: "set", colors: config.tagColors });
      }
      if (config.stats) {
        setStats({ type: "set", stats: config.stats });
      }

      if (config.abilityTypes) {
        setAbilityTypes({ type: "set", abilityTypes: config.abilityTypes });
      }
    }
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
    setNodes({
      type: "reset",
    });
    setAbilities({ type: "set", abilities: [] });
    setAbilityTypes({ type: "set", abilityTypes: [] });
    setTagColors({ type: "set", tagColors: [] });
    setStats({ type: "set", stats: [] });

    setSavedBuild({ type: "imported", build: {} });
  };

  const defaultClicked = (event) => {
    const defaults = exampleJson;
    setNodes({ type: "set", nodes: defaults.nodes });
    setStats({ type: "set", stats: defaults.stats });
    setAbilityTypes({ type: "set", abilityTypes: defaults.abilityTypes });
    setAbilities({ type: "set", abilities: defaults.abilities });
    setTagColors({ type: "set", colors: defaults.tagColors });
    setSavedBuild({ type: "imported", build: {} });
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
          <Shield />
          Load Defaults
        </button>
        <br />
        <button onClick={resetClicked}>
          <RefreshCcw />
          Reset
        </button>
      </div>
    </div>
  );
}
