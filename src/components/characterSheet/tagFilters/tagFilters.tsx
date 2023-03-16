import { includes } from "lodash-es";
import { useEffect, useState } from "react";
import { StatTag } from "../statTag/statTag";
import './tagFilters.scss';

export function TagFilters({ tags, selectedTagsChanged }) {
  const [selectedTags, setSelectedTags] = useState([] as string[]);

  const handleTagSelected = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  useEffect(() => {
    selectedTagsChanged(selectedTags);
    console.log(selectedTags);
  }, [selectedTags]);

  if (tags) {
    return (
      <div className="tag-filters">
        {tags.map((tag) => (
          <StatTag
            key={tag}
            label={tag}
            clicked={handleTagSelected}
            selected={includes(selectedTags, tag)}
          />
        ))}
      </div>
    );
  } else {
    return <div></div>;
  }
}
