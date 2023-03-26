import { useContext, useState } from "react";
import { CloudLightning, Download, RefreshCcw, Save } from "react-feather";
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
import { stateContext } from "../../providers/state/stateProvider";
import classNames from "classnames";

export function CodePanel() {
  const { build, setSavedBuild } = useContext(BuildContext);
  const { tagColors, setTagColors } = useContext(TagsContext);
  const { stats, setStats } = useContext(StatsContext);
  const {
    abilityTypes,
    abilities,
    setAbilities,
    setAbilityTypes,
    globalParams,
    setGlobalParams,
  } = useContext(AbilitiesContext);
  const { nodes, setNodes } = useContext(NodesContext);
  const { version, setVersion } = useContext(stateContext);

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

      data = { abilities, abilityTypes, globalParams, nodes, tagColors, stats };
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
        if (config.globalParams) {
          setGlobalParams({ type: "set", params: config.globalParams });
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
    setGlobalParams({ type: "set", params: [] });

    setSavedBuild({ type: "imported", build: {} });
  };

  const defaultClicked = (event) => {
    const defaults = exampleJson;
    setVersion({ type: "set", version: defaults.version });
    setNodes({ type: "set", nodes: defaults.nodes });
    setStats({ type: "set", stats: defaults.stats });
    setAbilityTypes({ type: "set", abilityTypes: defaults.abilityTypes });
    setAbilities({ type: "set", abilities: defaults.abilities });
    setTagColors({ type: "set", colors: defaults.tagColors });
    setGlobalParams({ type: "set", params: defaults.globalParams });
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
            <CloudLightning />
            Load Ed's Latest Build
          </SmolButton>

          <br />
          <SmolButton color="danger" clicked={resetClicked}>
            <RefreshCcw />
            Reset Build, Trees, and Abilities
          </SmolButton>
        </div>
        <div className="version">
          <span>
            Ed's latest version:{" "}
            <span className="version-number">{exampleJson.version}</span>
          </span>
          <span>
            Your Version:{" "}
            <span
              className={classNames({
                "version-number": true,
                success: version === exampleJson.version,
                outdated: version !== exampleJson.version,
              })}
            >
              {version}
            </span>{" "}
          </span>
        </div>
      </Accordion>
    </div>
  );
}
