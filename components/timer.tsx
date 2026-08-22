import React, { useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
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
 * numeral over a linear progress bar (no ring). The ring fills the left
 * column slot from gamescreen — wide on tablets, smaller on phones — and
 * never wider/taller than that slot so it stays aligned with the controls.
 */
const Timer = ({ theme }: { theme: Theme }) => {
  const progress = useTimerStore((state) => state.progress);
  const currentNumber = useTimerStore((state) => state.currentNumber);
  const previousNumber = useTimerStore((state) => state.previousNumber);
  const { play_pause, togglePlayPause } = useTimerStore();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const availableHeight = windowHeight - insets.top - insets.bottom;
  const columnWidth = windowWidth * 0.29;

  // First-paint estimate: fill the left column, but leave room for the control bar.
  const estimatedSize = Math.min(columnWidth, availableHeight * 0.52);
  const [circleSize, setCircleSize] = useState(estimatedSize);

  const handleSlotLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;
    const next = Math.floor(Math.min(width, height));
    if (next !== circleSize) setCircleSize(next);
  };

  const handlePause = () => {
    togglePlayPause();
  };

  const label = currentNumber < 10 ? `0${currentNumber}` : `${currentNumber}`;
  const microLabel = play_pause ? "calling" : "paused";
  const numberSize = circleSize * 0.48;
  const microSize = Math.max(10, circleSize * 0.07);

  if (theme.id === "stage") {
    const stageNumeral = Math.min(circleSize * 0.72, hp(14));
    return (
      <View style={styles.container} onLayout={handleSlotLayout}>
        <TouchableOpacity onPress={handlePause} activeOpacity={0.8}>
          <Text
            style={{
              fontFamily: theme.font.display,
              fontSize: stageNumeral,
              lineHeight: stageNumeral,
              color: theme.accent,
            }}
          >
            {label}
          </Text>
        </TouchableOpacity>
        <View
          style={[styles.stageTrack, { backgroundColor: theme.surfaceBorder }]}
        >
          <View
            style={[
              styles.stageFill,
              {
                backgroundColor: theme.accent,
                width: `${Math.min(progress, 1) * 100}%`,
              },
            ]}
          />
        </View>
        <View style={styles.stageMetaRow}>
          <Text
            style={[
              styles.stageMeta,
              { color: theme.textDim, fontFamily: theme.font.body },
            ]}
          >
            {microLabel.toUpperCase()}
          </Text>
          {previousNumber !== null && (
            <Text
              style={[
                styles.stageMeta,
                { color: theme.textDim, fontFamily: theme.font.body },
              ]}
            >
              PREV {previousNumber}
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={handleSlotLayout}>
      <View
        style={[styles.timerWrapper, { width: circleSize, height: circleSize }]}
      >
        <CircularProgress
          progress={Math.round(progress * 100)}
          showLabel={false}
          outerCircleColor={theme.surfaceBorder}
          progressCircleColor={theme.accent}
          size={circleSize}
          strokeWidth={Math.max(3, circleSize * 0.045)}
        />

        <TouchableOpacity style={styles.playButton} onPress={handlePause}>
          <Text
            style={{
              fontFamily: theme.font.display,
              fontWeight: theme.font.displayWeight as any,
              fontSize: numberSize,
              lineHeight: numberSize * 1.05,
              color: theme.text,
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: microSize,
              letterSpacing: circleSize * 0.012,
              color: theme.textDim,
              textTransform: "uppercase",
              marginTop: -circleSize * 0.02,
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
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
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
