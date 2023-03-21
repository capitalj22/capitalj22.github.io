import { compact, isFunction } from "lodash-es";
import { useContext, useEffect, useRef, useState } from "react";
import { Copy, RotateCcw, Save, Trash2 } from "react-feather";
import { Ability } from "../../../entities/abilities/abilities";
import "./abilityCard.scss";
import { AbilityParamEditor } from "./abilityParamEditor";
import { TagSelect } from "./tagSelect";
import TextareaAutosize from "react-textarea-autosize";
import { AbilitiesContext } from "../../../providers/abilities/abilitiesProvider";
import { AbilitySelect } from "../../common/selects/abilitySelect";
import { BigButton } from "../../common/buttons/bigButton";
import "./editableAbilityCard.scss";
import { Accordion } from "../../layout/accordion/accordion";

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

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);
  const updateAbility = (prop, newValue) => {
    setAbility({ ..._ability, [prop]: newValue });
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
      abilityChanged({
        ability: _ability,
        id: ability.id,
      });
    }

    setAbilities({
      type: "update",
      ability: {
        ..._ability,
        tags: compact(_ability.tags),
      },
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
    <div className="ability-card editable">
      <div className="name">
        <button
          className="edit"
          onClick={() => {
            if (isFunction(editingCanceled)) {
              editingCanceled();
            }
          }}
        >
          <RotateCcw />
        </button>

        <div className="form-control">
          <input
            ref={nameInputRef}
            type="text"
            value={_ability.name}
            onChange={(e) => updateAbility("name", e.target.value)}
          ></input>
        </div>
      </div>

      <div className="form-control id">
        <input
          type="text"
          value={_ability.id}
          onChange={(e) => updateAbility("id", e.target.value)}
        ></input>
      </div>

      <div className="replaces">
        <div className="replaces-name">Replaces</div>
        <AbilitySelect
          usedOptions={[_ability.id]}
          defaultValue={_ability.replaces}
          valueChanged={(e) => updateAbility("replaces", e)}
          showEmptyOption={true}
        />
      </div>

      <p className="description form-control">
        {" "}
        <TextareaAutosize
          placeholder="Description"
          rows={10}
          value={_ability.description || ""}
          onChange={(e) => updateAbility("description", e.target.value)}
        />
      </p>
      <div className="accordions">
        <Accordion name="Tags" startOpen={true}>
          <div className="tags">
            <TagSelect
              tags={_ability.tags}
              type={_ability.type}
              tagsChanged={handleTagsChanged}
              typeChanged={handleTypeChanged}
            />
          </div>
        </Accordion>
        <Accordion name="Params" startOpen={false}>
          <div className="params">
            <AbilityParamEditor
              params={_ability.params}
              paramsChanged={paramsChanged}
            />
          </div>
        </Accordion>
      </div>

      <div className="buttons">
        <BigButton type="outline" color="success" clicked={savePressed}>
          Save <Save />
        </BigButton>
        <BigButton type="outline" color="theme" clicked={copyPressed}>
          Save & Copy <Copy />
        </BigButton>
        <BigButton type="outline" color="danger" clicked={deletePressed}>
          Delete <Trash2 />
        </BigButton>
      </div>
    </div>
  );
}
