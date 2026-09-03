import * as Speech from "expo-speech";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ControlBar from "../components/controlBar";
import Grid from "../components/grid";
import PreviousModal from "../components/previousModal";
import ThemedBackground from "../components/radial";
import Timer from "../components/timer";
import { startTambolaGenerator } from "../helper";
import { useTimerStore } from "../store";
import { useTheme } from "../theme";

/**
 * Gamescreen Component
 *
 * Main game screen for the Tambola Timer app.
 * Displays current and previous numbers, controls, and the number grid.
 */
const Gamescreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  // Get state from global store
  const currentNumber = useTimerStore((state) => state.currentNumber);
  const soundVolume = useTimerStore((state) => state.soundVolume);
  const timerInterval = useTimerStore((state) => state.timerInterval);
  const language = useTimerStore((state) => state.language);
  const rate = useTimerStore((state) => state.rate);
  const pause_play = useTimerStore((state) => state.play_pause);

  // Start/stop number generator based on play/pause state
  useEffect(() => {
    let stop: any; // to store the cleanup function

    if (pause_play) {
      // only start if not paused
      stop = startTambolaGenerator(timerInterval);
    }

    return () => {
      if (stop) stop(); // cleanup the interval when paused or unmounted
    };
  }, [pause_play, timerInterval]);

  // Speak the current number using text-to-speech.
  // Single digit: "seven". Two-digit: "four", "five", "forty-five".
  useEffect(() => {
    if (!currentNumber) return;

    const numStr = currentNumber.toString();
    const voice = { language, rate, volume: soundVolume };

    Speech.stop();

    if (numStr.length === 1) {
      Speech.speak(numStr, voice);
    } else {
      Speech.speak(numStr[0], {
        ...voice,
        onDone: () => {
          Speech.speak(numStr[1], {
            ...voice,
            onDone: () => {
              Speech.speak(numStr, voice);
            },
          });
        },
      });
    }

    return () => {
      Speech.stop();
    };
  }, [currentNumber, language, rate, soundVolume]);

  const isWide = Dimensions.get("window").width > 1000;

  return (
    <View style={{ flex: 1 }}>
      <ThemedBackground />
      <PreviousModal theme={theme} />
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, hp(isWide ? 5 : 1.2)),
            paddingBottom: Math.max(insets.bottom, hp(isWide ? 5 : 1.2)),
            paddingLeft: insets.left + wp(2),
            paddingRight: insets.right + wp(2),
          },
        ]}
      >
        <View style={styles.leftPart}>
          <View style={styles.timerSlot}>
            <Timer theme={theme} />
          </View>
          <ControlBar theme={theme} />
        </View>
        <Grid theme={theme} />
      </View>
    </View>
  );
};

export default Gamescreen;

/**
 * Component Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1.5%"),
  },

  leftPart: {
    flexShrink: 0,
    flexGrow: 0,
    width: wp("29%"),
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    gap: hp(2.2),
  },

  // Lets the ring fill leftover space above the control bar, capped by column width.
  timerSlot: {
    width: "100%",
    maxHeight: "58%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  recentBlock: {
    width: "100%",
    alignItems: "center",
  },
  recentLabel: {
    fontSize: hp(1.5),
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: hp(0.8),
  },
  recentRow: {
    flexDirection: "row",
    gap: wp(1.3),
  },
  recentTile: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(1.1),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  recentTileText: {
    fontSize: hp(1.9),
    fontWeight: "600",
  },
});
