import reactCSS from "reactcss";
import { ChromePicker } from "react-color";
import { useEffect, useRef, useState } from "react";
import "./colorPicker.scss";

function useOutsideAlerter(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export function ColorPicker({ color, colorChanged }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [_color, setColor] = useState(color || "#fff");
  const popoverRef = useRef(null);
  useOutsideAlerter(popoverRef, () => {
    setDisplayColorPicker(false);
  });

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
    <div className="color-picker" ref={popoverRef}>
      <div className="swatch" style={styles.color} onClick={handleClick}></div>
      {displayColorPicker ? (
        <div style={styles.popover}>
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
