import { clone, each, isFunction } from "lodash-es";
import { useContext, useState } from "react";
import { Copy, Save, Trash2, X } from "react-feather";
import { Ability } from "../../../entities/abilities/abilities";
import "./abilityCard.scss";
import { AbilityParamEditor } from "./abilityParamEditor";
import { TagSelect } from "./tagSelect";
import TextareaAutosize from "react-textarea-autosize";
import { AbilitiesContext } from "../../../providers/abilities/abilitiesProvider";

function applyParamsToDescription(description, params) {
  let editedDescription = description;
  each(Object.keys(params), (key) => {
    let value = params[key];

    if (params[key]) {
      editedDescription = editedDescription.replace(
        new RegExp(`\{\\b${key}\\b\}([^*]+)\\\{\/\\b${key}\\b\}`),
        "$1"
      );
    } else {
      editedDescription = editedDescription.replace(
        new RegExp(`\{\\b${key}\\b\}([^*]+)\\\{\/\\b${key}\\b\}`),
        ""
      );
    }

    editedDescription = editedDescription.replace(
      new RegExp("%" + key + "%", "g"),
      value
    );
  });

  return editedDescription;
}

type Props = {
  ability: Ability;
  abilityChanged?: (ability: Ability) => void;
  editingCanceled?: () => void;
  abilityRemoved?: (ability: Ability) => void;
  abilityCopied: (ability: Ability) => void;
};
export function EditableAbilityCard({
  ability,
  abilityChanged,
  editingCanceled,
  abilityRemoved,
  abilityCopied,
}: Props) {
  const { setAbilities } = useContext(AbilitiesContext);
  const [originalId, setOriginalId] = useState(ability.id);

  const [_ability, setAbility] = useState(ability);

  const updateAbility = (prop, event) => {
    setAbility({ ..._ability, [prop]: event.target.value });
  };

  const handleTagsChanged = (e) => {
    setAbility({ ..._ability, tags: e });
  };

  const handleTypeChanged = (e) => {
    setAbility({ ..._ability, type: e });
  };

  const paramsChanged = (e) => {
    setAbility({ ..._ability, params: e });
  };

  const savePressed = () => {
    if (isFunction(abilityChanged)) {
      abilityChanged({ ability: _ability, id: ability.id });
    }

    setAbilities({
      type: "update",
      ability: _ability,
      targetId: originalId,
    });
  };

  const deletePressed = () => {
    if (isFunction(abilityRemoved)) {
      abilityRemoved(ability.id);
    }
  };

  const copyPressed = () => {
    if (isFunction(abilityCopied)) {
      abilityCopied({ ability: _ability, id: ability.id });
    }
  };

  return (
    <div className="ability-card">
      <div className="name">
        <button
          className="edit"
          onClick={() => {
            if (isFunction(editingCanceled)) {
              editingCanceled();
            }
          }}
        >
          <X />
        </button>

        <div className="form-control">
          <input
            type="text"
            value={_ability.name}
            onChange={(e) => updateAbility("name", e)}
          ></input>
        </div>
      </div>

      <div className="form-control id">
        <input
          type="text"
          value={_ability.id}
          onChange={(e) => updateAbility("id", e)}
        ></input>
      </div>

      <div className="collapsible-content">
        <div className="top">
          <p className="description form-control">
            {" "}
            <TextareaAutosize
              rows={10}
              value={_ability.description || ""}
              onChange={(e) => updateAbility("description", e)}
            />
          </p>
        </div>
        <div className="bottom">
          <div className="tags">
            <div className="title">Tags</div>

            <TagSelect
              tags={_ability.tags}
              type={_ability.type}
              tagsChanged={handleTagsChanged}
              typeChanged={handleTypeChanged}
            />
          </div>
        </div>
      </div>
      <AbilityParamEditor
        params={_ability.params}
        paramsChanged={paramsChanged}
      />
      <div className="buttons">
        <button className="save-button green" onClick={savePressed}>
          Save <Save />
        </button>
        <button className="copy-button" onClick={copyPressed}>
          Copy <Copy />
        </button>
        <button className="delete-button red" onClick={deletePressed}>
          Delete <Trash2 />
        </button>
      </div>
    </div>
  );
}
