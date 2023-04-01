import "./smolButton.scss";

export function SmolButton({
  type = "default",
  color = "white",
  children,
  clicked,
  noPadding = false,
  disabled = false,
}) {
  const style = noPadding ? { padding: 0 } : {};
  const onClick = (e) => {
    e.stopPropagation();
    clicked(e);
  };
  return (
    <button
      className={
        "smol-button " + type + " " + color + " " + (disabled ? "disabled" : "")
      }
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}
