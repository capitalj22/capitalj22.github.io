import "./smolButton.scss";

export function SmolButton({
  type = "default",
  color = "white",
  children,
  clicked,
}) {
  return (
    <button className={"smol-button " + type + " " + color} onClick={clicked}>
      {children}
    </button>
  );
}
