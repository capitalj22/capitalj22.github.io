import { compact, each, isFunction, map } from "lodash-es";
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
import { SmolButton } from "../../common/buttons/smolButton";

function formatParams(params = {}) {
  if (params) {
    return map(Object.keys(params), (key) => {
      return {
        name: key,
        value: params[key],
      };
    });
  } else {
    return [];
  }
}

function convertParams(params) {
  let newParams = {};
  each(params, (param) => {
    newParams[param.name] = param.value;
  });

  return newParams;
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
  const [params, setParams] = useState(formatParams(ability.params));

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  useEffect(() => {
    setParams(formatParams(ability.params));
  }, [ability]);

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
    setParams(e);
  };

  const savePressed = () => {
    if (isFunction(abilityChanged)) {
      abilityChanged({
        ability: { ..._ability, params: convertParams(params) },
        id: ability.id,
      });
    }

    setAbilities({
      type: "update",
      ability: {
        ..._ability,
        params: convertParams(params),
        tags: compact(_ability.tags),
      },
      targetId: originalId,
    });

    setAbilities({ type: "save" });
  };

  const deletePressed = () => {
    if (isFunction(abilityRemoved)) {
      abilityRemoved(ability.id);
    }
  };

  const copyPressed = () => {
    const newId = `${ability.id}-copy`;
    savePressed();

    setAbilities({
      type: "add",
      ability: {
        ..._ability,
        tags: compact(_ability.tags),
        id: newId,
        name: `${ability.name} Copy`,
      },
    });

    if (isFunction(abilityCopied)) {
      abilityCopied({ id: newId });
    }
  };

  return (
    <div className="ability-card editable">
      <div className="name">
        <SmolButton
          color="info"
          clicked={() => {
            if (isFunction(editingCanceled)) {
              editingCanceled();
            }
          }}
        >
          <RotateCcw />
        </SmolButton>

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
            <AbilityParamEditor params={params} paramsChanged={paramsChanged} />
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
