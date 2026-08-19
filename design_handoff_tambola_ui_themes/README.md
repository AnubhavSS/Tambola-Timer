# Handoff: Tambola Timer — 3 selectable UI themes

## Overview
Redesign of the existing Expo/React Native app `AnubhavSS/Tambola-Timer` (landscape, expo-router, zustand). Three complete visual directions are delivered. The product goal: the user picks a **UI mode** in Settings and the whole app re-skins — flow, screens, and logic stay exactly as they are today.

- **`midnight`** — Midnight Court: dark navy glass, green accent (evolution of today's look).
- **`festive`** — Festive Paper: warm cream/maroon/marigold, serif display.
- **`stage`** — Caller Stage: near-black, lime accent, giant Anton numerals, room-scale readability.

## About the design files
`Tambola Timer Redesign.dc.html` in this bundle is a **design reference written in HTML** — a prototype of intended look and behavior, not production code to copy. Recreate it inside the existing Expo/React Native app using its current libraries (`react-native`, `react-native-svg`, `react-native-reanimated`, `react-native-responsive-screen`, `zustand`, `expo-speech`, `react-native-google-mobile-ads`). Do **not** introduce web CSS, and do not restructure routing.

Open the file in a browser: the game screens are live (numbers draw, ring fills, tap the number to pause, pattern chips toggle), so behavior can be observed, not just read.

## Fidelity
**High fidelity.** Colors, type, radii, and sizes below are final. Frame size in the mocks is 880×420 px, which stands for a phone in landscape (~2.1:1); translate to `wp()/hp()` or flex, never fixed px.

## Theme architecture (the new part)
Add a theme layer; every screen reads from it instead of hardcoding colors.

```ts
// theme.ts
export type ThemeId = "midnight" | "festive" | "stage";
export interface Theme {
  id: ThemeId; name: string;
  bg: { type: "radial" | "solid"; stops: string[] };   // radial → react-native-svg RadialGradient
  surface: string; surfaceBorder: string;              // cards
  text: string; textDim: string;
  accent: string; accentOn: string;                    // accent + text ON accent
  danger: string;                                      // previous-number highlight
  cell: { idleBg: string; idleFg: string; calledBg: string; calledFg: string;
          curBg: string; curFg: string; prevBg: string; prevFg: string; border?: string };
  radius: { card: number; cell: number; button: number };  // stage uses ~4 (near-square)
  font: { display: string; body: string; displayWeight: string };
  numeralCase: "plain" | "upper";                      // stage upper-cases labels
}
```

Store: add `themeId: ThemeId` + `setTheme(id)` to `useTimerStore` and persist it (`zustand/middleware` `persist` + `@react-native-async-storage/async-storage`). Provide `useTheme()` returning `THEMES[themeId]`. Fonts load once via `expo-font` (all three families) so switching is instant.

Fonts (Google Fonts, `@expo-google-fonts/*`):
- midnight → **Sora** 400/600/700/800
- festive → **Instrument Serif** 400 + italic (display), **DM Sans** 400/500/700 (body)
- stage → **Anton** 400 (display), **Space Grotesk** 400/500/700 (body)

Settings gains a **UI mode** card: three preview tiles (bg swatch + accent chip + type sample), single-select, applies immediately.

## Design tokens

### midnight — Midnight Court
| Token | Value |
| --- | --- |
| Background | radial gradient, center 20% 0%, `#1B2A5E` → `#101A3A` (45%) → `#070B18` |
| Surface / border | `rgba(255,255,255,0.05–0.07)` / `rgba(255,255,255,0.10–0.14)` |
| Text / dim | `#FFFFFF` / `rgba(255,255,255,0.5)` |
| Accent gradient | `#2BE07A` → `#12A65B` (140deg); text on accent `#04140C` |
| Accent tint / text | `rgba(43,224,122,0.16)` / `#5DF0A0` |
| Danger (previous) | `#FF5A5F` |
| Cells | idle `rgba(255,255,255,.07)` / `rgba(255,255,255,.42)`; called `rgba(43,224,122,.18)` / `#5DF0A0` + inset 1px `rgba(43,224,122,.35)`; current `#2BE07A` / `#04140C` + glow ring `rgba(43,224,122,.28)` 3px; previous `rgba(255,90,95,.9)` / `#fff` |
| Radii | card 20–26, cell 10, button 16, pill 999 |
| Shadow | `0 14px 34px rgba(43,224,122,.3)` on primary; `0 12px 30px rgba(0,0,0,.35)` on plates |

### festive — Festive Paper
| Token | Value |
| --- | --- |
| Background | `#FBF3E4` + radial washes `rgba(233,162,39,.18)` at 12% 18%, `rgba(122,21,51,.12)` at 88% 84% |
| Surface / border | `#FFFFFF` / `rgba(42,18,24,0.08–0.12)` |
| Text / dim | `#2A1218` / `rgba(42,18,24,0.5)` |
| Primary (rose) | `#7A1533`, text on it `#FDF2E2` |
| Accent (marigold) | `#E9A227`, text on it `#3A1206`; knob/second `#B87A11` |
| Green | `#1F7A5C` (called cells), text `#F3FFF9` |
| Cells | idle `#FBF3E4` / `rgba(42,18,24,.45)` border `rgba(42,18,24,.07)`; called `#1F7A5C`/`#F3FFF9`; current `#E9A227`/`#3A1206`; previous `#7A1533`/`#FDF2E2` |
| Radii | card 22–28, cell 10, button 16 |
| Shadow | `0 12px 26px rgba(122,21,51,.28)` primary; `0 8px 22px rgba(122,21,51,.08)` cards |

### stage — Caller Stage
| Token | Value |
| --- | --- |
| Background | solid `#0A0A0B` |
| Text / dim | `#F4F4F0` / `rgba(244,244,240,0.45)` |
| Accent | `#C6FF4F`, text on it `#0A0A0B`; hover `#DBFF86` |
| Danger (previous) | `#FF6B4F` |
| Hairlines | `rgba(244,244,240,0.12–0.22)` |
| Cells | idle transparent / `rgba(244,244,240,.35)` border `rgba(244,244,240,.12)`; called `rgba(198,255,79,.12)` / `#C6FF4F` border `rgba(198,255,79,.3)`; current `#C6FF4F`/`#0A0A0B`; previous `#FF6B4F`/`#0A0A0B` |
| Radii | 4 (buttons/cards), cells square |
| Label style | 10.5px, `letter-spacing .2–.28em`, UPPERCASE |

Spacing scale used throughout: 4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 22 / 26 / 30.

## Screens

### 1. Home (`app/index.tsx`)
Two columns; left = brand + status, right = actions. Bottom-right holds the **banner ad slot** (32–34px tall, dashed placeholder in mocks; keep `BannerAd` there).

- **Brand mark** — one per theme, all built with primitives (no bitmap needed):
  - midnight: 96px circle, radial `#6BF5AA → #17B565 (58%) → #0A6B39`, inner 64px disc `rgba(4,20,12,.24)` with "90" (Sora 800 26px `#EAFFF3`), plus 12 tick marks — an `react-native-svg` circle r=41, stroke `rgba(4,20,12,.35)` w=5, `strokeDasharray=[2.5,20.6]`, round caps. Beside it: "Tambola / Timer" Sora 800 27px/1, `-0.03em`, and "AUTO CALLER" 10px `.2em` `#5DF0A0`.
  - festive: two stacked tambola tickets — back card `#F3E0BE` rotated +6°, front `#fff` rotated −5°, 132×92, inside a 6×3 grid of 3px-radius cells, 6 marked (`#E9A227`, `#7A1533`, `#1F7A5C`). Beside it "Tambola / *Timer*" Instrument Serif 42px/.92, italic rose second line.
  - stage: no mark; headline "CALL THE / HOUSE" Anton 104px/.84 uppercase (`house` in `#C6FF4F`) + a strip of four 52px number tiles (7 filled accent, 24 outline, 61 `#FF6B4F`, 88 outline) and a two-line label "90 NUMBERS / ONE VOICE".
- **Status chips** (midnight/festive): "Voice: English", "Every 6s", "N patterns" — pill, 7×12 padding, 11.5px 500.
- **Primary action** "Start new game": 26 radius (4 for stage), accent fill, display type 26–34px, subline "Board resets · 90 numbers shuffled", trailing 46–48px circular ▶ badge. Calls `resetStore()` then `router.push("/gamescreen")`. midnight has a slow 3.2s pulsing outer glow; press → `translateY(-2px)`.
- **Secondary cards** "Continue" (subline "Resume at N of 90", visible only when `previousNumber !== null`) and "Settings", side by side, surface fill.
- **How to play** — text link/icon, opens the existing `How_To_Play` modal. It should no longer auto-open on every launch: show it on first run only (persist a `seenHowTo` flag).

### 2. Game (`app/gamescreen.tsx`)
Row: left control column ~44% width, right board card fills the rest. Padding 14–16.

- **Caller ring** (midnight/festive) — 230–236px square. `react-native-svg` circle r=104–106, track `rgba(255,255,255,.12)` / `rgba(122,21,51,.1)`, progress stroke 10–11px, round cap, rotated −90°, `strokeDashoffset = (1 - progress) * circumference` animated with reanimated (reuse `components/CircularProgress.tsx`, add themed colors). midnight adds `drop-shadow(0 0 10px rgba(43,224,122,.55))`; festive sits on a white disc — **the number must render above that disc** (z-order/elevation). Center: current number, 2 digits zero-padded, tabular numerals (Sora 800 96px, or Instrument Serif 100px rose), plus a `calling / paused` micro-label 10.5–11px `.14em` uppercase.
- **Caller display, stage variant** — no ring: number in Anton 176px/.8 `#C6FF4F` above an 8px linear progress bar (accent fill, `width: progress%`, .1s linear), with `CALLING` and `PREV 61` on the row beneath.
- Tapping the number area toggles play/pause (`togglePlayPause`).
- **Recent strip** (midnight/festive): "Last" + previous 4 called numbers, 38–40px tiles.
- **Control bar**: primary `Pause/Resume` (flex 1, 50–52px), plus 50–52px square `↺` reset and `⚙` settings buttons. This replaces today's hidden-tap behavior; use icons from `@expo/vector-icons` (`play`/`pause`, `refresh`, `settings`).
- **Pattern chips**: 6 short patterns (Early 5, Top Line, Middle Line, Bottom Line, Corners, Full House), tappable, selected = accent fill. Source of truth = `games`/selected patterns in the store — this replaces the modal + checkbox flow in `components/games.tsx`.
- **Board card**: header "Board" + legend (called / previous) + `N/90` counter; grid of 90 cells, `numColumns` from the existing `calculateGridLayout` (9/10/11), cell 34px & gap 3–4 at mock scale, font ~14.5px 600 tabular. Cell state precedence: **current > previous > called > idle**; background/color transition 200–250ms.

### 3. Settings (`app/settingscreen.tsx`)
Header: 34px back button + title (22px Sora 800 / 28px Instrument Serif) + "Saved automatically". Body = two equal cards, no scrolling.

- Left card: **Call interval** (3–15s, label shows `6s`), **Voice speed**, **Volume** — 6px track, accent fill, 18px round knob; then **Announce in** segmented control (English / हिंदी) in a 14px-radius inset track, selected = accent fill.
- Right card: **Patterns in play** — 15 chips from `data.ts`, count in the header, plus an "Add your own pattern…" input with an accent **Add** button (existing `handleSubmit` logic).
- **Add a "UI mode" card** (not in the mocks): three theme preview tiles, single select, writes `setTheme(id)`.

### 4. History sheet (`components/previousModal.tsx`)
Bottom sheet, not a centered box: 26px top corners, `#0D1430` (theme surface), scrim `rgba(4,7,16,.6)`, 44×4 grab handle, title "Called so far" + "newest first · N numbers", horizontal row of 62px tiles (newest = accent fill), then two buttons: "Repeat last call" (secondary, re-speaks `currentNumber`) and "Back to board" (accent).

## Interactions & behavior
- Timer loop unchanged: 100ms tick, `progress += 0.1/interval`, at ≥1 draw next from the shuffled pool, `setNumber` shifts current → previous; stop at 90 (`play_pause: false`).
- Speech unchanged (digit, digit, whole number via `expo-speech`).
- Pause/resume via the control bar or tapping the number; ring/bar freezes at current progress.
- Reset `↺` → confirm, then `resetStore()` + reshuffle.
- Transitions: cell state 200–250ms ease; button press `translateY(-2px)` or opacity 0.9; midnight primary glow pulse 3.2s infinite; sheet slides up 250ms.
- Grid stays non-scrolling and must fit without clipping at 9/10/11 columns — compute from available height first (mock lesson: the board is the height-critical element).

## State
Existing: `progress, play_pause, currentNumber, previousNumber, history, previousArray, showPreviousModal, soundVolume, timerInterval, language, rate, games, gridLayout`.
New: `themeId` (persisted), `seenHowTo` (persisted), selected patterns as a persisted array.

## Assets
No bitmaps required — all three brand marks are vector/primitive constructions described above. The old `assets/images/logoo.png` is intentionally **not** used (replaced). App icon/splash still reference `icon.jpeg` in `app.json`; recommend a new icon derived from the midnight ball mark.

## Files
- `Tambola Timer Redesign.dc.html` — the design reference (all three themes: Home / Game / Settings, plus midnight's history sheet). Open in a browser; the game screens run live.
- `README.md` — this document.
