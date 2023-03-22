import { each, find } from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { Plus, Tag } from "react-feather";
import Select from "react-select";
import { TagsContext } from "../../../providers/tags/tagsProvider";
import { SmolButton } from "../../common/buttons/smolButton";
import { ColorPicker } from "../../common/color-picker/colorPicker";
import { AbilityTypeSelect } from "../../common/selects/abilityTypeSelect";
import { FancyTextInput } from "../../common/tag-input/fancyTextInput";
import "./tagSelect.scss";
const typeOptions = [
  { label: "passive", value: "passive" },
  { label: "action", value: "action" },
  { label: "reaction", value: "reaction" },
  { label: "movement", value: "movement" },
];

function getColors(tags, tagColors): any {
  let colors = {};
  if (tags) {
    each(Object.keys(tags), (tag) => {
      if (tagColors[tag]) {
        colors[tag] = tagColors[tag];
      } else {
        colors[tag] = "#fff";
      }
    });
  }
}

export function TagSelect({ tags, type, tagsChanged, typeChanged }) {
  const { tagColors, setTagColors } = useContext(TagsContext);
  const [_tags, setTags] = useState(tags || []);
  const [_type, setType] = useState(type);
  const [_colors, setColors] = useState(getColors(tags, tagColors) || {});
  const [currentTag, setCurrentTag] = useState(null);

  useEffect(() => {
    setColors(getColors(tags, tagColors) || {});
  }, [tagColors]);

  const tagChanged = (e, index) => {
    let newTags = [..._tags];
    newTags[index] = e;
    setTags(newTags);
    tagsChanged(newTags);
  };

  const tagAdded = () => {
    setTags([..._tags, ""]);
    tagsChanged([..._tags, ""]);
    setCurrentTag(tags?.length);
  };

  const tagRemoved = (index) => {
    let newTags = [..._tags];
    newTags.splice(index, 1);
    setTags(newTags);
    tagsChanged(newTags);
  };

  const typeSelected = (e) => {
    setType(e);
    typeChanged(e);
  };

  const colorChanged = (color, tag) => {
    setTagColors({ type: "add", color, tag });
  };

  return (
    <div className="tag-select">
      <AbilityTypeSelect defaultValue={type} valueChanged={typeSelected} />
      {_tags?.map((tag, index) => (
        <span
          className="stat-tag form-control"
          style={{ borderColor: tagColors[tag] }}
        >
          <div className="tag-color">
            <ColorPicker
              color={tagColors[tag]}
              colorChanged={(e) => colorChanged(e, tag)}
            />
          </div>
          <FancyTextInput
            autoFocus={currentTag === index}
            value={tag}
            valueChanged={(e) => tagChanged(e, index)}
          />
          <SmolButton clicked={() => tagRemoved(index)}>x</SmolButton>
        </span>
      ))}
      <button className="add-tag" onClick={tagAdded}>
        <Plus size={18} />
      </button>
    </div>
  );
}
