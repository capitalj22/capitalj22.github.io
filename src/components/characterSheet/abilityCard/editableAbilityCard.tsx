import { clone, each, isFunction } from "lodash-es";
import { useEffect, useState } from "react";
import { Save, X } from "react-feather";
import { Ability } from "../../../entities/abilities/abilities";
import { StatTag } from "../statTag/statTag";
import "./abilityCard.scss";
import { AbilityParamEditor } from "./abilityParamEditor";
import { TagSelect } from "./tagSelect";

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

function getDescription(ability, isPlayerAbility, modifiers) {
  let description;
  let params = clone(ability.params);
  if (params && modifiers) {
    each(Object.keys(params), (key) => {
      if (modifiers[key]) {
        params[key] = params[key] + modifiers[key];
      }
    });
  }

  if (ability.params) {
    description = applyParamsToDescription(ability.description, params);
  } else {
    if (isFunction(ability.description)) {
      description = ability.description({});
    } else {
      description = ability.description;
    }
  }

  return description;
}

type Props = {
  ability: Ability;
  isPlayerAbility?: boolean;
  modifiers?: any;
  abilityChanged?: (ability: Ability) => void;
  editingCanceled?: () => void;
};
export function EditableAbilityCard({
  ability,
  abilityChanged,
  editingCanceled,
}: Props) {
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
            <textarea
              rows={10}
              value={_ability.description || ""}
              onChange={(e) => updateAbility("description", e)}
            ></textarea>
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
      <button className="save-button" onClick={savePressed}>
        Save <Save />
      </button>
    </div>
  );
}
