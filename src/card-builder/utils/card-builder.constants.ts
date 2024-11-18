export const defaultImages = [
  "./cards/generic/construction.png",
  "./cards/battle/weapon_badge.png",
  "./cards/battle/tactic_badge.png",
];
export type FactionName =
  | "Goldbeard Clan"
  | "Orcish Confederation"
  | "Order of Moonlight"
  | "Necromantic League"
  | "Mercenary Guild"
  | "The Silent Ones";

export type FactionNickname = "GBC" | "OC" | "OOM" | "NL" | "MG" | "TSO";

export enum Fonts {
  Bs = "Bahnschrift",
  Ns = "NotoSerif",
  Ga = "Garamond",
}

export enum Weight {
  light = 300,
  med = 500,
  bold = 700,
}

export enum FontSize {
  title = 55,
}

export enum Fill {
  white = "#fff",
  dark = "#0C0A07",
  darkStroke = "#22a2f",
  playWhen = "#f6d2a7",
  choose = "#f9ebda",
  whiteish = "#eee",
  whiteMuted = "#aaa",
  hordeDark = "#1D0808",
}

export interface CardFont {
  font: Fonts;
  size: FontSize | number;
  lineHeight?: "big" | "small";
  fill: Fill;
  italic?: boolean;
  weight: Weight;
  strokeColor?: Fill;
  strokeSize?: number;
}
