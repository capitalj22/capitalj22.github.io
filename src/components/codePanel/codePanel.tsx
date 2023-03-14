import { useState } from "react";
import { Copy, Download } from "react-feather";
import "./codePanel.scss";

export function CodePanel({ dragon, importAttempted }) {
  const [textValue, setTextValue] = useState("");
  const [notificationStyle, setNotificationStyle] = useState({ opacity: 0 });

  const handleValueChanged = (event) => {
    setTextValue(event.target.value);
  };

  const handleImportClicked = (event) => {
    importAttempted(textValue);
  };
  const handleCopyClicked = (event) => {
    navigator.clipboard.writeText(JSON.stringify(dragon.exportableBuild));

    setNotificationStyle({ opacity: 1 });

    setTimeout(() => {
      setNotificationStyle({ opacity: 0 });
    }, 2000);
  };

  return (
    <div className="code-panel">
      <div className="import">
        <textarea
          spellCheck={false}
          rows={8}
          onChange={handleValueChanged}
          placeholder="Paste exported build here"
        ></textarea>
        <button className="attached" onClick={handleImportClicked}>
          Import Build <Download />
        </button>
      </div>
      <div className="export">
        <button onClick={handleCopyClicked}>
          Copy Current Build <Copy />
        </button>
        <div style={notificationStyle}>Text Copied to Clipboard</div>
      </div>
    </div>
  );
}
