import Games from "@/components/games";
import Grid from "@/components/grid";
import PreviousModal from "@/components/previousModal";
import RadialBackground from "@/components/radial";
import Timer from "@/components/timer";
import { startTambolaGenerator } from "@/helper";
import { useTimerStore } from "@/store";
import * as Speech from "expo-speech";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

/**
 * Gamescreen Component
 * 
 * Main game screen for the Tambola Timer app.
 * Displays current and previous numbers, controls, and the number grid.
 */
const Gamescreen = () => {
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

  return (
    <View style={{flex:1}}>
      <RadialBackground/>
       <PreviousModal/>
      <View style={styles.container}> 
       <View style={styles.leftPart}>
       <Timer />
       <Games />
    
       </View>
       <Grid /> 
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
   display:"flex",
   flexDirection:"row",
   width:wp('100%'),
    marginBottom:hp('2%'),
    gap:wp('5%'),
    marginHorizontal:wp('4%'),
     },
   leftPart:{
    display:"flex",
    flexDirection:"column",
    width:wp('30%'),
    height:hp('90%'),
    alignItems:"center",
    justifyContent:"center",
    gap:hp('4%'),
   }

   }
);
