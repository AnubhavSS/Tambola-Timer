import { useTimerStore } from '@/store';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import CircularProgress from './CircularProgress';

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
    const {play_pause, togglePlayPause} = useTimerStore();
   
    
    return (
        <View style={styles.container}>
           
                {/* Progress indicator for the timer */}
                <CircularProgress
     progress={Math.round(progress*100)} showLabel={false} outerCircleColor="#ffffff" progressCircleColor="#20BD61" size={hp('70%')} strokeWidth={hp('2%')}
     />
                 
                {/* Play/Pause toggle button  */}
                 <TouchableOpacity style={styles.play} onPress={() => togglePlayPause()}>
                    {play_pause 
                        ? <Text style={styles.text}>{currentNumber < 10 ? `0${currentNumber}` : currentNumber}</Text>
                        : <FontAwesome5 name="play" size={hp('40')} color="white" style={styles.playBtn}/>
                    }
                </TouchableOpacity>
           
        </View>
    )
}

export default Timer

/**
 * Component Styles
 */
const styles = StyleSheet.create({

  container:{
    position:"relative",
    marginTop:hp('6%'),
  },
  
    play: {
        width:wp('40%'),
          position:"absolute",
    left:wp('4.5%'),
    top:hp('1'),
    },
     text: {
     fontSize: hp(48),
    fontWeight: "bold",
    color: "#ffffff",
  },
  playBtn:{
    left:wp('8%'),
    top:hp('12'),
  }
})