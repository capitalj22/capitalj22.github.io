import "./bigButton.scss";

export function BigButton({
  type = "default",
  color = "white",
  children,
  clicked,
  disabled = false,
}) {
  return (
    <button
      className={
        "big-button " + type + " " + color + " " + (disabled ? "disabled" : "")
      }
      onClick={disabled ? () => {} : clicked}
    >
      {children}
    </button>
  );
}
