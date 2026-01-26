import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTimerStore } from "../store";
import CircularProgress from "./CircularProgress";

/**
 * Timer Component
 *
 * Displays a progress bar and play/pause button for controlling the Tambola timer.
 * Uses the global timer store to manage state and control playback.
 */
const Timer = () => {
  // Get timer state and control functions from the global store
  const progress = useTimerStore((state) => state.progress);
  const currentNumber = useTimerStore((state) => state.currentNumber);
  const gridLayout = useTimerStore((state) => state.gridLayout);
  const { play_pause, togglePlayPause } = useTimerStore();
  const insets = useSafeAreaInsets();
  const { height } = Dimensions.get("window");

  // const unitId = __DEV__
  //   ? TestIds.INTERSTITIAL
  //   : "ca-app-pub-2097672905689831/9745926177";

  const handlePause = () => {
    togglePlayPause();
  };

  // Circle covers 60% of available vertical space (minus safe area)
  const availableHeight = height - insets.top - insets.bottom;
  const circleSize =
    gridLayout.numColumns === 9
      ? availableHeight * 0.75
      : availableHeight * 0.8;

  // Adjust marginTop to visually align with grid
  const topMargin = availableHeight * 0.2; // ~5% of screen height

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + topMargin,
          paddingBottom: insets.bottom + 10,
        },
      ]}
    >
      <View
        style={[styles.timerWrapper, { width: circleSize, height: circleSize }]}
      >
        <CircularProgress
          progress={Math.round(progress * 100)}
          showLabel={false}
          outerCircleColor="#ffffff"
          progressCircleColor="#20BD61"
          size={circleSize}
          strokeWidth={circleSize * 0.03}
        />

        <TouchableOpacity style={styles.playButton} onPress={handlePause}>
          {play_pause ? (
            <Text style={[styles.numberText, { fontSize: circleSize * 0.6 }]}>
              {currentNumber < 10 ? `0${currentNumber}` : currentNumber}
            </Text>
          ) : (
            <FontAwesome5
              name="play"
              size={circleSize * 0.65}
              color="white"
              style={{ marginLeft: 50 }}
            />
          )}
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
    flex: 1, // occupy upper half (adjust as needed)
    justifyContent: "center",
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
  numberText: {
    fontWeight: "bold",
    color: "white",
  },
});
