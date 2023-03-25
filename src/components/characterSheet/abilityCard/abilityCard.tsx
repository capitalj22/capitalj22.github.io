import {
  clone,
  each,
  find,
  isFunction,
  isUndefined,
  map,
  uniq,
} from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Edit } from "react-feather";
import { Ability } from "../../../entities/abilities/abilities";
import { AbilitiesContext } from "../../../providers/abilities/abilitiesProvider";
import { BuildContext } from "../../../providers/build/buildProvider";
import { TagsContext } from "../../../providers/tags/tagsProvider";
import { SmolButton } from "../../common/buttons/smolButton";
import { StatTag } from "../statTag/statTag";
import "./abilityCard.scss";
import { EditableAbilityCard } from "./editableAbilityCard";

function applyParamsToDescription(description, params, globalParams) {
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

  if (globalParams) {
    each(Object.keys(globalParams), (key) => {
      let value = globalParams[key];

      if (globalParams[key]) {
        editedDescription = editedDescription.replace(
          new RegExp(`\{\@\\b${key}\\b\}([^*]+)\\\{\/\\b${key}\\b\}`),
          "$1"
        );
      } else {
        editedDescription = editedDescription.replace(
          new RegExp(`\{\@\\b${key}\\b\}([^*]+)\\\{\/\\b${key}\\b\}`),
          ""
        );
      }
      editedDescription = editedDescription.replace(
        new RegExp(`%@${key}%`, "g"),
        value
      );
    });
  }

  return editedDescription;
}

function getDescription(ability, modifiers, globalParams) {
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
    description = applyParamsToDescription(
      ability.description,
      params,
      globalParams
    );
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
  playerGlobalParams?: any[];
  tags?: string[];
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
  modifiers,
  playerGlobalParams,
  tags,
  startOpen = true,
  editable = false,
  abilityCopied,
  abilityRemoved,
  forceIsEditing = false,
  isExpanded,
}: Props) {
  const { abilityTypes } = useContext(AbilitiesContext);
  const { build } = useContext(BuildContext);
  const { abilities } = useContext(AbilitiesContext);
  const { tagColors, setTagColors } = useContext(TagsContext);
  const [_globalParams, setGlobalParams] = useState(playerGlobalParams);
  const [description, setDescription] = useState(
    getDescription(ability, modifiers, _globalParams)
  );
  const [expanded, setExpanded] = useState(startOpen);
  const [isEditing, setIsEditing] = useState(false);
  const [typeColor, setTypeColor] = useState(
    find(abilityTypes, { id: ability.type })?.color
  );

  useEffect(() => {
    setGlobalParams(build.globalParams);
  }, [build]);

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
    setDescription(getDescription(ability, modifiers, playerGlobalParams));
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
      <div className="ability-card" style={{ borderColor: typeColor }}>
        <div className="name">
          {editable && (
            <SmolButton
              color="mutedText"
              clicked={() => setIsEditing(!isEditing)}
            >
              <Edit />
            </SmolButton>
          )}
          <button className="card-title" onClick={() => setExpanded(!expanded)}>
            <div className="left">
              {ability.name}
              <div className="dots">
                {!expanded &&
                  map(ability.tags, (tag) => (
                    <span
                      key={tag}
                      className="dot"
                      style={{ backgroundColor: tagColors[tag] }}
                    ></span>
                  ))}
              </div>
            </div>
            <div className="chevron">
              {expanded ? <ChevronUp /> : <ChevronDown />}
            </div>
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
                  color={
                    find(abilityTypes, { id: ability.type })?.color || "#ffffff"
                  }
                  label={find(abilityTypes, { id: ability.type })?.name}
                  emphasize={true}
                ></StatTag>
                {uniq([...(ability.tags || []), ...(tags || [])])?.map(
                  (tag) => (
                    <StatTag key={tag} label={tag}></StatTag>
                  )
                )}
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
