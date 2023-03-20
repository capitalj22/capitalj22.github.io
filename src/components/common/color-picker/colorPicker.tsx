import reactCSS from "reactcss";
import { ChromePicker } from "react-color";
import { useEffect, useState } from "react";

export function ColorPicker({ color, colorChanged }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [_color, setColor] = useState(color || "#fff");

  useEffect(() => {
    setColor(color || "#fff");
  }, [color]);
  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (newColor) => {
    setColor(newColor.hex);
    colorChanged(newColor.hex);
  };

  const styles = reactCSS({
    default: {
      color: {
        width: "36px",
        height: "14px",
        borderRadius: "2px",
        background: _color,
      },
      swatch: {
        padding: "5px",
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute",
        zIndex: "2",
      },
      cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });
  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      {displayColorPicker ? (
        <div style={styles.popover}>
          <div style={styles._color} onClick={handleClose} />
          <ChromePicker
            color={_color}
            onChange={handleChange}
            disableAlpha={true}
          />
        </div>
      ) : null}
    </div>
  );
}
