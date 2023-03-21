import { clone, each, find, isFunction, isUndefined } from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Edit } from "react-feather";
import { Ability } from "../../../entities/abilities/abilities";
import { AbilitiesContext } from "../../../providers/abilities/abilitiesProvider";
import { TagsContext } from "../../../providers/tags/tagsProvider";
import { StatTag } from "../statTag/statTag";
import "./abilityCard.scss";
import { EditableAbilityCard } from "./editableAbilityCard";

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
  startOpen?: boolean;
  editable?: boolean;
  forceIsEditing?: boolean;
  abilityEdited?;
  abilityCopied?;
  abilityRemoved?;
  isExpanded?: boolean;
};

export function AbilityCard({
  ability,
  isPlayerAbility,
  modifiers,
  startOpen = true,
  editable = false,
  abilityEdited,
  abilityCopied,
  abilityRemoved,
  forceIsEditing = false,
  isExpanded,
}: Props) {
  const { abilityTypes } = useContext(AbilitiesContext);
  const { abilities, setAbilities } = useContext(AbilitiesContext);
  const { setTagColors } = useContext(TagsContext);
  const [description, setDescription] = useState(
    getDescription(ability, isPlayerAbility, modifiers)
  );
  const [expanded, setExpanded] = useState(startOpen);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isUndefined(isExpanded)) {
      setExpanded(!!isExpanded);
    }
  }, [isExpanded]);

  useEffect(() => {
    if (forceIsEditing) {
      setIsEditing(true);
    }
  }, [forceIsEditing]);

  const abilityChanged = (event) => {
    // if (isFunction(abilityEdited)) {
    //   abilityEdited({ ability: event.ability, id: event.id });
    // }
    setIsEditing(false);
    setTagColors({ type: "save" });
  };

  const handleAbilityCopied = (event) => {
    abilityCopied(event);
  };
  
  const handleAbilityRemoved = (event) => {
    setIsEditing(false);
    abilityRemoved(event);
  };

  useEffect(() => {
    setDescription(getDescription(ability, isPlayerAbility, modifiers));
  }, [ability, modifiers]);

  if (isEditing) {
    return (
      <EditableAbilityCard
        ability={ability}
        abilityChanged={abilityChanged}
        editingCanceled={() => setIsEditing(false)}
        abilityCopied={handleAbilityCopied}
        abilityRemoved={handleAbilityRemoved}
      />
    );
  } else {
    return (
      <div className="ability-card">
        <div className="name">
          {editable && (
            <button className="edit" onClick={() => setIsEditing(!isEditing)}>
              <Edit />
            </button>
          )}
          <button className="card-title" onClick={() => setExpanded(!expanded)}>
            <div>{ability.name}</div>
            <div>{expanded ? <ChevronUp /> : <ChevronDown />}</div>
          </button>
        </div>
        {expanded ? (
          <div className="collapsible-content">
            <div className="top">
              {ability.replaces && (
                <div className="replaces">
                  Replaces{" "}
                  <span>{find(abilities, { id: ability.replaces })?.name}</span>
                </div>
              )}
              <p className="description">{description}</p>
            </div>
            <div className="bottom">
              <div className="tags">
                <StatTag
                  label={find(abilityTypes, { id: ability.type })?.name}
                  emphasize={true}
                ></StatTag>
                {ability.tags?.map((tag) => (
                  <StatTag label={tag}></StatTag>
                ))}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
