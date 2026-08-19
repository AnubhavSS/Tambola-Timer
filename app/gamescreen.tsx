import * as Speech from "expo-speech";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ControlBar from "../components/controlBar";
import Grid from "../components/grid";
import PatternChips from "../components/patternChips";
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
  const previousArray = useTimerStore((state) => state.previousArray);

  // Start/stop number generator based on play/pause state
  useEffect(() => {
    let stop:any; // to store the cleanup function

    if (pause_play) {
      // only start if not paused
      stop = startTambolaGenerator(timerInterval);
    }

    return () => {
      if (stop) stop(); // cleanup the interval when paused or unmounted
    };
  }, [pause_play, timerInterval]);



  // Speak the current number using text-to-speech
useEffect(() => {
  if (currentNumber) {
    const numStr = currentNumber.toString();

    // single-digit number
    if (numStr.length === 1) {
      Speech.speak(numStr, {
        language,
        rate,
        volume: soundVolume,
      });
      return;
    }

    // two-digit number: speak first, then second, then whole number
    const firstDigit = numStr[0];
    const secondDigit = numStr[1];

    Speech.speak(firstDigit, {
      language,
      rate,
      volume: soundVolume,
      onDone: () => {
        Speech.speak(secondDigit, {
          language,
          rate,
          volume: soundVolume,
          onDone: () => {
            Speech.speak(numStr, {
              language,
              rate,
              volume: soundVolume,
            });
          },
        });
      },
    });
  }
}, [currentNumber]);

  const recent = previousArray.slice(0, 4);

  return (
    <View style={{flex:1}}>
      <ThemedBackground/>
       <PreviousModal theme={theme}/>
      <View style={styles.container}>
       <View style={[styles.leftPart, { paddingBottom: insets.bottom + hp(1) }]}>
       <Timer theme={theme} />

       {recent.length > 0 && (
         <View style={styles.recentBlock}>
           <Text style={[styles.recentLabel, { color: theme.textDim, fontFamily: theme.font.body }]}>Last</Text>
           <View style={styles.recentRow}>
             {recent.map((n, i) => (
               <View
                 key={`${n}-${i}`}
                 style={[
                   styles.recentTile,
                   { backgroundColor: theme.surface, borderColor: theme.surfaceBorder },
                 ]}
               >
                 <Text style={[styles.recentTileText, { color: theme.text }]}>{n}</Text>
               </View>
             ))}
           </View>
         </View>
       )}

       <ControlBar theme={theme} />

       <PatternChips theme={theme} />

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
  // flex: 1,
  width: wp("100%"),
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginHorizontal: wp("6%"),
  gap: wp("4%"),
  ...(Dimensions.get("window").width > 1000 && {
    paddingVertical: hp("5%"),
  }),
},

   leftPart: {
  flexShrink: 0,
  flexGrow: 0,
  width: wp("29%"),
  alignItems: "center",
  justifyContent: "center",
  marginLeft: wp("3%"),
  gap: hp(2.2),
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
   }
);
