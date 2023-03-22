import { includes } from "lodash-es";
import { useContext } from "react";
import { abilityFiltersContext } from "../../common/filters/abilityFilterProvider";
import { StatTag } from "../statTag/statTag";
import "./tagFilters.scss";

export function TagFilters({ tags }) {
  const { filters, setFilters } = useContext(abilityFiltersContext);

  const handleTagSelected = (tag: string) => {
    if (filters.tags.includes(tag)) {
      setFilters({ ...filters, tags: filters.tags.filter((t) => t !== tag) });
    } else {
      setFilters({ ...filters, tags: [...filters.tags, tag] });
    }
  };

  if (tags) {
    return (
      <div className="tag-filters">
        {tags.map((tag) => (
          <StatTag
            key={tag}
            label={tag}
            clicked={handleTagSelected}
            selected={includes(filters.tags, tag)}
          />
        ))}
      </div>
    );
  } else {
    return <div></div>;
  }
}
