import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTimerStore } from "../store";
import { Theme } from "../theme";
import CircularProgress from "./CircularProgress";

/**
 * Timer Component
 *
 * Displays the caller number and lets the player tap it to pause/resume.
 * midnight/festive show a circular progress ring; stage shows a large
 * numeral over a linear progress bar (no ring). Sized to leave comfortable
 * room for the recent strip, control bar and pattern chips below it — the
 * parent column centers the whole cluster, so this only needs to size
 * itself, not position itself.
 */
const Timer = ({ theme }: { theme: Theme }) => {
  const progress = useTimerStore((state) => state.progress);
  const currentNumber = useTimerStore((state) => state.currentNumber);
  const previousNumber = useTimerStore((state) => state.previousNumber);
  const { play_pause, togglePlayPause } = useTimerStore();
  const insets = useSafeAreaInsets();
  const { height } = Dimensions.get("window");
  const availableHeight = height - insets.top - insets.bottom;

  const handlePause = () => {
    togglePlayPause();
  };

  const label = currentNumber < 10 ? `0${currentNumber}` : `${currentNumber}`;
  const microLabel = play_pause ? "calling" : "paused";

  if (theme.id === "stage") {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handlePause} activeOpacity={0.8}>
          <Text
            style={{
              fontFamily: theme.font.display,
              fontSize: hp(11),
              lineHeight: hp(11),
              color: theme.accent,
            }}
          >
            {label}
          </Text>
        </TouchableOpacity>
        <View style={[styles.stageTrack, { backgroundColor: theme.surfaceBorder }]}>
          <View
            style={[
              styles.stageFill,
              { backgroundColor: theme.accent, width: `${Math.min(progress, 1) * 100}%` },
            ]}
          />
        </View>
        <View style={styles.stageMetaRow}>
          <Text style={[styles.stageMeta, { color: theme.textDim, fontFamily: theme.font.body }]}>
            {microLabel.toUpperCase()}
          </Text>
          {previousNumber !== null && (
            <Text style={[styles.stageMeta, { color: theme.textDim, fontFamily: theme.font.body }]}>
              PREV {previousNumber}
            </Text>
          )}
        </View>
      </View>
    );
  }

  // Cap the ring by both available height and the column's width so it never
  // crowds the recent strip / controls / chips beneath it or overflows sideways.
  const circleSize = Math.min(availableHeight * 0.46, wp(23));

  return (
    <View style={styles.container}>
      <View
        style={[styles.timerWrapper, { width: circleSize, height: circleSize }]}
      >
        <CircularProgress
          progress={Math.round(progress * 100)}
          showLabel={false}
          outerCircleColor={theme.surfaceBorder}
          progressCircleColor={theme.accent}
          size={circleSize}
          strokeWidth={circleSize * 0.03}
        />

        <TouchableOpacity style={styles.playButton} onPress={handlePause}>
          <Text
            style={{
              fontFamily: theme.font.display,
              fontWeight: theme.font.displayWeight as any,
              fontSize: circleSize * 0.4,
              color: theme.text,
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: circleSize * 0.065,
              letterSpacing: 2,
              color: theme.textDim,
              textTransform: "uppercase",
              marginTop: circleSize * 0.02,
            }}
          >
            {microLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Timer;

/**
 * Component Styles
 */
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  timerWrapper: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  playButton: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  stageTrack: {
    width: wp(19),
    height: hp(0.9),
    borderRadius: hp(0.45),
    marginTop: hp(2),
    overflow: "hidden",
  },
  stageFill: {
    height: "100%",
    borderRadius: hp(0.45),
  },
  stageMetaRow: {
    flexDirection: "row",
    gap: wp(2.5),
    marginTop: hp(1.2),
  },
  stageMeta: {
    fontSize: hp(1.4),
    letterSpacing: 2,
  },
});
