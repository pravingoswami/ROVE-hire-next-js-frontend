/** Soft UI Dashboard design tokens (Creative Tim) */

export const softColors = {
  background: "#f8f9fa",
  white: "#ffffff",
  dark: "#344767",
  text: "#67748e",
  primary: "#cb0c9f",
  primaryFocus: "#ad0a87",
  secondary: "#8392ab",
  info: "#17c1e8",
  infoFocus: "#3acaeb",
  success: "#82d616",
  warning: "#fbcf33",
  error: "#ea0606",
  light: "#e9ecef",
  grey: {
    100: "#f8f9fa",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
  },
  inputBorder: "#d2d6da",
  inputFocus: "#35d1f5",
  inputShadow: "#81e3f9",
} as const;

export const softGradients = {
  primary: { main: "#7928ca", state: "#ff0080" },
  secondary: { main: "#627594", state: "#a8b8d8" },
  info: { main: "#2152ff", state: "#21d4fd" },
  success: { main: "#17ad37", state: "#98ec2d" },
  warning: { main: "#f53939", state: "#fbcf33" },
  error: { main: "#ea0606", state: "#ff667c" },
  dark: { main: "#141727", state: "#3a416f" },
} as const;

export type SoftGradientKey = keyof typeof softGradients;

export const softBadgeColors: Record<
  string,
  { background: string; text: string }
> = {
  primary: { background: "#f883dd", text: "#a3017e" },
  secondary: { background: "#e4e8ed", text: "#5974a2" },
  info: { background: "#abe9f7", text: "#08a1c4" },
  success: { background: "#cdf59b", text: "#67b108" },
  warning: { background: "#fef5d3", text: "#fbc400" },
  error: { background: "#fc9797", text: "#bd0000" },
  dark: { background: "#8097bf", text: "#1e2e4a" },
};

export function pxToRem(px: number, base = 16) {
  return `${px / base}rem`;
}

export function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export function rgba(color: string, opacity: number) {
  if (color.startsWith("rgb")) {
    const inner = color.replace(/^rgba?\(|\)$/g, "").split(",").slice(0, 3).join(",");
    return `rgba(${inner}, ${opacity})`;
  }
  return `rgba(${hexToRgb(color)}, ${opacity})`;
}

export function softBoxShadow(
  offset: [number, number],
  radius: [number, number],
  color: string,
  opacity: number,
  inset = ""
) {
  const [x, y] = offset;
  const [blur, spread] = radius;
  return `${inset} ${pxToRem(x)} ${pxToRem(y)} ${pxToRem(blur)} ${pxToRem(spread)} ${rgba(color, opacity)}`;
}

export const softShadow = {
  xs: softBoxShadow([0, 2], [9, -5], "#000000", 0.15),
  sm: softBoxShadow([0, 5], [10, 0], "#000000", 0.12),
  md: `${softBoxShadow([0, 4], [6, -1], "#141414", 0.12)}, ${softBoxShadow([0, 2], [4, -1], "#141414", 0.07)}`,
  lg: `${softBoxShadow([0, 8], [26, -4], "#141414", 0.15)}, ${softBoxShadow([0, 8], [9, -5], "#141414", 0.06)}`,
  xl: softBoxShadow([0, 23], [45, -11], "#141414", 0.25),
  xxl: softBoxShadow([0, 20], [27, 0], "#000000", 0.05),
  navbar: `${softBoxShadow([0, 0], [1, 1], "#ffffff", 0.9, "inset")}, ${softBoxShadow([0, 20], [27, 0], "#000000", 0.05)}`,
  button: `${softBoxShadow([0, 4], [7, -1], "#000000", 0.11)}, ${softBoxShadow([0, 2], [4, -1], "#000000", 0.07)}`,
  buttonHover: `${softBoxShadow([0, 3], [5, -1], "#000000", 0.09)}, ${softBoxShadow([0, 2], [5, -1], "#000000", 0.07)}`,
  buttonFocus: softBoxShadow([0, 0], [0, 3.2], softColors.info, 0.5),
  inputFocus: softBoxShadow([0, 0], [0, 2], softColors.inputShadow, 1),
};

export function linearGradient(color: string, colorState: string, angle = 310) {
  return `linear-gradient(${angle}deg, ${color}, ${colorState})`;
}

export function softGradient(key: SoftGradientKey, angle = 195) {
  const g = softGradients[key];
  return linearGradient(g.main, g.state, angle);
}

export const softRadius = {
  sm: pxToRem(4),
  md: pxToRem(8),
  lg: pxToRem(12),
  xl: pxToRem(16),
};
