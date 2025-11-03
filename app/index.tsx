import RadialBackground from '@/components/radial';
import { calculateGridLayout } from '@/helper';
import { useTimerStore } from '@/store';

import crashlytics from '@react-native-firebase/crashlytics';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import mobileAds, { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';
import Animated, { BounceIn } from 'react-native-reanimated';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Index Component
 * 
 * Main landing page of the Tambola Timer app.
 * Displays the app title, logo, and navigation buttons.
 */
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-2097672905689831/6487545007';

const Index = () => {



 useEffect(() => {
  mobileAds().initialize();
  crashlytics().log("testing crash")
crashlytics().crash()
}, []);

  const bannerRef = useRef<BannerAd>(null);

  // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
  // Therefore it's advised to "manually" request a new ad when the app is foregrounded (https://groups.google.com/g/google-admob-ads-sdk/c/rwBpqOUr8m8).
  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });
  
  // Initialize router for navigation between screens
  const router = useRouter();
  const previousNumber=useTimerStore((state)=>state.previousNumber);
  const resetStore = useTimerStore.getState().resetStore;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    calculateGridLayout({top:insets.top,bottom:insets.bottom});
  }, []);


  return (
    <View style={{flex:1,paddingBottom: 20}}>
      <RadialBackground/>
    <View style={styles.container}>
     
      
      {/* App Logo */}
      <Animated.View entering={BounceIn}>
      <Image source={require('../assets/images/logoo.png')} style={styles.logo} />
      </Animated.View>
    
      {/* Main Navigation Card*/}
      <View style={styles.card}> 
        {/* Start Game Button */}
 <Animated.View entering={BounceIn}>
  <Pressable
    onPress={() => {
      resetStore()
      router.push("/gamescreen")
    }}
    style={({ pressed }) => [
      styles.startButton,
      pressed && styles.pressed
    ]}
  >
    {({ pressed }) => (
      <Text style={[styles.text, pressed && { color: "#20BD61" }]}>
        Start New Game
      </Text>
    )}
  </Pressable>
</Animated.View>



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
        <Animated.View entering={BounceIn}>
         <Pressable style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]} onPress={() => router.push("/settingscreen")}>
          {({ pressed }) => (
            <Text style={[styles.text, pressed && {color:"#20BD61"}]}>
              Settings
            </Text>
          )}
        </Pressable>
        </Animated.View>
      </View> 
    </View>
    <View style={styles.bannerStyle}>
  <BannerAd
    ref={bannerRef}
    unitId={adUnitId}
    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
  />
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
    paddingLeft: wp('8%'),
  },
  logo: {
    width: wp('37%'),
    height: hp('67%'),
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
  bannerStyle:{
    position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',    // this centers the child horizontally
      
  }
});
