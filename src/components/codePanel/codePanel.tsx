import { useContext, useState } from "react";
import { Copy, Download, RefreshCcw, Shield } from "react-feather";
import { AbilitiesContext } from "../../providers/abilities/abilitiesProvider";
import { BuildContext } from "../../providers/build/buildProvider";
import { NodesContext } from "../../providers/nodes/nodesProvider";
import { StatsContext } from "../../providers/stats/statsProvider";
import { TagsContext } from "../../providers/tags/tagsProvider";
import exampleJson from "../../data/example-config.json";

import "./codePanel.scss";
import { Accordion } from "../layout/accordion/accordion";
import { BigButton } from "../common/buttons/bigButton";

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

  const downloadFile = () => {
    const config = {
      abilities,
      nodes,
      tagColors,
      stats,
      abilityTypes,
    };

    const myData = config; // I am assuming that "this.state.myData"
    // is an object and I wrote it to file as
    // json

    // create file in browser
    const fileName = "my-file";
    const json = JSON.stringify(myData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

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
      <Accordion name="Character Build" startOpen={false}>
        <div className="section">
          <textarea
            spellCheck={false}
            rows={8}
            onChange={handleBuildValueChanged}
            placeholder="Paste exported build here"
          ></textarea>
          <div className="buttons">
            <BigButton
              type="outline"
              color="theme"
              clicked={handleBuildImportClicked}
            >
              Import Build <Download />
            </BigButton>
            <BigButton type="outline" color="theme" clicked={downloadFile}>
              Copy Current Build <Copy />
            </BigButton>
          </div>
        </div>
      </Accordion>
      <Accordion name="Trees, Abilities, Etc" startOpen={false}>
        <div className="section">
          <div className="import">
            <textarea
              spellCheck={false}
              rows={8}
              onChange={handleTreeValueChanged}
              placeholder="Paste exported trees and abilities here"
            ></textarea>
            <BigButton clicked={handleTreeImportClicked}>
              Import Trees/Abilities <Download />
            </BigButton>
          </div>
          <div className="export">
            <BigButton clicked={handleTreeCopyClicked}>
              Copy Current Trees/Abilities <Copy />
            </BigButton>
            <div style={notification2Style}>Text Copied to Clipboard</div>
          </div>
        </div>
      </Accordion>

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
