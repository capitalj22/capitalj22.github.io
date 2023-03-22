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

  return (
    <button
      className={
        "smol-button " + type + " " + color + " " + (disabled ? "disabled" : "")
      }
      onClick={disabled ? () => {} : clicked}
      style={style}
    >
      {children}
    </button>
  );
}
