import { each, find } from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { Tag } from "react-feather";
import Select from "react-select";
import { TAGS } from "../../../data/tag-colors";
import { ColorPicker } from "../../common/color-picker/colorPicker";
import { FancyTextInput } from "../../common/tag-input/fancyTextInput";
import "./tagSelect.scss";
import { TagsContext } from "../../../assets/services/tags/tagsService";
const typeOptions = [
  { label: "passive", value: "passive" },
  { label: "action", value: "action" },
  { label: "reaction", value: "reaction" },
  { label: "movement", value: "movement" },
];

function getColors(tags, tagColors): any {
  let colors = {};
  each(Object.keys(tags), (tag) => {
    if (tagColors[tag]) {
      colors[tag] = tagColors[tag];
    } else {
      colors[tag] = "#fff";
    }
  });
}

export function TagSelect({ tags, type, tagsChanged, typeChanged }) {
  const { tagColors, setTagColors } = useContext(TagsContext);
  const [_tags, setTags] = useState(tags || []);
  const [_type, setType] = useState(type);
  const [_colors, setColors] = useState(getColors(tags, tagColors) || {});

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
    setTags([..._tags, "tag"]);
    tagsChanged([..._tags, "tag"]);
  };

  const tagRemoved = (index) => {
    let newTags = [..._tags];
    newTags.splice(index, 1);
    setTags(newTags);
    tagsChanged(newTags);
  };

  const typeSelected = (e) => {
    setType(e.value);
    typeChanged(e.value);
  };

  const colorChanged = (color, tag) => {
    setTagColors({ type: "add", color, tag });
  };

  return (
    <div className="tag-select">
      <Select
        classNames={{
          control: () => "select",
          singleValue: () => "single-value",
          menu: () => "select-menu",
        }}
        options={typeOptions}
        onChange={(e) => typeSelected(e)}
        value={find(typeOptions, { value: _type })}
      ></Select>
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
            value={tag}
            valueChanged={(e) => tagChanged(e, index)}
          />
          <button onClick={() => tagRemoved(index)}>x</button>
        </span>
      ))}
      <button className="add-tag" onClick={tagAdded}>
        <Tag size={18} />
      </button>
    </div>
  );
}
