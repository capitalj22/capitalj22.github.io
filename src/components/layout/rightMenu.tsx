import { BookOpen } from "react-feather";

import "./sidebarRight.scss";

export function RightMenu({ itemSelected }) {
  const handleItemSelected = (event) => itemSelected(event);

  return (
    <div className="right-menu">
      <button type="button" onClick={handleItemSelected}>
        <BookOpen />
      </button>
    </div>
  );
}
