import { StylesConfig } from "react-select";

const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const color = {
  color: "var(--textColor)",
};

const bgColor = {
  backgroundColor: "var(--panelColor2)",
};

export const selectStyles: (options?: {
  dot: boolean;
  colorProp: string;
}) => StylesConfig<any> = (options?) => ({
  menu: (styles) => ({ ...styles, ...color, ...bgColor }),
  valueContainer: (styles) => ({
    ...styles,
    backgroundColor: "transparent",
    ...color,
  }),
  indicatorSeparator: (styles) => ({ ...styles, backgroundColor: "var(--supermutedText)" }),
  control: (styles) => ({
    ...styles,
    ...color,
    backgroundColor: "transparent",
    borderColor: "var(--supermutedText)",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      ...color,
      backgroundColor: isSelected ? "var(--panelColor)" : "var(--panelColor2)",
      ":hover": {
        backgroundColor: "var(--panelColor)",
      },
      ":focus": {
        backgroundColor: "var(--panelColor)",
      },
      ...(options?.dot && dot(data[options?.colorProp])),
    };
  },

  input: (styles) => ({ ...styles, ...color, ...(options?.dot && dot()) }),
  placeholder: (styles) => ({ ...styles, ...color }),
  singleValue: (styles, { data }) => ({
    ...styles,
    ...color,
    ...(options?.dot && dot(data[options?.colorProp])),
  }),
});
