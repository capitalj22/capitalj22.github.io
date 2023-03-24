import { useContext, useState } from "react";
import { Download, RefreshCcw, Save, Shield } from "react-feather";
import { AbilitiesContext } from "../../providers/abilities/abilitiesProvider";
import { BuildContext } from "../../providers/build/buildProvider";
import { NodesContext } from "../../providers/nodes/nodesProvider";
import { StatsContext } from "../../providers/stats/statsProvider";
import { TagsContext } from "../../providers/tags/tagsProvider";
import exampleJson from "../../data/example-config.json";

import "./codePanel.scss";
import { Accordion } from "../layout/accordion/accordion";
import { isString } from "lodash-es";
import { SmolButton } from "../common/buttons/smolButton";
import { FancyTextInput } from "../common/tag-input/fancyTextInput";

export function CodePanel() {
  const { build, setSavedBuild } = useContext(BuildContext);
  const { tagColors, setTagColors } = useContext(TagsContext);
  const { stats, setStats } = useContext(StatsContext);
  const { abilityTypes, abilities, setAbilities, setAbilityTypes } =
    useContext(AbilitiesContext);
  const { nodes, setNodes } = useContext(NodesContext);

  const [buildFile, setBuildFile] = useState("");
  const [treeFile, setTreeFile] = useState("");
  const [buildFileName, setBuildFileName] = useState(
    `dragon-build-${new Date().toDateString()}`
  );
  const [treeFileName, setTreeFileName] = useState(
    `dragon-trees-${new Date().toDateString()}`
  );

  const fileChanged = (e, type) => {
    const files = e.target.files;
    const reader = new FileReader();
    reader.onload = (r) => {
      if (isString(r.target?.result)) {
        if (type === "build") {
          setBuildFile(r.target?.result || "");
        } else if (type === "tree") {
          setTreeFile(r.target?.result || "");
        }
      }
    };
    reader.readAsText(files[0]);
  };

  const downloadFile = (type) => {
    let data = {};
    let filename = "";

    if (type === "build") {
      data = build?.exportableBuild;
      const name = buildFileName || "dragon-build";

      filename = `${name}.json`;
    } else if (type === "trees") {
      const name = treeFileName || "dragon-trees";

      data = { abilities, nodes, tagColors, stats, abilityTypes };
      filename = `${name}.json`;
    }

    if (filename.length && data) {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const href = URL.createObjectURL(blob);

      // create "a" HTLM element with href to file
      const link = document.createElement("a");
      link.href = href;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }
  };

  const handleBuildImportClicked = (event) => {
    if (buildFile.length) {
    }
    const build = JSON.parse(buildFile);

    if (build) {
      setSavedBuild({ type: "imported", build });
    }
  };

  const handleTreeImportClicked = (event) => {
    if (treeFile.length) {
      const config = JSON.parse(treeFile);

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
    }
  };

  const resetClicked = (event) => {
    setNodes({
      type: "reset",
    });
    setAbilities({ type: "set", abilities: [] });
    setAbilityTypes({ type: "set", abilityTypes: [] });
    setTagColors({ type: "set", tagColors: {} });
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
          <div className="uploader">
            <input
              type="file"
              id="1"
              onChange={(e) => fileChanged(e, "build")}
            />
            <SmolButton
              disabled={!buildFile}
              clicked={handleBuildImportClicked}
            >
              Import Build <Download />
            </SmolButton>
          </div>
          <div className="downloader">
            <div>
              Save as:
              <FancyTextInput
                value={buildFileName}
                valueChanged={(e) => setBuildFileName(e)}
              />
            </div>
            <SmolButton
              type="outline"
              color="success"
              clicked={() => downloadFile("build")}
            >
              Save Build <Save />
            </SmolButton>
          </div>
        </div>
      </Accordion>
      <Accordion name="Trees, Abilities, Etc" startOpen={false}>
        <div className="section">
          <div className="uploader">
            <input
              type="file"
              id="1"
              onChange={(e) => fileChanged(e, "tree")}
            />
            <SmolButton disabled={!treeFile} clicked={handleTreeImportClicked}>
              Import Trees/Abilities <Download />
            </SmolButton>
          </div>
          <div className="downloader">
            <div>
              Save as:
              <FancyTextInput
                value={treeFileName}
                valueChanged={(e) => setTreeFileName(e)}
              />
            </div>
            <SmolButton color="success" clicked={() => downloadFile("trees")}>
              Save Current Trees/Abilities <Save />
            </SmolButton>
          </div>
        </div>
      </Accordion>
      <Accordion name="Defaults" startOpen={true}>
        <div className="reset">
          <SmolButton color="info" clicked={defaultClicked}>
            <Shield />
            Load Defaults
          </SmolButton>
          <br />
          <SmolButton color="danger" clicked={resetClicked}>
            <RefreshCcw />
            Reset Build, Trees, and Abilities
          </SmolButton>
        </div>
      </Accordion>
    </div>
  );
}
