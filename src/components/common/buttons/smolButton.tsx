import "./smolButton.scss";

export function SmolButton({
  type = "default",
  color = "white",
  children,
  clicked,
  noPadding = false,
}) {
  const style = noPadding ? { padding: 0 } : {};

  return (
    <button
      className={"smol-button " + type + " " + color}
      onClick={clicked}
      style={style}
    >
      {children}
    </button>
  );
}
