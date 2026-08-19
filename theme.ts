import { useTimerStore } from "./store";

/**
 * Theme
 *
 * Design tokens for the three selectable UI modes, sourced from
 * design_handoff_tambola_ui_themes/README.md. Every screen should read
 * colors/radii/fonts from here instead of hardcoding them.
 */
export type ThemeId = "midnight" | "festive" | "stage";

export interface Theme {
  id: ThemeId;
  name: string;
  bg: { type: "radial" | "solid"; stops: string[] };
  surface: string;
  /** Opaque surface for content that floats above other cards (dropdown
   * popups, modals, bottom sheets) — unlike `surface`, this must fully
   * occlude whatever is behind it, so it's never translucent. */
  popupSurface: string;
  surfaceBorder: string;
  text: string;
  textDim: string;
  accent: string;
  accentGradient?: string[];
  accentOn: string;
  accentTint: string;
  accentTintText: string;
  danger: string;
  cell: {
    idleBg: string;
    idleFg: string;
    idleBorder?: string;
    calledBg: string;
    calledFg: string;
    calledBorder?: string;
    curBg: string;
    curFg: string;
    prevBg: string;
    prevFg: string;
  };
  radius: { card: number; cell: number; button: number };
  font: { display: string; body: string; displayWeight: string };
  numeralCase: "plain" | "upper";
}

export const THEMES: Record<ThemeId, Theme> = {
  midnight: {
    id: "midnight",
    name: "Midnight Court",
    bg: { type: "radial", stops: ["#1B2A5E", "#101A3A", "#070B18"] },
    surface: "rgba(255,255,255,0.06)",
    popupSurface: "#141B3D",
    surfaceBorder: "rgba(255,255,255,0.12)",
    text: "#FFFFFF",
    textDim: "rgba(255,255,255,0.5)",
    accent: "#2BE07A",
    accentGradient: ["#2BE07A", "#12A65B"],
    accentOn: "#04140C",
    accentTint: "rgba(43,224,122,0.16)",
    accentTintText: "#5DF0A0",
    danger: "#FF5A5F",
    cell: {
      idleBg: "rgba(255,255,255,0.07)",
      idleFg: "rgba(255,255,255,0.42)",
      calledBg: "rgba(43,224,122,0.18)",
      calledFg: "#5DF0A0",
      calledBorder: "rgba(43,224,122,0.35)",
      curBg: "#2BE07A",
      curFg: "#04140C",
      prevBg: "rgba(255,90,95,0.9)",
      prevFg: "#FFFFFF",
    },
    radius: { card: 22, cell: 10, button: 16 },
    font: { display: "Sora_800ExtraBold", body: "Sora_400Regular", displayWeight: "800" },
    numeralCase: "plain",
  },
  festive: {
    id: "festive",
    name: "Festive Paper",
    bg: { type: "radial", stops: ["#FBF3E4", "rgba(233,162,39,0.18)", "rgba(122,21,51,0.12)"] },
    surface: "#FFFFFF",
    popupSurface: "#FFFFFF",
    surfaceBorder: "rgba(42,18,24,0.1)",
    text: "#2A1218",
    textDim: "rgba(42,18,24,0.5)",
    accent: "#E9A227",
    accentOn: "#3A1206",
    accentTint: "rgba(233,162,39,0.16)",
    accentTintText: "#7A1533",
    danger: "#7A1533",
    cell: {
      idleBg: "#FBF3E4",
      idleFg: "rgba(42,18,24,0.45)",
      idleBorder: "rgba(42,18,24,0.07)",
      calledBg: "#1F7A5C",
      calledFg: "#F3FFF9",
      curBg: "#E9A227",
      curFg: "#3A1206",
      prevBg: "#7A1533",
      prevFg: "#FDF2E2",
    },
    radius: { card: 24, cell: 10, button: 16 },
    font: { display: "InstrumentSerif_400Regular", body: "DMSans_400Regular", displayWeight: "400" },
    numeralCase: "plain",
  },
  stage: {
    id: "stage",
    name: "Caller Stage",
    bg: { type: "solid", stops: ["#0A0A0B"] },
    surface: "rgba(244,244,240,0.05)",
    popupSurface: "#161616",
    surfaceBorder: "rgba(244,244,240,0.16)",
    text: "#F4F4F0",
    textDim: "rgba(244,244,240,0.45)",
    accent: "#C6FF4F",
    accentOn: "#0A0A0B",
    accentTint: "rgba(198,255,79,0.12)",
    accentTintText: "#C6FF4F",
    danger: "#FF6B4F",
    cell: {
      idleBg: "transparent",
      idleFg: "rgba(244,244,240,0.35)",
      idleBorder: "rgba(244,244,240,0.12)",
      calledBg: "rgba(198,255,79,0.12)",
      calledFg: "#C6FF4F",
      calledBorder: "rgba(198,255,79,0.3)",
      curBg: "#C6FF4F",
      curFg: "#0A0A0B",
      prevBg: "#FF6B4F",
      prevFg: "#0A0A0B",
    },
    radius: { card: 4, cell: 4, button: 4 },
    font: { display: "Anton_400Regular", body: "SpaceGrotesk_400Regular", displayWeight: "400" },
    numeralCase: "upper",
  },
};

/** Returns the currently-selected theme's design tokens. */
export function useTheme(): Theme {
  const themeId = useTimerStore((state) => state.themeId);
  return THEMES[themeId];
}
