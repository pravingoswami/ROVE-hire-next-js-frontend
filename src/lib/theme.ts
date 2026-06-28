/** App palette aligned to Soft UI Dashboard */
import { softColors, softGradients, softGradient, type SoftGradientKey } from "./soft-ui";

export const palette = {
  brand: softColors.info,
  brandLight: "#abe9f7",
  brandMid: softColors.infoFocus,
  steel: softColors.secondary,
  cadet: softColors.info,
  ink: softColors.dark,
  slate: softColors.dark,
  muted: softColors.text,
  gray: softColors.text,
  surface: softColors.white,
  bg: softColors.background,
  border: softColors.light,
  success: softColors.success,
  warning: softColors.warning,
  danger: softColors.error,
  accent: softGradients.primary.main,
} as const;

/** Chart series colors aligned to Soft UI semantic palette */
export const chartColors = [
  softColors.info,
  softColors.success,
  softColors.warning,
  softGradients.primary.main,
  softColors.secondary,
  softColors.error,
  softGradients.dark.state,
] as const;

export { softColors, softGradient, type SoftGradientKey };
