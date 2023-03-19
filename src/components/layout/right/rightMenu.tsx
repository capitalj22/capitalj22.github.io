import { BookOpen, HelpCircle, Code, List } from "react-feather";

import "./rightMenu.scss";

export function RightMenu({ itemSelected }) {
  const handleSheetSelected = (event) => itemSelected(event, "sheet");
  const handleCodeSelected = (event) => itemSelected(event, "code");
  const handleHelpSelected = (event) => itemSelected(event, "help");
  const handleListSelected = (event) => itemSelected(event, "list");

  return (
    <div className="right-menu">
      <button type="button" onClick={handleSheetSelected}>
        <BookOpen />
      </button>
      <button type="button" onClick={handleCodeSelected}>
        <Code />
      </button>
      <button type="button" onClick={handleListSelected}>
        <List />
      </button>
      <button type="button" onClick={handleHelpSelected}>
        <HelpCircle />
      </button>
    </div>
  );
}
