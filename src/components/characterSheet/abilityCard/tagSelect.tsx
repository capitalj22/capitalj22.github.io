import { find } from "lodash-es";
import { useState } from "react";
import { Plus } from "react-feather";
import Select from "react-select";
import { TAGS } from "../../../data/tag-colors";

const typeOptions = [
  { label: "passive", value: "passive" },
  { label: "action", value: "action" },
  { label: "reaction", value: "reaction" },
  { label: "movement", value: "movement" },
];

function getStyle(tag): React.CSSProperties {
  let style: React.CSSProperties = {};

  const tagStyle = TAGS[tag] || { color: "#fff" };
  style = { borderColor: tagStyle.color || "#fff" };

  style.color = "#fff";

  if (tagStyle?.emphasis === 1) {
    style.borderColor = "transparent";
    style.backgroundColor = tagStyle.color;
    style.color = tagStyle.textColor;
    style.fontWeight = 600;
    style.borderRadius = 12;
  }

  return style;
}

export function TagSelect({ tags, type, tagsChanged, typeChanged }) {
  const [_tags, setTags] = useState(tags);
  const [_type, setType] = useState(type);

  const tagChanged = (e, index) => {
    let newTags = [..._tags];
    newTags[index] = e.target.value;
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
        <span className="stat-tag form-control" style={getStyle(tag)}>
          <input
            type="text"
            value={tag}
            onChange={(e) => tagChanged(e, index)}
          ></input>
          <button onClick={() => tagRemoved(index)}>x</button>
        </span>
      ))}
      <button className="add-tag" onClick={tagAdded}>
        <Plus size={16} />
      </button>
    </div>
  );
}
