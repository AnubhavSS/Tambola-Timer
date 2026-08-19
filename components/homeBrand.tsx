import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Circle, Defs, RadialGradient, Stop, Svg } from "react-native-svg";
import { Theme } from "../theme";

function MidnightMark() {
  const size = hp(13);
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="ball" cx="50%" cy="35%" r="65%">
            <Stop offset="0%" stopColor="#6BF5AA" />
            <Stop offset="58%" stopColor="#17B565" />
            <Stop offset="100%" stopColor="#0A6B39" />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#ball)" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.427}
          fill="none"
          stroke="rgba(4,20,12,0.35)"
          strokeWidth={size * 0.05}
          strokeDasharray={[size * 0.026, size * 0.2]}
          strokeLinecap="round"
        />
      </Svg>
      <View
        style={[
          styles.midnightInner,
          { width: size * 0.67, height: size * 0.67, borderRadius: size },
        ]}
      >
        <Text style={{ fontFamily: "Sora_800ExtraBold", fontSize: size * 0.27, color: "#EAFFF3" }}>
          90
        </Text>
      </View>
    </View>
  );
}

function FestiveMark() {
  const w = wp(11);
  const h = w * (92 / 132);
  const markedIdx = [2, 5, 9, 11, 14, 16];
  const markColors = ["#E9A227", "#7A1533", "#1F7A5C"];
  return (
    <View style={{ width: w, height: h * 1.25, justifyContent: "flex-end" }}>
      <View
        style={[
          styles.ticketBack,
          { width: w, height: h, backgroundColor: "#F3E0BE" },
        ]}
      />
      <View style={[styles.ticketFront, { width: w, height: h }]}>
        {Array.from({ length: 18 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.ticketCell,
              {
                backgroundColor: markedIdx.includes(i)
                  ? markColors[i % markColors.length]
                  : "rgba(42,18,24,0.08)",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function StageTiles({ theme }: { theme: Theme }) {
  const tiles: { n: string; kind: "accent" | "outline" | "danger" }[] = [
    { n: "07", kind: "accent" },
    { n: "24", kind: "outline" },
    { n: "61", kind: "danger" },
    { n: "88", kind: "outline" },
  ];
  return (
    <View style={styles.stageTilesRow}>
      {tiles.map((t) => {
        const bg =
          t.kind === "accent" ? theme.accent : t.kind === "danger" ? theme.danger : "transparent";
        const fg = t.kind === "outline" ? theme.text : theme.accentOn;
        return (
          <View
            key={t.n}
            style={[
              styles.stageTile,
              {
                backgroundColor: bg,
                borderColor: t.kind === "outline" ? theme.surfaceBorder : "transparent",
              },
            ]}
          >
            <Text style={{ fontFamily: theme.font.display, fontSize: hp(4), color: t.kind === "danger" ? "#0A0A0B" : fg }}>
              {t.n}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/**
 * HomeBrand
 *
 * Theme-specific hero content for the Home screen: an icon + wordmark for
 * midnight/festive, or a headline + number-tile strip for stage (no mark).
 */
export default function HomeBrand({ theme }: { theme: Theme }) {
  if (theme.id === "stage") {
    return (
      <View>
        <Text
          style={{
            fontFamily: theme.font.display,
            fontSize: hp(9),
            lineHeight: hp(9.5),
            color: theme.text,
            textTransform: "uppercase",
          }}
        >
          Call the{"\n"}
          <Text style={{ color: theme.accent }}>House</Text>
        </Text>
        <StageTiles theme={theme} />
        <Text
          style={{
            fontFamily: theme.font.body,
            fontSize: hp(2),
            letterSpacing: 2,
            color: theme.textDim,
            marginTop: hp(2),
            textTransform: "uppercase",
          }}
        >
          90 numbers{"\n"}one voice
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.markRow}>
      {theme.id === "midnight" ? <MidnightMark /> : <FestiveMark />}
      <View style={{ marginLeft: wp(3) }}>
        <Text
          style={{
            fontFamily: theme.font.display,
            fontWeight: theme.font.displayWeight as any,
            fontSize: hp(6),
            color: theme.text,
          }}
        >
          Tambola{"\n"}
          {theme.id === "festive" ? (
            <Text style={{ fontStyle: "italic", color: theme.danger }}>Timer</Text>
          ) : (
            "Timer"
          )}
        </Text>
        {theme.id === "midnight" && (
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: hp(1.6),
              letterSpacing: 2,
              color: theme.accentTintText,
              marginTop: hp(0.5),
            }}
          >
            AUTO CALLER
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  markRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  midnightInner: {
    position: "absolute",
    alignSelf: "center",
    top: "16.5%",
    left: "16.5%",
    backgroundColor: "rgba(4,20,12,0.24)",
    justifyContent: "center",
    alignItems: "center",
  },
  ticketBack: {
    position: "absolute",
    borderRadius: 8,
    transform: [{ rotate: "6deg" }],
  },
  ticketFront: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    transform: [{ rotate: "-5deg" }],
    padding: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "space-between",
  },
  ticketCell: {
    width: "15%",
    height: "26%",
    margin: "0.8%",
    borderRadius: 2,
  },
  stageTilesRow: {
    flexDirection: "row",
    gap: wp(2),
    marginTop: hp(2),
  },
  stageTile: {
    width: hp(6.5),
    height: hp(6.5),
    borderRadius: 4,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
});
