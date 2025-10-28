import RadialBackground from '@/components/radial';
import { calculateGridLayout } from '@/helper';
import { useTimerStore } from '@/store';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Index Component
 * 
 * Main landing page of the Tambola Timer app.
 * Displays the app title, logo, and navigation buttons.
 */
const Index = () => {
  // Initialize router for navigation between screens
  const router = useRouter();
  const previousNumber=useTimerStore((state)=>state.previousNumber);
  const resetStore = useTimerStore.getState().resetStore;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    calculateGridLayout({top:insets.top,bottom:insets.bottom});
  }, []);


  return (
    <View style={{flex:1}}>
      <RadialBackground/>
    <View style={styles.container}>
     
      
      {/* App Logo */}
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
    
      {/* Main Navigation Card*/}
      <View style={styles.card}> 
        {/* Start Game Button */}
         <Pressable 
          style={({ pressed }) => [styles.startButton, pressed && styles.pressed]} 
          onPress={() => {
            resetStore();
            router.push("/gamescreen");
          }}
        >
          {({ pressed }) => (
            <Text style={[styles.text, pressed && {color:"#20BD61"}]}>
              Start New Game
            </Text>
          )}
        </Pressable>

         {/* Continue Button  */}
       { previousNumber !== null && (
        <Pressable style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]} onPress={() => router.push("/gamescreen")}>
          {({ pressed }) => (
            <Text style={[styles.text, pressed && {color:"#20BD61"}]}>
              Continue
            </Text>
          )}
        </Pressable>)}

        {/* Settings Button  */}
         <Pressable style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]} onPress={() => router.push("/settingscreen")}>
          {({ pressed }) => (
            <Text style={[styles.text, pressed && {color:"#20BD61"}]}>
              Settings
            </Text>
          )}
        </Pressable>
      </View> 
    </View>
    </View>
  )
}

export default Index

/**
 * Component Styles
 */
const styles = StyleSheet.create({
  container: {
    height: hp('100%'), // Full screen height
     width: wp('100%'), // Full screen width
    display:"flex",
    
    flexDirection:"row",
        justifyContent:"space-around",
    alignItems:"center",
    paddingLeft: wp('10%'),
  },
  logo: {
    width: wp('35%'),
    height: hp('65%'),
  },
  card: {
    backgroundColor: 'transparent',
    height: hp('40%'),
    width: wp('65%'),
    marginTop: hp('10%'),
   
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  startButton: {
    width: wp('40%'),
    height: hp('17%'),
    backgroundColor: '#20BD61',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    // Elevation / Shadow
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow color
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  settingsButton: {
    width: wp('25%'),
    height: hp('15%'),
    backgroundColor: 'rgba(32,189,97,0.2)',
        borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
     // Elevation / Shadow
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow color
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  text: {
    fontWeight: "bold", // Button text weight
    fontSize: hp('7%'), // Responsive font size
    color: '#ffffff', // Light gray text color
    textTransform: "uppercase",
  },
  pressed: {
    backgroundColor: "#ffffff", // Background color when button is pressed
    color: "#20BD61",
    fontWeight: "bold"
  },
});
