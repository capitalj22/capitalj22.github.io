import { useContext, useState } from "react";
import {
  BookOpen,
  CloudLightning,
  Download,
  GitBranch,
  GitPullRequest,
  RefreshCcw,
  Save,
  Shield,
  Users,
} from "react-feather";
import { AbilitiesContext } from "../../providers/abilities/abilitiesProvider";
import { BuildContext } from "../../providers/build/buildProvider";
import { NodesContext } from "../../providers/nodes/nodesProvider";
import { StatsContext } from "../../providers/stats/statsProvider";
import { TagsContext } from "../../providers/tags/tagsProvider";
import exampleJson from "../../data/example-config.json";

import "./codePanel.scss";
import { Accordion } from "../layout/accordion/accordion";
import { each, filter, isArray, isString, map } from "lodash-es";
import { SmolButton } from "../common/buttons/smolButton";
import { FancyTextInput } from "../common/tag-input/fancyTextInput";
import { stateContext } from "../../providers/state/stateProvider";
import classNames from "classnames";
import Select from "react-select";
import { UnitSelect } from "../common/selects/unitSelect";

export function CodePanel({ graphEvents$ }) {
  const {
    build,
    setSavedBuild,
    defaultUnits,
    customUnits,
    setDefaultUnits,
    setSelectedUnit,
    selectedUnit,
    setCustomUnits,
  } = useContext(BuildContext);
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
  const { nodes, setNodes, setSavedNodes } = useContext(NodesContext);
  const { version, setVersion } = useContext(stateContext);

  const [selectedUnitIdsForSave, setSelectedUnitsIdsForSave] = useState([]);
  const [overwriteExistingUnits, setOverwriteExistingUnits] = useState(false);

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

  const downloadFile = (type: "build" | "units" | "trees") => {
    let data = {};
    let filename = "";

    if (type === "units") {
      const unitsToSave = filter(customUnits, (unit) =>
        selectedUnitIdsForSave.includes(unit.id)
      );

      data = unitsToSave;
      const name = buildFileName || "units";

      filename = `${name}.json`;
    }

    if (type === "build") {
      data = build?.exportableBuild;
      const name = buildFileName || "dragon-build";

      filename = `${name}.json`;
    } else if (type === "trees") {
      const name = treeFileName || "dragon-trees";

      data = {
        version,
        abilities,
        abilityTypes,
        globalParams,
        nodes,
        tagColors,
        stats,
        defaultUnits,
      };
      filename = `${name}.json`;
    }

    if (filename.length && data) {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const href = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = href;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }
  };

  const handleBuildImportClicked = (event) => {
    let data = JSON.parse(buildFile);

    if (data) {
      let units = data;

      // handle old files
      if (!isArray(data)) {
        let id = `imported-${Math.floor(Math.random() * 700000)}`;

        units = [{ name: id, id, build: data }];
      }

      if (overwriteExistingUnits) {
        setCustomUnits({ type: "set", units: [] });
      }

      setCustomUnits({ type: "addMany", units });
    }
  };

  const handleTreeImportClicked = (event) => {
    if (treeFile.length) {
      const config = JSON.parse(treeFile);

      setSavedBuild({ type: "imported", build: {} });

      if (config) {
        if (config.defaultUnits) {
          setDefaultUnits({ type: "set", nodes: config.defaultUnits });
        }

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
    setSavedNodes({ type: "imported", nodes: Math.random() });
  };

  const resetClicked = (event) => {
    setNodes({
      type: "reset",
    });
    setVersion({ type: "set", version: "0.0.0" });
    setAbilities({ type: "set", abilities: [] });
    setAbilityTypes({ type: "set", abilityTypes: [] });
    setTagColors({ type: "set", tagColors: {} });
    setStats({ type: "set", stats: [] });
    setGlobalParams({ type: "set", params: [] });

    setSavedBuild({ type: "imported", build: {} });
    setSavedNodes({ type: "imported", nodes: Math.random() });
  };

  const defaultClicked = (event) => {
    const defaults = exampleJson;
    setSelectedUnit({});
    setSavedBuild({ type: "imported", build: {} });
    setVersion({ type: "set", version: defaults.version });
    setDefaultUnits({ type: "set", units: defaults.defaultUnits });
    setNodes({ type: "set", nodes: defaults.nodes });
    setStats({ type: "set", stats: defaults.stats });
    setAbilityTypes({ type: "set", abilityTypes: defaults.abilityTypes });
    setAbilities({ type: "set", abilities: defaults.abilities });
    setTagColors({ type: "set", colors: defaults.tagColors });
    setGlobalParams({ type: "set", params: defaults.globalParams });
    setSavedNodes({ type: "imported", nodes: Math.random() });
  };

  return (
    <div className="code-panel">
      <Accordion name="Units" startOpen={false} icon={<Users />}>
        <div className="section">
          <div className="uploader">
            <div className="title">
              Import Units
              <span className="icon theme">
                <Download size={14} />
                <Users size={14} />
              </span>
            </div>
            <div className="description">
              Import units. Make sure you have imported the correct skill tree
              first!
            </div>
            <div className="data-row">
              <label className="checkbox">
                <input
                  type={"checkbox"}
                  checked={overwriteExistingUnits}
                  onChange={(val) => {
                    setOverwriteExistingUnits(!overwriteExistingUnits);
                  }}
                />
                Clean Import
              </label>
              <div className="info">(Removes ALL current Custom Units)</div>
            </div>
            <div className="data-row">
              <label>File:</label>
              <input
                type="file"
                id="1"
                onChange={(e) => fileChanged(e, "build")}
              />
            </div>
            <div className="card-footer">
              <SmolButton
                type="emphasized"
                color="theme"
                clicked={handleBuildImportClicked}
              >
                Import Units <Download />
              </SmolButton>
            </div>
          </div>
          <div className="downloader">
            <div className="title">
              Save Units
              <span className="icon success">
                <Save size={14} />
                <Users size={14} />
              </span>
            </div>
            <div className="description">Save your custom units</div>

            <div className="data-row">
              <div className="label">Units To Save:</div>
              <UnitSelect
                isMulti={true}
                excludeDefaultUnits={true}
                valueChanged={function (value: any): void {
                  setSelectedUnitsIdsForSave(map(value, "value") as any);
                }}
              />
            </div>
            <div className="data-row">
              Save as:
              <FancyTextInput
                value={buildFileName}
                valueChanged={(e) => setBuildFileName(e)}
              />
            </div>
            <div className="card-footer">
              <SmolButton
                type="emphasized"
                color="success"
                clicked={() => downloadFile("units")}
              >
                Save Units <Save />
              </SmolButton>
            </div>
          </div>
        </div>
      </Accordion>
      <Accordion
        name="Trees, Abilities, Etc"
        startOpen={false}
        icon={<GitPullRequest />}
      >
        <div className="section">
          <div className="uploader">
            <div className="title success">
              Import Skill Tree{" "}
              <span className="icon">
                <Download size={14} />
                <GitPullRequest size={14} />
              </span>
            </div>
            <div className="description">
              Import a skill tree environment so you can build your character.
            </div>
            <div className="data-row">
              <label>File:</label>
              <input
                type="file"
                id="1"
                onChange={(e) => fileChanged(e, "tree")}
              />
            </div>
            <div className="card-footer">
              <SmolButton
                type="emphasized"
                color="accent"
                clicked={handleTreeImportClicked}
              >
                Import Trees/Abilities <Download />
              </SmolButton>
            </div>
          </div>
          <div className="downloader">
            <div className="title">
              Save Skill Tree{" "}
              <span className="icon success">
                <Save size={14} />
                <GitPullRequest size={14} />
              </span>
            </div>
            <div className="description">
              For DMs: Save the current skill tree, stats, params, etc as a
              downloadable configuration so others can create builds.
            </div>
            <div className="data-row">
              Save as:
              <FancyTextInput
                value={treeFileName}
                valueChanged={(e) => setTreeFileName(e)}
              />
            </div>
            <div className="card-footer">
              <SmolButton
                type="emphasized"
                color="success"
                clicked={() => downloadFile("trees")}
              >
                Save Current Trees/Abilities <Save />
              </SmolButton>
            </div>
          </div>
        </div>
      </Accordion>
      <Accordion name="Presets" startOpen={true}>
        <div className="reset">
          <SmolButton color="info" clicked={defaultClicked}>
            <CloudLightning />
            Load Ed's Latest Build
          </SmolButton>

          <br />
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
        <div></div>
        <div className="reset">
          <SmolButton color="danger" clicked={resetClicked}>
            <RefreshCcw />
            Start from Scratch
          </SmolButton>
        </div>
      </Accordion>
    </div>
  );
}
